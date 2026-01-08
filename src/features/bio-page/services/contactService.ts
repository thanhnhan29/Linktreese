// =============================================================================
// CONTACT FORM BLOCK SERVICE
// =============================================================================
// Business logic for Contact Form block - Email submission handling via Google Apps Script

import type {
  ContactBlockData,
  ContactFormSubmission,
  ContactFormValidation,
  SendContactResult,
  ContactErrorType,
  ContactConfigValidation,
} from '@/shared/types/contact';

// =============================================================================
// CONSTANTS
// =============================================================================

/** Google Apps Script URL from environment variable */
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL as string;

/** Error messages in English */
export const CONTACT_ERROR_MESSAGES: Record<ContactErrorType, string> = {
  EMPTY_FIELD: 'This field cannot be empty.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  NETWORK_ERROR: 'Failed to send message. Please check your internet connection and try again.',
  SERVER_ERROR: 'Failed to send message. Please try again later.',
  RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
  UNKNOWN: 'An unexpected error occurred. Please try again later.',
};

/** Email regex pattern */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate contact block configuration (when creating/editing block)
 */
export function validateContactConfig(data: Partial<ContactBlockData>): ContactConfigValidation {
  // Check title
  if (!data.title?.trim()) {
    return {
      isValid: false,
      error: CONTACT_ERROR_MESSAGES.EMPTY_FIELD,
      errorType: 'EMPTY_FIELD',
      field: 'title',
    };
  }

  // Check receiver email
  if (!data.receiverEmail?.trim()) {
    return {
      isValid: false,
      error: CONTACT_ERROR_MESSAGES.EMPTY_FIELD,
      errorType: 'EMPTY_FIELD',
      field: 'receiverEmail',
    };
  }

  // Validate email format
  if (!EMAIL_REGEX.test(data.receiverEmail.trim())) {
    return {
      isValid: false,
      error: CONTACT_ERROR_MESSAGES.INVALID_EMAIL,
      errorType: 'INVALID_EMAIL',
      field: 'receiverEmail',
    };
  }

  return { isValid: true };
}

/**
 * Validate contact form submission (when guest submits form)
 */
export function validateContactForm(data: ContactFormSubmission): ContactFormValidation {
  const errors: ContactFormValidation['errors'] = {};

  // Validate name
  if (!data.name?.trim()) {
    errors.name = CONTACT_ERROR_MESSAGES.EMPTY_FIELD;
  }

  // Validate email
  if (!data.email?.trim()) {
    errors.email = CONTACT_ERROR_MESSAGES.EMPTY_FIELD;
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = CONTACT_ERROR_MESSAGES.INVALID_EMAIL;
  }

  // Validate message
  if (!data.message?.trim()) {
    errors.message = CONTACT_ERROR_MESSAGES.EMPTY_FIELD;
  }

  const hasErrors = Object.keys(errors).length > 0;
  
  return {
    isValid: !hasErrors,
    errors: hasErrors ? errors : undefined,
  };
}

// =============================================================================
// API SERVICE - Google Apps Script Integration
// =============================================================================

/**
 * Payload structure for Google Apps Script API
 */
interface ContactApiPayload {
  toEmail: string;
  name: string;
  email: string;
  message: string;
}

/**
 * Send contact form message via Google Apps Script
 * 
 * Due to CORS restrictions with Google Apps Script, we use 'no-cors' mode.
 * This means we cannot read the response, but the request will still be sent.
 * We consider the request successful if no network error occurs.
 */
export async function sendContactMessage(
  formData: ContactFormSubmission,
  receiverEmail: string
): Promise<SendContactResult> {
  console.log("1. BẮT ĐẦU GỬI MAIL");
  console.log("--- URL API:", GOOGLE_SCRIPT_URL); 
  console.log("--- Receiver:", receiverEmail);
  // Step 1: Validate form data
  const validation = validateContactForm(formData);
  if (!validation.isValid) {
    return {
      success: false,
      error: 'Please fill in all required fields correctly.',
      errorType: 'EMPTY_FIELD',
    };
  }

  // Step 2: Check if Google Script URL is configured
  if (!GOOGLE_SCRIPT_URL) {
    console.error('[ContactService] VITE_GOOGLE_SCRIPT_URL is not configured');
    return {
      success: false,
      error: CONTACT_ERROR_MESSAGES.SERVER_ERROR,
      errorType: 'SERVER_ERROR',
    };
  }

  // Step 3: Prepare payload
  const payload: ContactApiPayload = {
    toEmail: receiverEmail.trim(),
    name: formData.name.trim(),
    email: formData.email.trim(),
    message: formData.message.trim(),
  };

  console.log('[ContactService] Sending message to:', receiverEmail);

  try {
    // Step 4: Send request to Google Apps Script
    // Google Apps Script web apps handle CORS automatically when deployed with "Anyone" access
    // We use 'cors' mode and handle redirects properly
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow', // Google Apps Script may redirect
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    // Try to read response if possible
    let responseData = null;
    try {
      const text = await response.text();
      if (text) {
        responseData = JSON.parse(text);
      }
    } catch {
      // Response might not be readable (CORS) - that's okay
    }

    console.log('[ContactService] Response:', {
      status: response.status,
      ok: response.ok,
      type: response.type,
      data: responseData,
    });

    // Check if server returned an error
    if (responseData?.status === 'error') {
      console.error('[ContactService] Server error:', responseData.message);
      return {
        success: false,
        error: CONTACT_ERROR_MESSAGES.SERVER_ERROR,
        errorType: 'SERVER_ERROR',
      };
    }

    // Success - request was sent
    console.log('[ContactService] Message sent successfully:', {
      to: receiverEmail,
      from: formData.email,
      name: formData.name,
    });

    return {
      success: true,
    };
  } catch (error) {
    // Network error - failed to send request
    console.error('[ContactService] Network error:', error);
    
    return {
      success: false,
      error: CONTACT_ERROR_MESSAGES.NETWORK_ERROR,
      errorType: 'NETWORK_ERROR',
    };
  }
}

/**
 * Format success message
 */
export function getSuccessMessage(customMessage?: string): string {
  return customMessage || 'Thank you! Your message has been sent successfully.';
}

// =============================================================================
// SERVICE EXPORT
// =============================================================================

export const contactService = {
  validateConfig: validateContactConfig,
  validateForm: validateContactForm,
  sendMessage: sendContactMessage,
  getSuccessMessage,
  ERROR_MESSAGES: CONTACT_ERROR_MESSAGES,
};
