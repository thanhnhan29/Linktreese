# Changelog - Linktree Clone Refactoring

## Version 1.0.0 - Deep Refactoring & Feature Implementation

### Date: December 30, 2025

---

## Overview

Complete refactoring of the Linktree clone application following micro-service architecture patterns and best practices. This release includes a restructured codebase, comprehensive feature implementations, and several bug fixes.

---

## Architecture Changes

### Layered Architecture Implementation
- **Presentation Layer**: React components in `src/components/` and feature-specific components
- **Application Layer**: Services and hooks in `src/features/`
- **Data Access Layer**: Repositories in `src/infrastructure/repositories/`
- **Infrastructure Layer**: Firebase config, storage utilities in `src/infrastructure/`

### Feature-Based Organization
```
src/
├── app/                    # App-level providers and setup
├── features/
│   ├── auth/              # Authentication feature
│   │   ├── components/    # Login, Signup forms
│   │   ├── hooks/         # useAuth hook
│   │   └── services/      # authService
│   └── bio-page/          # Bio page feature
│       ├── components/    # Dashboard, CreateUsernameForm
│       ├── hooks/         # useBioPage, useLinks, useBlocks, useTheme, useBioWriter, useFileImage
│       └── services/      # bioPageService, linkService, blockService, themeService, bioWriterService
├── infrastructure/
│   ├── firebase/          # Firebase configuration
│   ├── repositories/      # Data access (user, bioPage, link, block)
│   └── storage/           # File-based image storage
└── shared/
    ├── lib/               # Utilities, validation, errors, theme helpers
    └── types/             # TypeScript interfaces
```

---

## Features Implemented

### 1. Authentication System
- Email/password login and signup
- Firebase Authentication integration
- Persistent auth state with React Context
- Graceful error handling with setup instructions

### 2. User & Bio Page Management
- Create/update bio pages with unique usernames
- Profile editing (display name, bio description)
- Username validation (format, availability check)
- Multiple bio pages per user support

### 3. Link Management
- Full CRUD operations for links
- Link types: regular, social, ecommerce, donate, contact, chat
- Drag-and-drop reordering
- Enable/disable toggle
- Click tracking and thumbnails

### 4. Block Management
- Multiple block types: header, text, divider, social-icons, etc.
- Drag-and-drop reordering
- Enable/disable toggle
- Block-specific content editing

### 5. Theme Configuration & Library
- Comprehensive appearance system:
  - Background: solid color, gradient, or image
  - Buttons: fill, outline, soft-shadow, hard-shadow styles
  - Fonts: 50+ Google Fonts with font pairings
  - Text colors: username and description colors
- 15+ pre-built theme presets (minimal, dark, gradient, colorful, professional, nature)
- Gallery view for theme selection
- Real-time preview with phone mockup

### 6. AI Bio Writer (Google Gemini Integration)
- Improve existing bio with AI
- Generate new bio from scratch
- Multiple writing styles: professional, creative, casual, funny, minimal, inspiring
- Bilingual support (English & Vietnamese)
- Translation between languages
- Model: `gemini-2.5-flash`

### 7. Local File-Based Image Storage
- Profile images saved to `public/uploads/profiles/`
- Background images saved to `public/uploads/backgrounds/`
- Vite plugin for handling uploads during development
- Images persist across page reloads
- No external storage dependencies (Firebase Storage not required)

---

## Bug Fixes

### Image Storage System
- Fixed blob URL issue in `ImageCropModal` - now returns base64 data URL
- Replaced IndexedDB storage with file-based storage via Vite plugin
- Images now persist correctly after page refresh
- Proper error handling and toast notifications for upload status

### UI Fixes
- Fixed text wrapping in bio description (PhonePreview)
- Fixed "Create another Linktree" form layout - prefix no longer overlaps input
- Fixed unused imports and TypeScript errors across components

### API Rate Limiting
- Updated Gemini model from `gemini-2.0-flash-lite` to `gemini-2.5-flash` for higher rate limits

---

## Technical Details

### Dependencies
- React 18 with TypeScript
- Vite for build tooling
- Firebase (Auth, Firestore)
- Tailwind CSS for styling
- Shadcn/ui components
- Google Generative AI SDK (@google/genai)
- React Easy Crop for image cropping

### Environment Variables Required
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_GEMINI_API_KEY=
```

### Running the Application
```bash
npm install
npm run dev
```
Single command starts both Vite dev server and image upload handler.

---

## Files Changed (Summary)

### New Files
- `vite-plugin-image-upload.ts` - Vite plugin for file uploads
- `src/infrastructure/storage/fileImageStorage.ts` - File storage service
- `src/features/bio-page/hooks/useFileImage.ts` - File image hook
- `src/features/bio-page/services/bioWriterService.ts` - AI bio writer
- `src/shared/lib/theme/` - Theme presets and font library
- `public/uploads/profiles/` & `public/uploads/backgrounds/` - Image storage directories

### Modified Files
- All components updated for new architecture
- Repository pattern implemented for all data access
- Services layer added for business logic
- Hooks refactored for better state management

### Deleted Files
- `server/upload-server.js` - Replaced by Vite plugin
- `src/infrastructure/storage/imageStorage.ts` - IndexedDB storage (deprecated)
- `src/infrastructure/storage/localImageStorage.ts` - localStorage storage (deprecated)
- Various unused hooks and components

---

## Next Steps (Future Improvements)
- [ ] Add analytics dashboard with charts
- [ ] Implement social login (Google, GitHub)
- [ ] Add custom domain support
- [ ] Implement Pro subscription features
- [ ] Add SEO optimization for public bio pages
- [ ] Mobile app development

