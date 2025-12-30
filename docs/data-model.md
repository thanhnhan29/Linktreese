# VieLink - Data Model

## 1. Overview

This document defines the data model for the VieLink platform using Firebase Firestore as the database. Firestore is a NoSQL document database that organizes data into collections and documents.

### 1.1 Design Principles

1. **Denormalization**: Store related data together to minimize reads
2. **Subcollections**: Use for 1-to-many relationships with independent access patterns
3. **Indexes**: Define composite indexes for common query patterns
4. **Security**: Design with Firestore security rules in mind

### 1.2 Database Structure Overview

```
firestore/
├── users/                      # User accounts
│   └── {userId}/
├── bio_pages/                  # Bio pages (main entity)
│   └── {pageId}/
│       ├── blocks/             # Content blocks (subcollection)
│       │   └── {blockId}/
│       └── links/              # Social links (subcollection)
│           └── {linkId}/
├── analytics_events/           # Page view and click events
│   └── {eventId}/
├── custom_domains/             # Custom domain configurations
│   └── {domainName}/
└── theme_library/              # Pre-built theme templates
    └── {themeId}/
```

---

## 2. Collection Schemas

### 2.1 Users Collection

**Collection Path:** `users/{userId}`

Stores user account information. The `userId` matches Firebase Auth UID.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User's email address (unique) |
| `fullName` | string | No | Display name (max 100 chars) |
| `avatarUrl` | string | No | URL to profile image in Storage |
| `authProvider` | string | Yes | Authentication method: `email`, `google` |
| `proPurchase` | boolean | No | Pro subscription status (default: false) |
| `proExpiresAt` | timestamp | No | Pro subscription expiration date |
| `createdAt` | timestamp | Yes | Account creation timestamp |
| `updatedAt` | timestamp | Yes | Last update timestamp |

**TypeScript Interface:**

```typescript
interface User {
  id: string;                    // Document ID (Firebase Auth UID)
  email: string;
  fullName?: string;
  avatarUrl?: string;
  authProvider: 'email' | 'google';
  proPurchase: boolean;
  proExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

**Example Document:**

```json
{
  "email": "user@example.com",
  "fullName": "Nguyễn Văn A",
  "avatarUrl": "gs://vielink.appspot.com/avatars/abc123.jpg",
  "authProvider": "google",
  "proPurchase": false,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

### 2.2 Bio Pages Collection

**Collection Path:** `bio_pages/{pageId}`

Main entity representing a user's bio link page.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string | Yes | Reference to owner user |
| `username` | string | Yes | Unique URL handle (e.g., `johndoe`) |
| `displayName` | string | No | Name shown on page |
| `bioDescription` | string | No | Bio text (max 200 chars) |
| `avatarUrl` | string | No | Page-specific avatar |
| `isLogoHidden` | boolean | No | Hide VieLink branding (Pro feature) |
| `published` | boolean | Yes | Whether page is publicly visible |
| `viewCount` | number | No | Cached total page views |
| `themeConfig` | object | Yes | Appearance configuration (embedded) |
| `settings` | object | No | Page settings |
| `customDomain` | string | No | Custom domain if configured |
| `createdAt` | timestamp | Yes | Creation timestamp |
| `updatedAt` | timestamp | Yes | Last update timestamp |

**Embedded Object: `themeConfig`**

| Field | Type | Description |
|-------|------|-------------|
| `backgroundType` | string | `solid`, `gradient`, `image` |
| `backgroundValue` | string | Hex color, gradient, or image URL |
| `gradientStart` | string | Gradient start color |
| `gradientEnd` | string | Gradient end color |
| `gradientDirection` | string | `to-b`, `to-r`, `to-br`, etc. |
| `buttonStyle` | string | `rounded`, `square`, `pill` |
| `buttonColor` | string | Button background color |
| `buttonTextColor` | string | Button text color |
| `buttonShadow` | boolean | Enable button shadow |
| `fontFamily` | string | Google Font family name |
| `textColor` | string | Main text color |
| `usernameColor` | string | Username display color |
| `descriptionColor` | string | Bio description color |

**Embedded Object: `settings`**

| Field | Type | Description |
|-------|------|-------------|
| `hideVielinkLogo` | boolean | Hide "Powered by VieLink" |
| `enableAnalytics` | boolean | Track page views/clicks |
| `seoTitle` | string | Custom SEO title |
| `seoDescription` | string | Custom SEO description |

**TypeScript Interface:**

```typescript
interface ThemeConfig {
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundValue: string;
  gradientStart?: string;
  gradientEnd?: string;
  gradientDirection?: 'to-b' | 'to-t' | 'to-r' | 'to-l' | 'to-br' | 'to-bl';
  buttonStyle: 'rounded' | 'square' | 'pill';
  buttonColor: string;
  buttonTextColor: string;
  buttonShadow: boolean;
  fontFamily: string;
  textColor: string;
  usernameColor: string;
  descriptionColor: string;
}

interface PageSettings {
  hideVielinkLogo: boolean;
  enableAnalytics: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

interface BioPage {
  id: string;
  userId: string;
  username: string;
  displayName?: string;
  bioDescription?: string;
  avatarUrl?: string;
  isLogoHidden: boolean;
  published: boolean;
  viewCount: number;
  themeConfig: ThemeConfig;
  settings: PageSettings;
  customDomain?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Example Document:**

```json
{
  "userId": "firebase-auth-uid-123",
  "username": "creativecoder",
  "displayName": "Creative Coder",
  "bioDescription": "Full-stack developer & content creator 🚀",
  "avatarUrl": "gs://vielink.appspot.com/pages/abc/avatar.jpg",
  "isLogoHidden": false,
  "published": true,
  "viewCount": 1250,
  "themeConfig": {
    "backgroundType": "gradient",
    "backgroundValue": "",
    "gradientStart": "#8129d9",
    "gradientEnd": "#43E660",
    "gradientDirection": "to-br",
    "buttonStyle": "pill",
    "buttonColor": "#ffffff",
    "buttonTextColor": "#8129d9",
    "buttonShadow": true,
    "fontFamily": "Inter",
    "textColor": "#ffffff",
    "usernameColor": "#ffffff",
    "descriptionColor": "#e0e0e0"
  },
  "settings": {
    "hideVielinkLogo": false,
    "enableAnalytics": true
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-02-20T14:45:00Z"
}
```

---

### 2.3 Blocks Subcollection

**Collection Path:** `bio_pages/{pageId}/blocks/{blockId}`

Content blocks displayed on a bio page (e-commerce, donate, contact, chat).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | Block type: `ecommerce`, `donate`, `contact`, `chat` |
| `title` | string | No | Block display title |
| `isVisible` | boolean | Yes | Whether block is shown |
| `sortOrder` | number | Yes | Display order (0-indexed) |
| `clickCount` | number | No | Cached click count |
| `data` | object | Yes | Type-specific data (see below) |
| `createdAt` | timestamp | Yes | Creation timestamp |
| `updatedAt` | timestamp | Yes | Last update timestamp |

**Type-Specific Data Objects:**

**E-commerce Block (`type: 'ecommerce'`):**

```typescript
interface EcommerceBlockData {
  productUrl: string;          // Original Shopee/Lazada URL
  platform: 'shopee' | 'lazada';
  cachedName: string;          // Product name (cached)
  cachedImage: string;         // Product image URL (cached)
  cachedPrice?: string;        // Product price (cached)
  cacheUpdatedAt: Date;        // Last cache refresh
}
```

**Donate Block (`type: 'donate'`):**

```typescript
interface DonateBlockData {
  paymentMethod: 'momo' | 'zalopay' | 'vietqr';
  qrImageUrl?: string;         // For VietQR
  paymentLink?: string;        // For Momo/ZaloPay
}
```

**Contact Block (`type: 'contact'`):**

```typescript
interface ContactBlockData {
  receiverEmail: string;       // Email to receive messages
  formFields: {
    requireName: boolean;
    requirePhone: boolean;
  };
}
```

**Chat Block (`type: 'chat'`):**

```typescript
interface ChatBlockData {
  phoneNumber: string;         // Zalo phone number
  prefilledMessage?: string;   // Default message
}
```

**TypeScript Interface:**

```typescript
type BlockType = 'ecommerce' | 'donate' | 'contact' | 'chat';

interface Block {
  id: string;
  type: BlockType;
  title: string;
  isVisible: boolean;
  sortOrder: number;
  clickCount: number;
  data: EcommerceBlockData | DonateBlockData | ContactBlockData | ChatBlockData;
  createdAt: Date;
  updatedAt: Date;
}
```

**Example Document (E-commerce):**

```json
{
  "type": "ecommerce",
  "title": "My Favorite Headphones",
  "isVisible": true,
  "sortOrder": 0,
  "clickCount": 45,
  "data": {
    "productUrl": "https://shopee.vn/product/123456",
    "platform": "shopee",
    "cachedName": "Premium Wireless Headphones",
    "cachedImage": "https://cf.shopee.vn/file/abc123",
    "cachedPrice": "₫599,000",
    "cacheUpdatedAt": "2024-02-19T10:00:00Z"
  },
  "createdAt": "2024-01-20T08:00:00Z",
  "updatedAt": "2024-02-19T10:00:00Z"
}
```

---

### 2.4 Links Subcollection

**Collection Path:** `bio_pages/{pageId}/links/{linkId}`

Social media and custom links displayed on a bio page.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Link display text |
| `url` | string | Yes | Destination URL |
| `type` | string | No | Link type: `social`, `custom` |
| `platform` | string | No | Social platform (if type=social) |
| `icon` | string | No | Custom icon identifier |
| `isActive` | boolean | Yes | Whether link is visible |
| `order` | number | Yes | Display order |
| `clickCount` | number | No | Cached click count |
| `createdAt` | timestamp | Yes | Creation timestamp |

**TypeScript Interface:**

```typescript
interface Link {
  id: string;
  title: string;
  url: string;
  type: 'social' | 'custom';
  platform?: 'instagram' | 'tiktok' | 'facebook' | 'youtube' | 'twitter' | 'linkedin' | 'github';
  icon?: string;
  isActive: boolean;
  order: number;
  clickCount: number;
  createdAt: Date;
}
```

**Example Document:**

```json
{
  "title": "Follow me on Instagram",
  "url": "https://instagram.com/creativecoder",
  "type": "social",
  "platform": "instagram",
  "isActive": true,
  "order": 0,
  "clickCount": 230,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### 2.5 Analytics Events Collection

**Collection Path:** `analytics_events/{eventId}`

Stores raw analytics events for page views and link/block clicks.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pageId` | string | Yes | Reference to bio page |
| `eventType` | string | Yes | `page_view`, `link_click`, `block_click` |
| `linkId` | string | No | For link clicks |
| `blockId` | string | No | For block clicks |
| `referrer` | string | No | HTTP referrer URL |
| `referrerDomain` | string | No | Parsed domain from referrer |
| `userAgent` | string | No | Browser user agent |
| `deviceType` | string | No | `mobile`, `tablet`, `desktop` |
| `country` | string | No | Country code (from IP) |
| `timestamp` | timestamp | Yes | Event timestamp |

**TypeScript Interface:**

```typescript
type EventType = 'page_view' | 'link_click' | 'block_click';

interface AnalyticsEvent {
  id: string;
  pageId: string;
  eventType: EventType;
  linkId?: string;
  blockId?: string;
  referrer?: string;
  referrerDomain?: string;
  userAgent?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  country?: string;
  timestamp: Date;
}
```

**Example Document:**

```json
{
  "pageId": "bio-page-id-123",
  "eventType": "link_click",
  "linkId": "link-id-456",
  "referrer": "https://www.facebook.com/",
  "referrerDomain": "facebook.com",
  "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0...",
  "deviceType": "mobile",
  "country": "VN",
  "timestamp": "2024-02-20T14:30:00Z"
}
```

---

### 2.6 Custom Domains Collection

**Collection Path:** `custom_domains/{domainName}`

Stores custom domain configurations for Pro users.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pageId` | string | Yes | Reference to bio page |
| `userId` | string | Yes | Reference to owner user |
| `status` | string | Yes | `pending`, `active`, `failed` |
| `cnameTarget` | string | Yes | CNAME target (e.g., `cname.vielink.vn`) |
| `sslStatus` | string | No | `pending`, `active`, `failed` |
| `verifiedAt` | timestamp | No | When domain was verified |
| `createdAt` | timestamp | Yes | Creation timestamp |

**TypeScript Interface:**

```typescript
interface CustomDomain {
  domainName: string;          // Document ID
  pageId: string;
  userId: string;
  status: 'pending' | 'active' | 'failed';
  cnameTarget: string;
  sslStatus?: 'pending' | 'active' | 'failed';
  verifiedAt?: Date;
  createdAt: Date;
}
```

---

### 2.7 Theme Library Collection

**Collection Path:** `theme_library/{themeId}`

Pre-built theme templates available to all users.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Theme display name |
| `description` | string | Yes | Theme description |
| `previewColors` | array | Yes | Color palette for preview |
| `isDark` | boolean | No | Whether theme is dark mode |
| `config` | object | Yes | Full ThemeConfig object |
| `category` | string | No | Theme category |
| `sortOrder` | number | No | Display order |

**TypeScript Interface:**

```typescript
interface ThemeTemplate {
  id: string;
  name: string;
  description: string;
  previewColors: string[];
  isDark: boolean;
  config: ThemeConfig;
  category?: string;
  sortOrder: number;
}
```

---

## 3. Indexes

### 3.1 Required Composite Indexes

```
Collection: bio_pages
Index: userId (ASC), username (ASC)
Purpose: Query user's bio pages sorted by username

Collection: bio_pages
Index: username (ASC)
Purpose: Lookup bio page by username

Collection: bio_pages/{pageId}/links
Index: order (ASC)
Purpose: Get links in display order

Collection: bio_pages/{pageId}/blocks
Index: sortOrder (ASC)
Purpose: Get blocks in display order

Collection: analytics_events
Index: pageId (ASC), timestamp (DESC)
Purpose: Get recent events for a page

Collection: analytics_events
Index: pageId (ASC), eventType (ASC), timestamp (DESC)
Purpose: Filter events by type for a page

Collection: analytics_events
Index: pageId (ASC), referrerDomain (ASC), timestamp (DESC)
Purpose: Traffic source analysis
```

---

## 4. Data Access Patterns

### 4.1 Common Queries

| Operation | Collection | Query |
|-----------|------------|-------|
| Get user by ID | `users` | `doc(db, 'users', userId)` |
| Get user's bio pages | `bio_pages` | `where('userId', '==', userId)` |
| Get bio page by username | `bio_pages` | `where('username', '==', username)` |
| Get page links (sorted) | `bio_pages/{id}/links` | `orderBy('order', 'asc')` |
| Get page blocks (sorted) | `bio_pages/{id}/blocks` | `orderBy('sortOrder', 'asc')` |
| Get recent analytics | `analytics_events` | `where('pageId', '==', id), orderBy('timestamp', 'desc'), limit(100)` |
| Check username exists | `bio_pages` | `where('username', '==', username), limit(1)` |

### 4.2 Write Operations

| Operation | Method | Notes |
|-----------|--------|-------|
| Create user | `setDoc` | Use Firebase Auth UID as doc ID |
| Create bio page | `addDoc` | Auto-generate ID |
| Update bio page | `updateDoc` | Partial update |
| Reorder links | `writeBatch` | Update multiple order fields atomically |
| Log analytics | `addDoc` | Append-only, no updates |
| Increment view count | `updateDoc` with `increment()` | Atomic counter |

---

## 5. Data Migration Considerations

### 5.1 Schema Versioning

Store schema version in app config to handle migrations:

```typescript
interface AppConfig {
  schemaVersion: number;
  features: Record<string, boolean>;
}
```

### 5.2 Backward Compatibility

When adding new fields:
- Always provide default values in code
- Use optional fields in TypeScript interfaces
- Merge with defaults when reading documents

```typescript
function mapToBioPage(doc: DocumentSnapshot): BioPage {
  const data = doc.data();
  return {
    id: doc.id,
    themeConfig: {
      ...DEFAULT_THEME_CONFIG,
      ...data.themeConfig,
    },
    settings: {
      ...DEFAULT_SETTINGS,
      ...data.settings,
    },
    // ... other fields
  };
}
```

---

## 6. Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│      User       │       │   BioPage       │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │───1:N─│ id (PK)         │
│ email           │       │ userId (FK)     │
│ fullName        │       │ username        │
│ avatarUrl       │       │ displayName     │
│ proPurchase     │       │ bioDescription  │
│ createdAt       │       │ themeConfig     │
└─────────────────┘       │ viewCount       │
                          └────────┬────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
            ┌───────────┐  ┌───────────┐  ┌─────────────────┐
            │   Link    │  │   Block   │  │AnalyticsEvent   │
            ├───────────┤  ├───────────┤  ├─────────────────┤
            │ id (PK)   │  │ id (PK)   │  │ id (PK)         │
            │ title     │  │ type      │  │ pageId (FK)     │
            │ url       │  │ title     │  │ eventType       │
            │ isActive  │  │ isVisible │  │ linkId          │
            │ order     │  │ sortOrder │  │ blockId         │
            │ clickCnt  │  │ data      │  │ referrerDomain  │
            └───────────┘  │ clickCnt  │  │ timestamp       │
                           └───────────┘  └─────────────────┘

            ┌─────────────────┐
            │  CustomDomain   │
            ├─────────────────┤
            │ domainName (PK) │
            │ pageId (FK)     │
            │ userId (FK)     │
            │ status          │
            │ cnameTarget     │
            └─────────────────┘
```

---

## 7. Storage Structure

Firebase Storage is used for user-uploaded files:

```
gs://vielink.appspot.com/
├── users/
│   └── {userId}/
│       └── avatar.{ext}
├── pages/
│   └── {pageId}/
│       ├── avatar.{ext}
│       └── background.{ext}
├── blocks/
│   └── {blockId}/
│       └── qr.{ext}
└── temp/
    └── {uploadId}/    # Temporary uploads before processing
```

**File Naming Convention:**
- Use deterministic names based on entity ID
- Include extension based on content type
- Overwrite previous file on update (same URL, cache invalidation)

