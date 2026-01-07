// =============================================================================
// ECOMMERCE BLOCK TYPES
// =============================================================================

/** Supported ecommerce platforms */
export type EcommercePlatform = 'shopee' | 'lazada';

/** Product metadata extracted from URL */
export interface ProductMetadata {
  title: string;
  image: string;
  price: string;
  url: string;
  platform: EcommercePlatform;
  originalUrl: string;
}

/** Ecommerce block data stored in link */
export interface EcommerceBlockData {
  title: string;
  image: string;
  price: string;
  url: string;
  platform: EcommercePlatform;
}

/** Error types for ecommerce operations */
export type EcommerceErrorType = 
  | 'INVALID_DOMAIN'
  | 'INVALID_URL'
  | 'NETWORK_ERROR'
  | 'EXTRACTION_FAILED'
  | 'PRODUCT_NOT_FOUND'
  | 'UNKNOWN';

/** Validation result for URL */
export interface EcommerceUrlValidation {
  isValid: boolean;
  platform?: EcommercePlatform;
  error?: string;
  errorType?: EcommerceErrorType;
}

/** Result from fetching product metadata */
export interface FetchProductResult {
  success: boolean;
  data?: ProductMetadata;
  error?: string;
  errorType?: EcommerceErrorType;
}
