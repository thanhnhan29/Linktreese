// =============================================================================
// DONATE BLOCK TYPES
// =============================================================================

/** Supported payment methods */
export type DonatePaymentMethod = 'vietqr' | 'momo' | 'zalopay';

/** Donate block configuration data */
export interface DonateBlockData {
  title: string;
  method: DonatePaymentMethod;
  qrImage?: string;        // For VietQR - stored image path
  paymentLink?: string;    // For Momo/ZaloPay - payment URL
}

/** Error types for donate operations */
export type DonateErrorType =
  | 'MISSING_TITLE'
  | 'MISSING_PAYMENT_DATA'
  | 'INVALID_FILE_TYPE'
  | 'FILE_TOO_LARGE'
  | 'UPLOAD_FAILED'
  | 'INVALID_PAYMENT_LINK'
  | 'UNKNOWN';

/** Validation result for donate block */
export interface DonateValidation {
  isValid: boolean;
  error?: string;
  errorType?: DonateErrorType;
  field?: 'title' | 'qrImage' | 'paymentLink';
}

/** Result from uploading QR image */
export interface UploadQRResult {
  success: boolean;
  imagePath?: string;
  error?: string;
  errorType?: DonateErrorType;
}

/** Payment link validation result */
export interface PaymentLinkValidation {
  isValid: boolean;
  method?: DonatePaymentMethod;
  error?: string;
}
