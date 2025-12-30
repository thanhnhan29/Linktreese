# VieLink - Code Structure

## 1. Overview

This document defines the target folder structure for the VieLink codebase, following feature-based organization with clear separation of concerns. The structure supports scalability while maintaining the existing UI components.

### 1.1 Design Principles

1. **Feature-based Organization**: Group code by feature/domain, not by type
2. **Colocation**: Keep related code together (components, hooks, services)
3. **Clear Boundaries**: Each feature is self-contained with defined interfaces
4. **Shared Resources**: Common utilities in dedicated shared folder
5. **Flat over Nested**: Avoid deep nesting (max 3-4 levels)

---

## 2. Current Structure Analysis

### 2.1 Current Structure

```
src/
├── App.tsx                    # Main app with routing & auth logic
├── main.tsx                   # Entry point
├── index.css                  # Global styles
├── firebase.ts                # Firebase config
├── lib/
│   └── firestoreSchemas.ts    # Firestore types & helpers
│   └── utils.ts               # Utility functions
└── components/
    ├── ui/                    # 50+ shadcn/ui components
    ├── Dashboard.tsx          # Main dashboard (mixed concerns)
    ├── LoginPage.tsx          # Login UI
    ├── SignupPage.tsx         # Signup UI
    ├── CreateUsername.tsx     # Username creation
    ├── LinkEditor.tsx         # Link management
    ├── PhonePreview.tsx       # Mobile preview
    ├── Appearance.tsx         # Theme customization
    ├── Blocks.tsx             # Content blocks
    ├── Analytics.tsx          # Analytics display
    ├── Settings.tsx           # Page settings
    └── ...
```

### 2.2 Issues with Current Structure

| Issue | Description |
|-------|-------------|
| **Mixed Concerns** | Dashboard.tsx contains UI, state, and Firestore calls |
| **No Service Layer** | Direct Firestore imports in components |
| **Inconsistent State** | Mix of localStorage and Firestore |
| **No Type Safety** | Interfaces scattered across files |
| **Hard to Test** | Business logic tightly coupled to React |
| **Feature Discovery** | Related code spread across folders |

---

## 3. Target Structure

### 3.1 Complete Folder Structure

```
src/
├── app/                           # Application entry & routing
│   ├── App.tsx                    # Root component
│   ├── Router.tsx                 # Route definitions
│   └── providers/                 # React context providers
│       ├── index.tsx              # Provider composition
│       ├── AuthProvider.tsx       # Authentication context
│       └── QueryProvider.tsx      # TanStack Query provider
│
├── features/                      # Feature modules (business domains)
│   ├── auth/                      # Authentication feature
│   │   ├── components/            # Auth UI components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   └── OAuthButtons.tsx
│   │   ├── hooks/                 # Auth-related hooks
│   │   │   ├── useAuth.ts         # Auth state hook
│   │   │   ├── useLogin.ts        # Login mutation
│   │   │   └── useSignup.ts       # Signup mutation
│   │   ├── services/              # Auth business logic
│   │   │   └── authService.ts
│   │   ├── types/                 # Auth type definitions
│   │   │   └── index.ts
│   │   └── index.ts               # Feature public API
│   │
│   ├── bio-page/                  # Bio page management
│   │   ├── components/
│   │   │   ├── BioPageCard.tsx
│   │   │   ├── CreatePageForm.tsx
│   │   │   ├── BioEditor.tsx
│   │   │   └── PageSwitcher.tsx
│   │   ├── hooks/
│   │   │   ├── useBioPages.ts     # Query user's pages
│   │   │   ├── useBioPage.ts      # Query single page
│   │   │   ├── useCreateBioPage.ts
│   │   │   └── useUpdateBioPage.ts
│   │   ├── services/
│   │   │   └── bioPageService.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── links/                     # Social link management
│   │   ├── components/
│   │   │   ├── LinkEditor.tsx
│   │   │   ├── LinkItem.tsx
│   │   │   ├── LinkForm.tsx
│   │   │   └── SortableLinks.tsx
│   │   ├── hooks/
│   │   │   ├── useLinks.ts
│   │   │   ├── useCreateLink.ts
│   │   │   ├── useUpdateLink.ts
│   │   │   └── useReorderLinks.ts
│   │   ├── services/
│   │   │   └── linkService.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── blocks/                    # Content blocks
│   │   ├── components/
│   │   │   ├── BlockList.tsx
│   │   │   ├── BlockItem.tsx
│   │   │   ├── BlockTypeSelector.tsx
│   │   │   ├── EcommerceForm.tsx
│   │   │   ├── DonateForm.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   └── ChatForm.tsx
│   │   ├── hooks/
│   │   │   ├── useBlocks.ts
│   │   │   ├── useCreateBlock.ts
│   │   │   └── useProductFetch.ts
│   │   ├── services/
│   │   │   ├── blockService.ts
│   │   │   └── ecommerceService.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── appearance/                # Theme customization
│   │   ├── components/
│   │   │   ├── AppearanceEditor.tsx
│   │   │   ├── BackgroundPicker.tsx
│   │   │   ├── ButtonStylePicker.tsx
│   │   │   ├── FontPicker.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   └── TemplateGallery.tsx
│   │   ├── hooks/
│   │   │   ├── useThemeConfig.ts
│   │   │   └── useTemplates.ts
│   │   ├── services/
│   │   │   └── appearanceService.ts
│   │   ├── constants/
│   │   │   ├── fonts.ts
│   │   │   └── defaultTheme.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── analytics/                 # Analytics feature
│   │   ├── components/
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── ViewsChart.tsx
│   │   │   ├── ClicksChart.tsx
│   │   │   ├── TrafficSources.tsx
│   │   │   └── TimeFilter.tsx
│   │   ├── hooks/
│   │   │   ├── useAnalytics.ts
│   │   │   └── useTrafficSources.ts
│   │   ├── services/
│   │   │   └── analyticsService.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── public-page/               # Public bio page (visitor view)
│   │   ├── components/
│   │   │   ├── PublicPage.tsx
│   │   │   ├── LinkButton.tsx
│   │   │   ├── BlockRenderer.tsx
│   │   │   ├── DonatePopup.tsx
│   │   │   └── ContactFormPopup.tsx
│   │   ├── hooks/
│   │   │   ├── usePublicPage.ts
│   │   │   └── useTrackEvent.ts
│   │   └── index.ts
│   │
│   └── settings/                  # Page & account settings
│       ├── components/
│       │   ├── SettingsPanel.tsx
│       │   ├── CustomDomainForm.tsx
│       │   └── ProUpgradeCard.tsx
│       ├── hooks/
│       │   └── useSettings.ts
│       ├── services/
│       │   └── settingsService.ts
│       └── index.ts
│
├── shared/                        # Shared/common code
│   ├── components/                # Reusable UI components
│   │   ├── ui/                    # shadcn/ui components (50+)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── PhonePreview.tsx       # Bio page preview
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ConfirmDialog.tsx
│   │
│   ├── hooks/                     # Common hooks
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useCopyToClipboard.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── lib/                       # Utility libraries
│   │   ├── utils.ts               # General utilities (cn, etc.)
│   │   ├── validation.ts          # Validation functions
│   │   ├── formatters.ts          # Date, number formatters
│   │   └── constants.ts           # App-wide constants
│   │
│   ├── types/                     # Shared type definitions
│   │   ├── index.ts               # Re-exports
│   │   ├── common.ts              # Common types
│   │   └── api.ts                 # API response types
│   │
│   └── stores/                    # Global state (Zustand)
│       ├── uiStore.ts             # UI state (modals, tabs)
│       └── toastStore.ts          # Toast notifications
│
├── infrastructure/                # External service integrations
│   ├── firebase/                  # Firebase setup
│   │   ├── config.ts              # Firebase initialization
│   │   ├── auth.ts                # Auth utilities
│   │   └── firestore.ts           # Firestore client
│   │
│   ├── repositories/              # Data access layer
│   │   ├── userRepository.ts
│   │   ├── bioPageRepository.ts
│   │   ├── blockRepository.ts
│   │   ├── linkRepository.ts
│   │   └── analyticsRepository.ts
│   │
│   └── api/                       # External API clients
│       └── aiClient.ts            # AI service integration
│
├── pages/                         # Route page components
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── DashboardPage.tsx
│   ├── CreateUsernamePage.tsx
│   ├── ForgotPasswordPage.tsx
│   └── PublicBioPage.tsx
│
├── config/                        # Application configuration
│   ├── env.ts                     # Environment variables
│   ├── routes.ts                  # Route constants
│   └── queryKeys.ts               # React Query keys
│
├── styles/                        # Global styles
│   ├── index.css                  # Main stylesheet
│   ├── fonts.css                  # Font imports
│   └── themes.css                 # Theme variables
│
└── main.tsx                       # Application entry point
```

---

## 4. Feature Module Structure

### 4.1 Feature Module Pattern

Each feature follows a consistent structure:

```
features/{feature-name}/
├── components/          # UI components specific to this feature
├── hooks/               # React hooks for data fetching & mutations
├── services/            # Business logic (pure functions/classes)
├── types/               # TypeScript interfaces
├── constants/           # Feature-specific constants (optional)
└── index.ts             # Public API exports
```

### 4.2 Feature Index File

Each feature exports its public API through `index.ts`:

```typescript
// features/bio-page/index.ts

// Components
export { BioPageCard } from './components/BioPageCard';
export { CreatePageForm } from './components/CreatePageForm';
export { BioEditor } from './components/BioEditor';
export { PageSwitcher } from './components/PageSwitcher';

// Hooks
export { useBioPages } from './hooks/useBioPages';
export { useBioPage } from './hooks/useBioPage';
export { useCreateBioPage } from './hooks/useCreateBioPage';
export { useUpdateBioPage } from './hooks/useUpdateBioPage';

// Types
export type { BioPage, CreateBioPageDTO, UpdateBioPageDTO } from './types';
```

### 4.3 Import Rules

```typescript
// ✅ GOOD: Import from feature index
import { useBioPages, BioPageCard } from '@/features/bio-page';

// ✅ GOOD: Import shared components
import { Button, Dialog } from '@/shared/components/ui';
import { useDebounce } from '@/shared/hooks';

// ❌ BAD: Import from internal paths
import { useBioPages } from '@/features/bio-page/hooks/useBioPages';

// ❌ BAD: Cross-feature internal imports
import { someHelper } from '@/features/auth/services/authService';
```

---

## 5. Layer Responsibilities

### 5.1 Pages Layer

Located in `/pages/`, these are route entry points:

```typescript
// pages/DashboardPage.tsx
import { Dashboard } from '@/features/bio-page';
import { AuthGuard } from '@/features/auth';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}
```

**Rules:**
- Minimal logic, mainly composition
- Connect features together
- Handle route-level concerns (guards, layouts)

### 5.2 Components Layer

Located in `features/{name}/components/`:

```typescript
// features/bio-page/components/BioEditor.tsx
import { useBioPage, useUpdateBioPage } from '../hooks';
import { Input, Button } from '@/shared/components/ui';

export function BioEditor({ pageId }: { pageId: string }) {
  const { data: page, isLoading } = useBioPage(pageId);
  const { mutate: updatePage } = useUpdateBioPage();
  
  // Component handles UI only
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      updatePage({ id: pageId, data: formData });
    }}>
      {/* UI elements */}
    </form>
  );
}
```

**Rules:**
- Handle UI rendering and user interactions
- Use hooks for data fetching
- No direct Firestore imports
- Keep components focused (< 200 lines)

### 5.3 Hooks Layer

Located in `features/{name}/hooks/`:

```typescript
// features/bio-page/hooks/useBioPages.ts
import { useQuery } from '@tanstack/react-query';
import { bioPageService } from '../services/bioPageService';
import { useAuth } from '@/features/auth';

export function useBioPages() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['bioPages', 'user', user?.uid],
    queryFn: () => bioPageService.getByUserId(user!.uid),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}
```

**Rules:**
- Wrap services with React Query
- Handle loading/error states
- Manage cache invalidation
- Compose multiple service calls if needed

### 5.4 Services Layer

Located in `features/{name}/services/`:

```typescript
// features/bio-page/services/bioPageService.ts
import { bioPageRepository } from '@/infrastructure/repositories';
import { validateUsername } from '@/shared/lib/validation';
import type { BioPage, CreateBioPageDTO } from '../types';

class BioPageService {
  async create(data: CreateBioPageDTO): Promise<BioPage> {
    // Business validation
    const validation = validateUsername(data.username);
    if (!validation.isValid) {
      throw new ValidationError(validation.error!);
    }
    
    // Check uniqueness
    const existing = await bioPageRepository.findByUsername(data.username);
    if (existing) {
      throw new ConflictError('Username already taken');
    }
    
    // Create with defaults
    return bioPageRepository.create({
      ...data,
      themeConfig: DEFAULT_THEME,
      viewCount: 0,
      published: true,
    });
  }
  
  async getByUserId(userId: string): Promise<BioPage[]> {
    return bioPageRepository.findByUserId(userId);
  }
}

export const bioPageService = new BioPageService();
```

**Rules:**
- Pure business logic, no React
- Use repositories for data access
- Implement validation and rules
- Return domain models, not raw data

### 5.5 Repository Layer

Located in `/infrastructure/repositories/`:

```typescript
// infrastructure/repositories/bioPageRepository.ts
import { 
  collection, query, where, getDocs, addDoc, 
  doc, getDoc, updateDoc, deleteDoc, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/firestore';
import type { BioPage } from '@/features/bio-page';

class BioPageRepository {
  private collection = collection(db, 'bio_pages');
  
  async findById(id: string): Promise<BioPage | null> {
    const docRef = doc(this.collection, id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? this.mapToModel(snapshot) : null;
  }
  
  async findByUsername(username: string): Promise<BioPage | null> {
    const q = query(this.collection, where('username', '==', username.toLowerCase()));
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : this.mapToModel(snapshot.docs[0]);
  }
  
  async findByUserId(userId: string): Promise<BioPage[]> {
    const q = query(this.collection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(this.mapToModel);
  }
  
  async create(data: Omit<BioPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<BioPage> {
    const docRef = await addDoc(this.collection, {
      ...data,
      username: data.username.toLowerCase(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return this.findById(docRef.id) as Promise<BioPage>;
  }
  
  private mapToModel(doc: DocumentSnapshot): BioPage {
    const data = doc.data()!;
    return {
      id: doc.id,
      userId: data.userId,
      username: data.username,
      displayName: data.displayName ?? '',
      bioDescription: data.bioDescription ?? '',
      // ... map all fields with defaults
    };
  }
}

export const bioPageRepository = new BioPageRepository();
```

**Rules:**
- Only layer with Firestore imports
- Handle data mapping (Firestore → Domain)
- Implement standard CRUD operations
- Keep Firebase-specific logic here

---

## 6. Configuration Files

### 6.1 TypeScript Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/infrastructure/*": ["./src/infrastructure/*"]
    }
  }
}
```

### 6.2 Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

## 7. Migration Strategy

### 7.1 Phase 1: Infrastructure Layer

1. Create `/infrastructure/firebase/` from existing `firebase.ts`
2. Create `/infrastructure/repositories/` with Repository interfaces
3. Implement repositories using existing `firestoreSchemas.ts` logic
4. **No changes to existing components yet**

### 7.2 Phase 2: Shared Layer

1. Move `/components/ui/` to `/shared/components/ui/`
2. Create `/shared/hooks/` with extracted utility hooks
3. Create `/shared/lib/` with validation and utilities
4. Update imports across codebase

### 7.3 Phase 3: Feature Extraction

For each feature (auth, bio-page, links, etc.):

1. Create feature folder structure
2. Extract components from `/components/`
3. Create service layer from component logic
4. Create hooks wrapping services
5. Export public API via index.ts
6. Update imports in consuming code

### 7.4 Phase 4: Page Simplification

1. Create `/pages/` route components
2. Move routing logic to `/app/Router.tsx`
3. Simplify `App.tsx` to provider composition
4. Remove business logic from page components

### 7.5 Checklist

- [ ] Create folder structure
- [ ] Set up path aliases
- [ ] Move UI components to shared
- [ ] Create repositories
- [ ] Extract auth feature
- [ ] Extract bio-page feature
- [ ] Extract links feature
- [ ] Extract blocks feature
- [ ] Extract appearance feature
- [ ] Extract analytics feature
- [ ] Create settings feature
- [ ] Create public-page feature
- [ ] Simplify App.tsx
- [ ] Set up React Query provider
- [ ] Add Zustand stores
- [ ] Update all imports
- [ ] Remove old files

---

## 8. File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `BioEditor.tsx` |
| Hooks | camelCase, `use` prefix | `useBioPages.ts` |
| Services | camelCase, `Service` suffix | `bioPageService.ts` |
| Repositories | camelCase, `Repository` suffix | `bioPageRepository.ts` |
| Types | PascalCase | `types/index.ts` |
| Constants | camelCase or SCREAMING_SNAKE | `defaultTheme.ts` |
| Utilities | camelCase | `validation.ts` |

---

## 9. Testing Structure (Future)

```
src/
├── features/
│   └── bio-page/
│       ├── __tests__/
│       │   ├── bioPageService.test.ts
│       │   ├── useBioPages.test.ts
│       │   └── BioEditor.test.tsx
│       └── ...
├── infrastructure/
│   └── repositories/
│       └── __tests__/
│           └── bioPageRepository.test.ts
└── shared/
    └── lib/
        └── __tests__/
            └── validation.test.ts
```

**Testing Guidelines:**
- Services: Unit test business logic
- Repositories: Integration test with Firestore emulator
- Hooks: Test with React Testing Library + MSW
- Components: Snapshot + interaction tests

