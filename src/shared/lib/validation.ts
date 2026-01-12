// src/shared/lib/validation.ts
// Validation utilities following business rules

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  errors?: string[];
}

// Reserved usernames that cannot be used
const RESERVED_USERNAMES = [
  'admin', 'api', 'app', 'bio', 'dashboard', 'help',
  'login', 'logout', 'register', 'settings', 'support',
  'user', 'vielink', 'www', 'null', 'undefined', 'root',
  'system', 'test', 'demo', 'public', 'private',
];

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  if (email.length > 50) {
    return { isValid: false, error: 'Email cannot exceed 50 characters' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

/**
 * Validate password strength
 * Rules: minimum 8 chars, at least one uppercase, lowercase, and number
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (!password) {
    return { isValid: false, error: 'Password is required', errors: ['Password is required'] };
  }

  if (password.length > 50) {
    return { isValid: false, error: 'Password cannot exceed 50 characters' };
  }

  if (password.length < 8) {
    errors.push('at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('one number');
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      error: `Password must contain ${errors.join(', ')}`,
      errors,
    };
  }

  return { isValid: true };
}

/**
 * Validate username format and rules
 */
export function validateUsername(username: string): ValidationResult {
  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 30) {
    return { isValid: false, error: 'Username cannot exceed 30 characters' };
  }

  if (!/^[a-zA-Z0-9]/.test(username)) {
    return { isValid: false, error: 'Username must start with a letter or number' };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      isValid: false,
      error: 'Username can only contain letters, numbers, and underscores',
    };
  }

  if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
    return { isValid: false, error: 'This username is reserved' };
  }

  return { isValid: true };
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): ValidationResult {
  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }

  let normalizedUrl = url.trim();

  // Add protocol if missing
  if (!normalizedUrl.match(/^https?:\/\//i)) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  try {
    const parsed = new URL(normalizedUrl);

    // Block dangerous protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { isValid: false, error: 'Invalid URL protocol' };
    }

    // Basic domain validation
    if (!parsed.hostname.includes('.')) {
      return { isValid: false, error: 'Invalid domain' };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validate hex color format
 */
export function validateHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Validate Vietnamese phone number format
 */
export function validateVietnamesePhone(phone: string): ValidationResult {
  const cleaned = phone.replace(/[\s-]/g, '');

  if (!cleaned) {
    return { isValid: false, error: 'Phone number is required' };
  }

  if (!/^0[0-9]{9}$/.test(cleaned)) {
    return { isValid: false, error: 'Phone must be 10 digits starting with 0' };
  }

  return { isValid: true };
}

