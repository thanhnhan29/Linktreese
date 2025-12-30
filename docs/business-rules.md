# VieLink - Business Rules

## 1. Overview

This document defines the business rules, validation logic, and constraints for the VieLink platform. These rules ensure data integrity, security, and consistent user experience across the application.

---

## 2. User Account Rules

### 2.1 Registration Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-U001 | Email must be unique across all users | Check against Firestore before creation |
| BR-U002 | Email must be valid format | Regex validation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| BR-U003 | Password minimum 8 characters | Client and server validation |
| BR-U004 | Password must contain uppercase letter | Regex: `/[A-Z]/` |
| BR-U005 | Password must contain lowercase letter | Regex: `/[a-z]/` |
| BR-U006 | Password must contain number | Regex: `/[0-9]/` |
| BR-U007 | Password and confirm must match | Client-side comparison |

**Password Validation Function:**

```typescript
interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

### 2.2 Authentication Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-U010 | Max 5 failed login attempts | Track in memory/localStorage, lockout for 15 min |
| BR-U011 | Password reset link expires in 10 minutes | Firebase Auth default, verify on backend |
| BR-U012 | Session persists until explicit logout | Firebase Auth persistence: `inMemoryPersistence` (current) |
| BR-U013 | OAuth users cannot use password reset | Check `authProvider` before sending reset email |

### 2.3 Profile Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-U020 | Display name max 100 characters | Client + Firestore rules validation |
| BR-U021 | Avatar must be JPG or PNG | MIME type check on upload |
| BR-U022 | Avatar max size 2MB | File size check before upload |
| BR-U023 | Avatar dimensions min 100x100px | Image dimension validation |

---

## 3. Bio Page Rules

### 3.1 Username Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-P001 | Username must be unique | Real-time Firestore query |
| BR-P002 | Username 3-30 characters | Length validation |
| BR-P003 | Username only alphanumeric + underscore | Regex: `/^[a-zA-Z0-9_]+$/` |
| BR-P004 | Username cannot start with underscore | Regex: `/^[a-zA-Z0-9]/` |
| BR-P005 | Username case-insensitive uniqueness | Store and compare lowercase |
| BR-P006 | Reserved usernames blocked | Check against blacklist |

**Username Validation Function:**

```typescript
const RESERVED_USERNAMES = [
  'admin', 'api', 'app', 'bio', 'dashboard', 'help',
  'login', 'logout', 'register', 'settings', 'support',
  'user', 'vielink', 'www', 'null', 'undefined',
];

interface UsernameValidation {
  isValid: boolean;
  error?: string;
}

function validateUsername(username: string): UsernameValidation {
  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }
  if (username.length > 30) {
    return { isValid: false, error: 'Username cannot exceed 30 characters' };
  }
  if (!/^[a-zA-Z0-9]/.test(username)) {
    return { isValid: false, error: 'Username must start with letter or number' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
    return { isValid: false, error: 'This username is reserved' };
  }
  
  return { isValid: true };
}

async function checkUsernameAvailable(username: string): Promise<boolean> {
  const q = query(
    collection(db, 'bio_pages'),
    where('username', '==', username.toLowerCase())
  );
  const snapshot = await getDocs(q);
  return snapshot.empty;
}
```

### 3.2 Bio Page Content Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-P010 | Bio description max 200 characters | Character counter + truncation |
| BR-P011 | Bio supports line breaks | Store `\n`, render as `<br>` |
| BR-P012 | User can have unlimited bio pages | No limit enforced |
| BR-P013 | Each bio page independent | Separate Firestore documents |
| BR-P014 | Default page state: published=true | Set on creation |

### 3.3 Appearance Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-P020 | Background image max 2MB | File size validation |
| BR-P021 | Background image JPG/PNG only | MIME type check |
| BR-P022 | Colors must be valid hex | Regex: `/^#[0-9A-Fa-f]{6}$/` |
| BR-P023 | Font must be from approved list | Validate against Google Fonts list |
| BR-P024 | Changes auto-save after 500ms | Debounced save function |
| BR-P025 | Preview updates < 500ms | Real-time local state update |

**Color Validation Function:**

```typescript
function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

function sanitizeThemeConfig(config: Partial<ThemeConfig>): ThemeConfig {
  return {
    backgroundType: config.backgroundType || 'solid',
    backgroundValue: isValidHexColor(config.backgroundValue || '') 
      ? config.backgroundValue! 
      : '#ffffff',
    buttonStyle: config.buttonStyle || 'rounded',
    buttonColor: isValidHexColor(config.buttonColor || '') 
      ? config.buttonColor! 
      : '#8129d9',
    buttonTextColor: isValidHexColor(config.buttonTextColor || '') 
      ? config.buttonTextColor! 
      : '#ffffff',
    buttonShadow: config.buttonShadow ?? false,
    fontFamily: validateFont(config.fontFamily) 
      ? config.fontFamily! 
      : 'Inter',
    // ... other fields
  };
}
```

---

## 4. Link Management Rules

### 4.1 Link Creation Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-L001 | Link title max 100 characters | Truncate on save |
| BR-L002 | Link URL must be valid | URL validation with protocol |
| BR-L003 | URL must have http/https protocol | Prepend https:// if missing |
| BR-L004 | Unlimited links per page | No artificial limit |
| BR-L005 | New links added at bottom | Set order = max(existing orders) + 1 |
| BR-L006 | Default link state: active=true | Set on creation |

**URL Validation Function:**

```typescript
interface UrlValidation {
  isValid: boolean;
  normalizedUrl: string;
  error?: string;
}

function validateAndNormalizeUrl(url: string): UrlValidation {
  let normalized = url.trim();
  
  // Add protocol if missing
  if (!normalized.match(/^https?:\/\//i)) {
    normalized = 'https://' + normalized;
  }
  
  try {
    const parsed = new URL(normalized);
    
    // Basic domain validation
    if (!parsed.hostname.includes('.')) {
      return { isValid: false, normalizedUrl: '', error: 'Invalid domain' };
    }
    
    return { isValid: true, normalizedUrl: normalized };
  } catch {
    return { isValid: false, normalizedUrl: '', error: 'Invalid URL format' };
  }
}
```

### 4.2 Link Ordering Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-L010 | Order values must be unique per page | Assign sequential integers |
| BR-L011 | Reorder uses swap logic | Atomic batch write |
| BR-L012 | Deleted link leaves gap (ok) | No re-indexing needed |
| BR-L013 | Order persists across sessions | Stored in Firestore |

**Reorder Logic:**

```typescript
async function swapLinkOrder(
  pageId: string,
  link1Id: string,
  link2Id: string
): Promise<void> {
  const batch = writeBatch(db);
  const linksRef = collection(db, 'bio_pages', pageId, 'links');
  
  const [link1Doc, link2Doc] = await Promise.all([
    getDoc(doc(linksRef, link1Id)),
    getDoc(doc(linksRef, link2Id)),
  ]);
  
  const order1 = link1Doc.data()?.order;
  const order2 = link2Doc.data()?.order;
  
  batch.update(doc(linksRef, link1Id), { order: order2 });
  batch.update(doc(linksRef, link2Id), { order: order1 });
  
  await batch.commit();
}
```

---

## 5. Block Management Rules

### 5.1 E-commerce Block Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-B001 | Only Shopee/Lazada URLs allowed | Domain validation |
| BR-B002 | Product data cached for 24 hours | Check `cacheUpdatedAt` |
| BR-B003 | Fetch timeout 5 seconds | AbortController with timeout |
| BR-B004 | Failed fetch shows manual entry | Fallback UI for title/image |

**E-commerce URL Validation:**

```typescript
interface EcommerceUrlValidation {
  isValid: boolean;
  platform?: 'shopee' | 'lazada';
  error?: string;
}

function validateEcommerceUrl(url: string): EcommerceUrlValidation {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    
    if (hostname.includes('shopee.vn') || hostname.includes('shopee.com')) {
      return { isValid: true, platform: 'shopee' };
    }
    
    if (hostname.includes('lazada.vn') || hostname.includes('lazada.com')) {
      return { isValid: true, platform: 'lazada' };
    }
    
    return { 
      isValid: false, 
      error: 'URL must be from Shopee or Lazada' 
    };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
}
```

### 5.2 Donate Block Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-B010 | VietQR image max 5MB | File size check |
| BR-B011 | VietQR image must be PNG/JPG | MIME type validation |
| BR-B012 | Momo/ZaloPay link must be valid URL | URL validation |
| BR-B013 | At least one payment method required | Form validation |

### 5.3 Contact Form Block Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-B020 | Receiver email must be valid | Email format validation |
| BR-B021 | Form submissions rate limited | Max 3 per IP per hour |
| BR-B022 | Message max 1000 characters | Server-side truncation |
| BR-B023 | Email field required for visitors | Form validation |
| BR-B024 | Submissions sent via email service | Backend email integration |

### 5.4 Chat Block Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-B030 | Phone number 10 digits | Regex: `/^0[0-9]{9}$/` |
| BR-B031 | Phone must start with 0 | Vietnamese mobile format |
| BR-B032 | Default button text: "Chat on Zalo" | Set if not provided |
| BR-B033 | Opens Zalo via zalo.me/{phone} | URI construction |

**Phone Validation:**

```typescript
function validateVietnamesePhone(phone: string): boolean {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '');
  // Vietnamese mobile: starts with 0, 10 digits total
  return /^0[0-9]{9}$/.test(cleaned);
}

function formatZaloUrl(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '');
  return `https://zalo.me/${cleaned}`;
}
```

---

## 6. Analytics Rules

### 6.1 Event Tracking Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-A001 | Track page views on public page load | Fire event on mount |
| BR-A002 | Track link clicks before redirect | Async event logging |
| BR-A003 | Track block interactions | Event per interaction type |
| BR-A004 | Dedupe page views per session | Session-based throttling |
| BR-A005 | No tracking for page owner preview | Check auth state |

**Session-based Deduplication:**

```typescript
const SESSION_KEY = 'vielink_session';
const VIEW_THROTTLE_MS = 30 * 60 * 1000; // 30 minutes

async function trackPageView(pageId: string): Promise<void> {
  const sessionKey = `${SESSION_KEY}_${pageId}`;
  const lastView = sessionStorage.getItem(sessionKey);
  
  if (lastView) {
    const elapsed = Date.now() - parseInt(lastView, 10);
    if (elapsed < VIEW_THROTTLE_MS) {
      return; // Skip duplicate view
    }
  }
  
  sessionStorage.setItem(sessionKey, Date.now().toString());
  
  await addDoc(collection(db, 'analytics_events'), {
    pageId,
    eventType: 'page_view',
    referrer: document.referrer || null,
    referrerDomain: parseReferrerDomain(document.referrer),
    userAgent: navigator.userAgent,
    deviceType: detectDeviceType(),
    timestamp: serverTimestamp(),
  });
  
  // Increment cached counter
  await updateDoc(doc(db, 'bio_pages', pageId), {
    viewCount: increment(1),
  });
}
```

### 6.2 Analytics Display Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-A010 | Time filters: 7, 14, 30, 90 days | Query with timestamp range |
| BR-A011 | Traffic sources grouped by domain | Aggregate `referrerDomain` |
| BR-A012 | Small sources (< 2%) grouped as "Other" | Client-side calculation |
| BR-A013 | CTR = clicks / views × 100 | Calculated metric |
| BR-A014 | No PII in analytics | Strip query params from URLs |

---

## 7. Pro/Premium Features

### 7.1 Feature Gating Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-PRO001 | Hide logo requires Pro | Check `user.proPurchase` |
| BR-PRO002 | Custom domain requires Pro | Check before domain setup |
| BR-PRO003 | Pro status checked on each request | Real-time from user doc |
| BR-PRO004 | Expired Pro = free tier | Check `proExpiresAt` |

**Pro Feature Check:**

```typescript
interface ProStatus {
  isPro: boolean;
  expiresAt?: Date;
}

function checkProStatus(user: User): ProStatus {
  if (!user.proPurchase) {
    return { isPro: false };
  }
  
  if (user.proExpiresAt && user.proExpiresAt < new Date()) {
    return { isPro: false, expiresAt: user.proExpiresAt };
  }
  
  return { isPro: true, expiresAt: user.proExpiresAt };
}

function isFeatureAvailable(
  feature: 'hideLogo' | 'customDomain',
  user: User
): boolean {
  const PRO_FEATURES = ['hideLogo', 'customDomain'];
  
  if (!PRO_FEATURES.includes(feature)) {
    return true; // Free feature
  }
  
  return checkProStatus(user).isPro;
}
```

### 7.2 Custom Domain Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-D001 | Domain must be valid format | Domain regex validation |
| BR-D002 | CNAME must point to cname.vielink.vn | DNS verification |
| BR-D003 | Verification timeout 48 hours | Background job check |
| BR-D004 | SSL auto-provisioned on verification | Let's Encrypt integration |
| BR-D005 | One custom domain per page | Enforce in service layer |

**Domain Validation:**

```typescript
function validateDomain(domain: string): boolean {
  // Basic domain format validation
  const pattern = /^(?!-)[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
  
  if (!pattern.test(domain)) {
    return false;
  }
  
  // Block vielink subdomains
  if (domain.endsWith('.vielink.vn') || domain === 'vielink.vn') {
    return false;
  }
  
  return true;
}
```

---

## 8. Security Rules

### 8.1 Data Access Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-S001 | Users can only modify own data | Firestore security rules |
| BR-S002 | Bio pages public read | No auth required for public page |
| BR-S003 | Analytics write-only for public | Append-only, no read |
| BR-S004 | Admin operations require admin role | Custom claims check |

### 8.2 Input Sanitization Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-S010 | Sanitize all user text input | DOMPurify for HTML |
| BR-S011 | Validate all URLs before storage | URL parsing + domain check |
| BR-S012 | Strip dangerous protocols | Block javascript:, data: |
| BR-S013 | Limit string lengths at service layer | Truncation before DB write |

**URL Sanitization:**

```typescript
const BLOCKED_PROTOCOLS = ['javascript:', 'data:', 'vbscript:'];

function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    
    if (BLOCKED_PROTOCOLS.some(p => url.toLowerCase().startsWith(p))) {
      return null;
    }
    
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    
    return parsed.href;
  } catch {
    return null;
  }
}
```

### 8.3 Rate Limiting Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-S020 | Contact form: 3/hour per IP | Cloud Function rate limit |
| BR-S021 | Username check: 10/min per user | Client-side debounce |
| BR-S022 | AI writer: 5/day per user | Counter in user doc |

---

## 9. Performance Rules

### 9.1 Caching Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-P001 | E-commerce data cached 24h | Check timestamp before refetch |
| BR-P002 | Theme library cached indefinitely | Static data, no expiry |
| BR-P003 | User session cached in memory | React Query staleTime |
| BR-P004 | Public pages cached at CDN edge | Cache-Control headers |

### 9.2 Loading Rules

| Rule ID | Rule | Implementation |
|---------|------|----------------|
| BR-L001 | Initial page load < 2s | Lazy loading, code splitting |
| BR-L002 | Dashboard tab switch < 500ms | Prefetch adjacent tabs |
| BR-L003 | Preview updates < 100ms | Optimistic updates |

---

## 10. Audit & Logging

### 10.1 Activity Logging

| Event | Logged Data | Retention |
|-------|-------------|-----------|
| User registration | userId, email, method, timestamp | Permanent |
| Login success/failure | userId, email, IP, timestamp | 90 days |
| Bio page created | userId, pageId, username | Permanent |
| Custom domain configured | userId, pageId, domain, status | Permanent |
| Pro subscription change | userId, status, timestamp | Permanent |

---

## 11. Error Handling Rules

### 11.1 User-Facing Errors

| Error Code | Message (Vietnamese) | Message (English) |
|------------|---------------------|-------------------|
| AUTH001 | Email hoặc mật khẩu không đúng | Invalid email or password |
| AUTH002 | Email đã được sử dụng | Email already registered |
| AUTH003 | Tài khoản bị tạm khóa | Account temporarily locked |
| PAGE001 | Tên người dùng đã tồn tại | Username already taken |
| PAGE002 | Tên người dùng không hợp lệ | Invalid username format |
| BLOCK001 | URL sản phẩm không hợp lệ | Invalid product URL |
| BLOCK002 | Không thể tải thông tin sản phẩm | Failed to fetch product info |

### 11.2 Error Recovery

| Scenario | Recovery Action |
|----------|-----------------|
| Firestore write fails | Retry 3x with exponential backoff |
| Image upload fails | Show error, allow retry |
| Network offline | Queue changes, sync when online |
| Session expired | Redirect to login |

