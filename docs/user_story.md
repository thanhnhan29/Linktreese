# VieLink - User Stories

## Overview

This document contains all user stories for the VieLink "link-in-bio" platform, derived from the functional requirements and use case specifications. User stories are organized by feature groups and follow the format: "As a [user type], I want [goal] so that [benefit]."

---

## 1. Account Management

### US-001: User Registration (Email/Password)
**Use Case Reference:** U001

**As a** new user,  
**I want to** create an account using my email and password,  
**So that** I can access and manage my personal bio link page on VieLink.

**Acceptance Criteria:**
- User can enter email, password, and confirm password
- Email must be valid format and unique in the system
- Password must be at least 8 characters with uppercase, lowercase, and numbers
- Password and confirm password must match
- User receives email verification after registration
- After email verification, user is automatically logged in
- User is redirected to create their first bio page

---

### US-002: User Registration (OAuth/Google)
**Use Case Reference:** U001

**As a** new user,  
**I want to** register using my Google account,  
**So that** I can quickly create an account without remembering another password.

**Acceptance Criteria:**
- User can click Google icon to initiate OAuth flow
- System redirects to Google authentication page
- Upon successful Google authentication, system creates account automatically
- User is redirected to create their first bio page
- If email already exists, system links the OAuth provider to existing account

---

### US-003: User Login (Email/Password)
**Use Case Reference:** U002

**As a** registered user,  
**I want to** log in using my email and password,  
**So that** I can access my dashboard and manage my bio pages.

**Acceptance Criteria:**
- User can enter email and password
- System validates credentials against database
- Upon successful login, user is redirected to dashboard
- If credentials are incorrect, display error message
- Maximum 5 failed login attempts before temporary lockout
- Password field has show/hide toggle (hidden by default)

---

### US-004: User Login (OAuth/Google)
**Use Case Reference:** U002

**As a** registered user,  
**I want to** log in using my Google account,  
**So that** I can quickly access my account without typing a password.

**Acceptance Criteria:**
- User can click Google icon to initiate OAuth flow
- System finds matching account by email
- If account exists, user is logged in and redirected to dashboard
- If no account exists, system creates new account automatically

---

### US-005: Password Recovery
**Use Case Reference:** U003

**As a** registered user who forgot my password,  
**I want to** reset my password via email,  
**So that** I can regain access to my account securely.

**Acceptance Criteria:**
- User can click "Forgot Password" link on login page
- User enters registered email address
- User completes CAPTCHA verification
- System sends password reset email with secure link
- Reset link expires after 10 minutes
- User can set new password meeting security requirements
- Upon successful reset, user is redirected to login page

---

### US-006: Edit Personal Profile
**Use Case Reference:** U004

**As a** logged-in user,  
**I want to** update my display name and avatar,  
**So that** my profile reflects my current identity.

**Acceptance Criteria:**
- User can update display name (max 100 characters)
- User can upload new avatar image (JPG, PNG, max 2MB)
- System supports basic image cropping
- Changes are saved and reflected immediately
- Success/error feedback is displayed

---

### US-007: Change Password
**Use Case Reference:** U004

**As a** logged-in user,  
**I want to** change my account password,  
**So that** I can maintain my account security.

**Acceptance Criteria:**
- User must enter current password for verification
- User enters new password and confirmation
- New password must meet security requirements
- System validates current password before allowing change
- Success message displayed upon completion

---

## 2. Bio Page Management

### US-008: Create First Bio Page
**Use Case Reference:** U005

**As a** newly registered user,  
**I want to** create my first bio page with a unique username,  
**So that** I have a public URL to share my links.

**Acceptance Criteria:**
- System prompts for username immediately after registration
- Username is validated in real-time (unique, no special characters)
- Validation response within 1 second
- Clear error messages for invalid usernames
- Upon confirmation, bio page is created with URL: `vielink.vn/{username}`
- User is redirected to dashboard

---

### US-009: Manage Multiple Bio Pages
**Use Case Reference:** U006

**As a** user with multiple projects or brands,  
**I want to** create and switch between multiple bio pages,  
**So that** I can manage different online presences separately.

**Acceptance Criteria:**
- User can view list of all their bio pages by clicking logo
- User can switch to any bio page from the list
- User can create new bio page with new username
- Each bio page has independent content and settings
- Dashboard updates to show selected bio page content

---

### US-010: Customize Page Appearance
**Use Case Reference:** U007

**As a** user who wants to express my brand,  
**I want to** customize my page's background, buttons, fonts, and colors,  
**So that** my bio page matches my personal style.

**Acceptance Criteria:**
- **Background Options:**
  - Solid color (color picker)
  - Gradient (start/end colors, direction)
  - Custom image upload (JPG, PNG, max 2MB)
- **Button Customization:**
  - Style (rounded, square, pill)
  - Background color
  - Text color
  - Shadow toggle
- **Font Selection:**
  - Choose from Google Fonts list for headings
  - Choose from Google Fonts list for body text
- **Text Colors:**
  - Username color
  - Description color
- All changes preview in real-time (< 0.5 seconds)
- Changes are auto-saved

---

### US-011: Apply Template Theme
**Use Case Reference:** U008

**As a** user who wants quick styling,  
**I want to** apply a pre-designed template,  
**So that** I can have a professional-looking page without manual customization.

**Acceptance Criteria:**
- User can browse template library in Appearance tab
- Templates are localized for Vietnamese market
- User can preview template before applying
- Applying template overrides current appearance settings
- Preview updates immediately upon selection
- User can further customize after applying template

---

### US-012: Update Bio Description
**Use Case Reference:** U011

**As a** user building my online presence,  
**I want to** write and edit my bio description,  
**So that** visitors understand who I am.

**Acceptance Criteria:**
- User can edit bio in dashboard
- Character limit of 200 characters with counter
- Supports line breaks
- Live preview updates with each keystroke (< 0.5 seconds)
- Auto-save after user stops typing

---

### US-013: AI-Powered Bio Writer
**Use Case Reference:** U012

**As a** user who struggles with writing,  
**I want to** use AI to improve my bio description,  
**So that** I have engaging and professional content.

**Acceptance Criteria:**
- User can click "AI Writer" button
- System sends current bio to AI service
- AI generates improved version within 10 seconds
- User can preview AI suggestion
- User can "Accept" to apply or "Cancel" to keep original
- Graceful error handling if AI service is unavailable

---

## 3. Link & Block Management

### US-014: Manage Social Media Links
**Use Case Reference:** U009

**As a** content creator,  
**I want to** add, edit, delete, and reorder social media links,  
**So that** visitors can find all my social profiles.

**Acceptance Criteria:**
- **Create:** Add new link with title and URL
- **Update:** Edit existing link's title and URL
- **Delete:** Remove link with confirmation dialog
- **Reorder:** Drag-and-drop to change order
- **Toggle:** Show/hide individual links
- Unlimited number of links allowed
- All changes reflect in live preview immediately
- Auto-save after each action

---

### US-015: Remove Platform Branding (Pro)
**Use Case Reference:** U010

**As a** Pro user seeking professional branding,  
**I want to** hide the VieLink logo from my public page,  
**So that** my page looks like my own branded property.

**Acceptance Criteria:**
- Feature is only available for Pro subscribers
- Toggle in Settings to show/hide VieLink logo
- Non-Pro users see locked toggle with upgrade prompt
- Changes apply immediately to public page

---

### US-016: Add E-commerce Product Block
**Use Case Reference:** U013

**As an** affiliate marketer,  
**I want to** showcase products from Shopee/Lazada with auto-fetched details,  
**So that** I can promote products with attractive visuals.

**Acceptance Criteria:**
- User pastes product URL from Shopee or Lazada
- System validates URL domain
- System auto-extracts product name and image
- Product displays as visual card on bio page
- Data is cached for 24 hours to improve load times
- Unsupported URLs show clear error message
- Extraction completes within 3 seconds

---

### US-017: Add Donation Block
**Use Case Reference:** U014

**As a** content creator accepting support,  
**I want to** add donation options (Momo, ZaloPay, VietQR),  
**So that** fans can easily support me financially.

**Acceptance Criteria:**
- User can choose payment method: Momo, ZaloPay, VietQR
- **VietQR:** Upload QR code image (PNG, JPG, max 5MB)
- **Momo/ZaloPay:** Enter payment link
- User sets button title
- Visitors see button on public page
- Clicking opens popup with QR or redirects to payment link
- Mobile users are directed to open native app

---

### US-018: Add Contact Form Block
**Use Case Reference:** U015

**As a** freelancer seeking clients,  
**I want to** add a contact form to my page,  
**So that** potential clients can send me inquiries.

**Acceptance Criteria:**
- User configures form title and receiver email
- Public form shows: Name (optional), Email (required), Message (required)
- Form validates email format and required fields
- Submissions are sent to configured email
- Visitor sees "Success" message after submission
- Submission completes within 3 seconds
- Anti-spam protection (CAPTCHA or rate limiting)

---

### US-019: Add Zalo Quick Chat Block
**Use Case Reference:** U016

**As an** online seller,  
**I want to** add a Zalo chat button,  
**So that** customers can contact me instantly.

**Acceptance Criteria:**
- User enters Zalo phone number (10 digits starting with 0)
- User sets custom button title (default: "Chat on Zalo")
- Button displays Zalo icon for recognition
- Clicking opens `zalo.me/{phone_number}` URI
- Works on both desktop (opens Zalo web/app) and mobile (opens Zalo app)

---

## 4. Analytics & Insights

### US-020: View Basic Analytics
**Use Case Reference:** U017

**As a** bio page owner,  
**I want to** see page views and link clicks,  
**So that** I can understand my audience engagement.

**Acceptance Criteria:**
- Dashboard shows total page views
- Dashboard shows total link clicks
- Data can be filtered by: 7, 14, 30, 90 days
- Individual link click counts are displayed
- Charts visualize trends over time
- Data loads within 2 seconds
- "No data yet" message for new pages

---

### US-021: Analyze Traffic Sources
**Use Case Reference:** U018

**As a** marketer optimizing campaigns,  
**I want to** see where my traffic comes from,  
**So that** I can focus on effective channels.

**Acceptance Criteria:**
- Pie chart shows traffic distribution by source
- Sources grouped by domain (Facebook, TikTok, Instagram, Zalo, Direct, Other)
- Small sources (< threshold) grouped into "Other"
- Percentages displayed for each source
- Data updates when time filter changes
- Privacy: Only domain names shown, not full URLs

---

### US-022: Generate and Download QR Code
**Use Case Reference:** U019

**As a** user promoting my page offline,  
**I want to** download my page's QR code,  
**So that** I can print it on business cards or posters.

**Acceptance Criteria:**
- QR code is auto-generated with page URL
- QR code displayed in "Share" section
- Download available as PNG file
- QR is scannable by standard QR readers
- QR generates instantly when share dialog opens

---

### US-023: Configure Custom Domain (Pro)
**Use Case Reference:** U020

**As a** Pro user with my own domain,  
**I want to** connect my domain to my bio page,  
**So that** visitors access my page via my branded URL.

**Acceptance Criteria:**
- Feature only available for Pro subscribers
- User enters custom domain (e.g., mybrand.vn)
- System displays CNAME configuration instructions
- User adds CNAME record pointing to `cname.vielink.vn`
- User clicks "Verify" to check DNS configuration
- Success: Domain is connected and accessible
- Failure: Clear error message with troubleshooting tips
- SSL certificate is auto-provisioned

---

## 5. Public Bio Page (Visitor Experience)

### US-024: View Public Bio Page
**As a** visitor,  
**I want to** view a user's bio page on any device,  
**So that** I can access their links and information.

**Acceptance Criteria:**
- Page loads quickly (optimized for slow connections)
- Responsive design works on mobile, tablet, and desktop
- All active links are clickable
- Content blocks display correctly
- Page reflects owner's custom appearance settings

---

### US-025: Interact with Content Blocks
**As a** visitor,  
**I want to** interact with various content blocks,  
**So that** I can contact the owner or support them.

**Acceptance Criteria:**
- **E-commerce:** Click opens product URL
- **Donate:** Click shows QR popup or opens payment link
- **Contact Form:** Submit form sends message to owner
- **Zalo Chat:** Click opens Zalo conversation
- All interactions are logged for analytics

---

## Priority Matrix

| Priority | User Stories |
|----------|--------------|
| **P0 - Critical** | US-001, US-002, US-003, US-008, US-014, US-024 |
| **P1 - High** | US-004, US-005, US-006, US-010, US-012, US-020 |
| **P2 - Medium** | US-009, US-011, US-016, US-017, US-018, US-019, US-021, US-022, US-025 |
| **P3 - Low** | US-007, US-013, US-015, US-023 |

---

## Appendix: Feature-to-Story Mapping

| Feature Group | Stories | Related Use Cases |
|--------------|---------|-------------------|
| Account Management | US-001 to US-007 | U001, U002, U003, U004 |
| Bio Page Management | US-008 to US-013 | U005, U006, U007, U008, U011, U012 |
| Link & Block Management | US-014 to US-019 | U009, U010, U013, U014, U015, U016 |
| Analytics & Insights | US-020 to US-023 | U017, U018, U019, U020 |
| Public Page | US-024, US-025 | N/A (implicit) |

