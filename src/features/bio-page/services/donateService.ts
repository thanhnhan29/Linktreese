// =============================================================================
// DONATE BLOCK SERVICE
// =============================================================================
// Business logic for Donate block - Payment methods: VietQR, Momo, ZaloPay

import type {
  DonatePaymentMethod,
  DonateBlockData,
  DonateValidation,
  DonateErrorType,
  UploadQRResult,
  PaymentLinkValidation,
} from '@/shared/types/donate';
import { uploadImage, fileToDataUrl } from '@/infrastructure/storage/fileImageStorage';

// =============================================================================
// CONSTANTS
// =============================================================================

/** Error messages in English */
export const DONATE_ERROR_MESSAGES: Record<DonateErrorType, string> = {
  MISSING_TITLE: 'Button title is required.',
  MISSING_PAYMENT_DATA: 'Please upload a QR code or enter a payment link.',
  INVALID_FILE_TYPE: 'Invalid file format. Please upload .PNG, .JPG, or .JPEG only.',
  FILE_TOO_LARGE: 'File size too large. Maximum size is 5MB.',
  UPLOAD_FAILED: 'Failed to upload QR image. Please try again.',
  INVALID_PAYMENT_LINK: 'Invalid payment link format.',
  UNKNOWN: 'An unexpected error occurred. Please try again later.',
};

/** Allowed image MIME types */
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

/** Maximum file size in bytes (5MB) */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/** Payment link patterns for validation */
const PAYMENT_LINK_PATTERNS: Record<Exclude<DonatePaymentMethod, 'vietqr'>, RegExp[]> = {
  momo: [
    /^https?:\/\/(me\.momo\.vn|momo\.vn)/i,
    /^https?:\/\/.*momo/i,
  ],
  zalopay: [
    /^https?:\/\/(zalopay\.vn|zalo\.me)/i,
    /^https?:\/\/.*zalopay/i,
  ],
};

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate donate block configuration
 */
export function validateDonateBlock(data: Partial<DonateBlockData>): DonateValidation {
  // Check title
  if (!data.title?.trim()) {
    return {
      isValid: false,
      error: DONATE_ERROR_MESSAGES.MISSING_TITLE,
      errorType: 'MISSING_TITLE',
      field: 'title',
    };
  }

  // Check payment data based on method
  if (data.method === 'vietqr') {
    if (!data.qrImage) {
      return {
        isValid: false,
        error: DONATE_ERROR_MESSAGES.MISSING_PAYMENT_DATA,
        errorType: 'MISSING_PAYMENT_DATA',
        field: 'qrImage',
      };
    }
  } else {
    if (!data.paymentLink?.trim()) {
      return {
        isValid: false,
        error: DONATE_ERROR_MESSAGES.MISSING_PAYMENT_DATA,
        errorType: 'MISSING_PAYMENT_DATA',
        field: 'paymentLink',
      };
    }
  }

  return { isValid: true };
}

/**
 * Validate image file for QR upload
 */
export function validateQRImage(file: File): DonateValidation {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: DONATE_ERROR_MESSAGES.INVALID_FILE_TYPE,
      errorType: 'INVALID_FILE_TYPE',
      field: 'qrImage',
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: DONATE_ERROR_MESSAGES.FILE_TOO_LARGE,
      errorType: 'FILE_TOO_LARGE',
      field: 'qrImage',
    };
  }

  return { isValid: true };
}

/**
 * Validate payment link format
 */
export function validatePaymentLink(
  link: string,
  method: Exclude<DonatePaymentMethod, 'vietqr'>
): PaymentLinkValidation {
  if (!link?.trim()) {
    return { isValid: false, error: DONATE_ERROR_MESSAGES.MISSING_PAYMENT_DATA };
  }

  // Check if link matches any pattern for the method
  const patterns = PAYMENT_LINK_PATTERNS[method];
  const isValid = patterns.some(pattern => pattern.test(link.trim()));

  if (!isValid) {
    return {
      isValid: false,
      error: `Invalid ${method === 'momo' ? 'Momo' : 'ZaloPay'} payment link.`,
    };
  }

  return { isValid: true, method };
}

/**
 * Detect payment method from link
 */
export function detectPaymentMethod(link: string): DonatePaymentMethod | null {
  if (!link?.trim()) return null;
  
  const normalizedLink = link.trim().toLowerCase();
  
  if (normalizedLink.includes('momo')) return 'momo';
  if (normalizedLink.includes('zalopay') || normalizedLink.includes('zalo.me')) return 'zalopay';
  
  return null;
}

// =============================================================================
// FILE UPLOAD
// =============================================================================

/**
 * Upload QR code image
 * Uses the project's fileImageStorage service
 */
export async function uploadQRImage(file: File, blockId: string): Promise<UploadQRResult> {
  // Validate file first
  const validation = validateQRImage(file);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error,
      errorType: validation.errorType,
    };
  }

  try {
    // Convert file to data URL
    const dataUrl = await fileToDataUrl(file);
    
    // Upload using fileImageStorage service
    // Using 'profile' type with 'qr-' prefix for QR images
    const imagePath = await uploadImage('profile', `qr-${blockId}`, dataUrl);
    
    if (!imagePath) {
      return {
        success: false,
        error: DONATE_ERROR_MESSAGES.UPLOAD_FAILED,
        errorType: 'UPLOAD_FAILED',
      };
    }

    return {
      success: true,
      imagePath,
    };
  } catch (error) {
    console.error('[DonateService] Upload error:', error);
    return {
      success: false,
      error: DONATE_ERROR_MESSAGES.UPLOAD_FAILED,
      errorType: 'UPLOAD_FAILED',
    };
  }
}

/**
 * Convert file to preview URL (for immediate display before upload)
 */
export function createImagePreview(file: File): Promise<string> {
  return fileToDataUrl(file);
}

// =============================================================================
// SERVICE EXPORT
// =============================================================================

export const donateService = {
  validateBlock: validateDonateBlock,
  validateQRImage,
  validatePaymentLink,
  detectPaymentMethod,
  uploadQRImage,
  createImagePreview,
  ERROR_MESSAGES: DONATE_ERROR_MESSAGES,
};
