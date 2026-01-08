// =============================================================================
// CONTACT FORM BLOCK TYPES
// =============================================================================

/** Contact block configuration data */
export interface ContactBlockData {
  title: string;
  receiverEmail: string;
  successMessage?: string;
}

/** Contact form submission data */
export interface ContactFormSubmission {
  name: string;
  email: string;
  message: string;
}

/** Error types for contact operations */
export type ContactErrorType =
  | 'EMPTY_FIELD'
  | 'INVALID_EMAIL'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'RATE_LIMITED'
  | 'UNKNOWN';

/** Validation result for contact form */
export interface ContactFormValidation {
  isValid: boolean;
  errors?: {
    name?: string;
    email?: string;
    message?: string;
  };
}

/** Result from sending contact message */
export interface SendContactResult {
  success: boolean;
  error?: string;
  errorType?: ContactErrorType;
}

/** Contact block configuration validation */
export interface ContactConfigValidation {
  isValid: boolean;
  error?: string;
  errorType?: ContactErrorType;
  field?: 'title' | 'receiverEmail';
}
