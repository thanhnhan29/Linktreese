// =============================================================================
// ECOMMERCE BLOCK SERVICE
// =============================================================================
// Business logic for Ecommerce block - Product metadata extraction
// Supports: Shopee.vn, Lazada.vn

import type {
  EcommercePlatform,
  ProductMetadata,
  EcommerceUrlValidation,
  FetchProductResult,
  EcommerceErrorType,
} from '@/shared/types/ecommerce';

// =============================================================================
// CONSTANTS
// =============================================================================

/** Placeholder image for products without images */
export const PLACEHOLDER_IMAGE = 'https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image';

/** Allowed ecommerce domains */
const ECOMMERCE_DOMAINS: Record<EcommercePlatform, string[]> = {
  shopee: ['shopee.vn', 'www.shopee.vn', 's.shopee.vn'],
  lazada: ['lazada.vn', 'www.lazada.vn', 's.lazada.vn'],
};

/** Error messages in English */
export const ECOMMERCE_ERROR_MESSAGES: Record<EcommerceErrorType, string> = {
  INVALID_DOMAIN: 'URL is not supported. Please use a link from Shopee or Lazada.',
  INVALID_URL: 'Invalid URL format. Please check the link and try again.',
  NETWORK_ERROR: 'Internet connection lost. Please check your connection and try again.',
  EXTRACTION_FAILED: 'Unable to retrieve product information. Please check the URL or try again later.',
  PRODUCT_NOT_FOUND: 'Product not found. The product may have been removed or the link is invalid.',
  UNKNOWN: 'An unexpected error occurred. Please try again later.',
};

/** Mock failure rates for testing edge cases */
const MOCK_NETWORK_FAILURE_RATE = 0.05; // 5% chance
const MOCK_EXTRACTION_FAILURE_RATE = 0.03; // 3% chance
const MOCK_PARTIAL_DATA_RATE = 0.1; // 10% chance (no image)

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate and detect ecommerce platform from URL
 */
export function validateEcommerceUrl(url: string): EcommerceUrlValidation {
  if (!url || !url.trim()) {
    return {
      isValid: false,
      error: ECOMMERCE_ERROR_MESSAGES.INVALID_URL,
      errorType: 'INVALID_URL',
    };
  }

  let normalizedUrl = url.trim();

  // Add protocol if missing
  if (!normalizedUrl.match(/^https?:\/\//i)) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  try {
    const parsed = new URL(normalizedUrl);
    const hostname = parsed.hostname.toLowerCase();

    // Check Shopee
    if (ECOMMERCE_DOMAINS.shopee.some(domain => hostname === domain || hostname.endsWith('.' + domain))) {
      return { isValid: true, platform: 'shopee' };
    }

    // Check Lazada
    if (ECOMMERCE_DOMAINS.lazada.some(domain => hostname === domain || hostname.endsWith('.' + domain))) {
      return { isValid: true, platform: 'lazada' };
    }

    return {
      isValid: false,
      error: ECOMMERCE_ERROR_MESSAGES.INVALID_DOMAIN,
      errorType: 'INVALID_DOMAIN',
    };
  } catch {
    return {
      isValid: false,
      error: ECOMMERCE_ERROR_MESSAGES.INVALID_URL,
      errorType: 'INVALID_URL',
    };
  }
}

// =============================================================================
// MOCK API SERVICE
// =============================================================================

/**
 * Simulate network delay
 */
function simulateDelay(ms: number = 1500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock product data based on platform
 */
function generateMockProductData(url: string, platform: EcommercePlatform, hasImage: boolean): ProductMetadata {
  const products = {
    shopee: [
      {
        title: 'Premium Wireless Headphones - High Quality Sound',
        image: hasImage ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' : PLACEHOLDER_IMAGE,
        price: '₫599,000',
      },
      {
        title: 'Áo Thun Nam Cotton 100% - Nhiều Màu',
        image: hasImage ? 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' : PLACEHOLDER_IMAGE,
        price: '₫189,000',
      },
      {
        title: 'Balo Laptop Chống Nước 15.6 inch',
        image: hasImage ? 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' : PLACEHOLDER_IMAGE,
        price: '₫299,000',
      },
    ],
    lazada: [
      {
        title: 'Smart Watch - Fitness Tracker & Health Monitor',
        image: hasImage ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' : PLACEHOLDER_IMAGE,
        price: '₫1,299,000',
      },
      {
        title: 'Tai Nghe Bluetooth True Wireless',
        image: hasImage ? 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400' : PLACEHOLDER_IMAGE,
        price: '₫450,000',
      },
      {
        title: 'Máy Pha Cà Phê Tự Động Mini',
        image: hasImage ? 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400' : PLACEHOLDER_IMAGE,
        price: '₫899,000',
      },
    ],
  };

  // Select random product from platform
  const platformProducts = products[platform];
  const randomProduct = platformProducts[Math.floor(Math.random() * platformProducts.length)];

  return {
    ...randomProduct,
    url: url,
    platform: platform,
    originalUrl: url,
  };
}

/**
 * Fetch product metadata from URL (Mock implementation)
 * In production, this would call a backend API or scraper service
 */
export async function fetchProductMetadata(url: string): Promise<FetchProductResult> {
  // Step 1: Validate URL
  const validation = validateEcommerceUrl(url);
  if (!validation.isValid || !validation.platform) {
    return {
      success: false,
      error: validation.error,
      errorType: validation.errorType,
    };
  }

  // Step 2: Simulate network delay
  await simulateDelay(1500);

  // Step 3: Simulate network failure (5% chance)
  if (Math.random() < MOCK_NETWORK_FAILURE_RATE) {
    return {
      success: false,
      error: ECOMMERCE_ERROR_MESSAGES.NETWORK_ERROR,
      errorType: 'NETWORK_ERROR',
    };
  }

  // Step 4: Simulate extraction failure (3% chance)
  if (Math.random() < MOCK_EXTRACTION_FAILURE_RATE) {
    return {
      success: false,
      error: ECOMMERCE_ERROR_MESSAGES.EXTRACTION_FAILED,
      errorType: 'EXTRACTION_FAILED',
    };
  }

  // Step 5: Generate mock data (10% chance of no image - will use placeholder)
  const hasImage = Math.random() >= MOCK_PARTIAL_DATA_RATE;
  const productData = generateMockProductData(url, validation.platform, hasImage);

  return {
    success: true,
    data: productData,
  };
}

// =============================================================================
// SERVICE EXPORT
// =============================================================================

export const ecommerceService = {
  validateUrl: validateEcommerceUrl,
  fetchProduct: fetchProductMetadata,
  PLACEHOLDER_IMAGE,
  ERROR_MESSAGES: ECOMMERCE_ERROR_MESSAGES,
};
