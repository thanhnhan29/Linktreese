# VieLink - System Architecture

## 1. Overview

This document defines the target architecture for the VieLink platform, designed to follow microservice-ready patterns and modern web development best practices while maintaining the existing React-based UI.

### 1.1 Architecture Goals

1. **Separation of Concerns**: Clear boundaries between UI, business logic, and data access
2. **Testability**: Each layer can be unit tested independently
3. **Scalability**: Ready to migrate to actual microservices when needed
4. **Maintainability**: Feature-based organization for easier navigation
5. **Type Safety**: Strong TypeScript typing throughout the application

### 1.2 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **UI Framework** | React 18 + TypeScript | Component-based user interface |
| **Build Tool** | Vite | Fast development and optimized builds |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework |
| **UI Components** | Radix UI (shadcn/ui) | Accessible, customizable components |
| **State Management** | TanStack Query (React Query) | Server state management and caching |
| **Client State** | Zustand | Lightweight client-side state |
| **Authentication** | Firebase Auth | User authentication and OAuth |
| **Database** | Firebase Firestore | NoSQL document database |
| **File Storage** | Firebase Storage | User-uploaded images |

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            CLIENT BROWSER                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                     PRESENTATION LAYER                              │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │ │
│  │  │    Pages    │  │  Components │  │    Hooks    │  │   Forms    │ │ │
│  │  │  (Routes)   │  │   (UI Kit)  │  │  (Custom)   │  │(Validation)│ │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│                                    ▼                                     │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                   APPLICATION LAYER (Services)                      │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │ │
│  │  │AuthService  │  │BioPageSvc   │  │BlockService │  │AnalyticsSvc│ │ │
│  │  │             │  │             │  │             │  │            │ │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│                                    ▼                                     │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    DATA ACCESS LAYER (Repositories)                 │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │ │
│  │  │ UserRepo    │  │BioPageRepo  │  │  BlockRepo  │  │ EventRepo  │ │ │
│  │  │             │  │             │  │             │  │            │ │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
└────────────────────────────────────│─────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          INFRASTRUCTURE LAYER                            │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────┐   │
│  │     Firebase Firestore      │  │        Firebase Auth            │   │
│  │     (Document Database)     │  │      (Authentication)           │   │
│  └─────────────────────────────┘  └─────────────────────────────────┘   │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────┐   │
│  │     Firebase Storage        │  │     External APIs (AI, etc)     │   │
│  │     (File Storage)          │  │                                 │   │
│  └─────────────────────────────┘  └─────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Layer Descriptions

### 3.1 Presentation Layer

The presentation layer contains all UI-related code. Components should be **pure** and contain no business logic.

**Responsibilities:**
- Render UI based on props and state
- Handle user interactions (delegate to services)
- Display loading and error states
- Form validation and user feedback

**Key Principles:**
- Components receive data via props or hooks
- No direct Firestore imports in components
- Use React Query hooks for data fetching
- Use Zustand for local UI state (modals, tabs, etc.)

```typescript
// Example: Component using service via hook
function Dashboard() {
  const { data: bioPages, isLoading } = useBioPages();
  const { mutate: createPage } = useCreateBioPage();

  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div>
      {bioPages.map(page => <BioPageCard key={page.id} page={page} />)}
      <Button onClick={() => createPage({ username: 'new-page' })}>
        Create New Page
      </Button>
    </div>
  );
}
```

### 3.2 Application Layer (Services)

Services contain **business logic** and orchestrate operations across repositories.

**Responsibilities:**
- Implement business rules and validation
- Coordinate multiple repository operations
- Transform data between layers
- Handle complex workflows

**Services:**

| Service | Responsibility |
|---------|----------------|
| `AuthService` | User authentication, registration, password reset |
| `BioPageService` | Bio page CRUD, theme configuration |
| `BlockService` | Content blocks management (all types) |
| `LinkService` | Social link management |
| `AnalyticsService` | Event logging, statistics aggregation |
| `StorageService` | File uploads (images) |
| `AIService` | AI content generation |

```typescript
// Example: Service with business logic
class BioPageService {
  constructor(
    private bioPageRepo: BioPageRepository,
    private blockRepo: BlockRepository
  ) {}

  async createBioPage(userId: string, username: string): Promise<BioPage> {
    // Business rule: validate username
    if (!this.isValidUsername(username)) {
      throw new ValidationError('Invalid username format');
    }

    // Business rule: check uniqueness
    const exists = await this.bioPageRepo.findByUsername(username);
    if (exists) {
      throw new ConflictError('Username already taken');
    }

    // Create with default theme
    return this.bioPageRepo.create({
      userId,
      username,
      themeConfig: DEFAULT_THEME,
      viewCount: 0,
    });
  }

  private isValidUsername(username: string): boolean {
    return /^[a-zA-Z0-9_]{3,30}$/.test(username);
  }
}
```

### 3.3 Data Access Layer (Repositories)

Repositories abstract all database operations. They should be the **only** code that imports Firebase/Firestore.

**Responsibilities:**
- CRUD operations for entities
- Query building and execution
- Data mapping (Firestore → Domain models)
- Firestore-specific logic (transactions, batches)

**Repositories:**

| Repository | Collection(s) |
|------------|---------------|
| `UserRepository` | `users` |
| `BioPageRepository` | `bio_pages` |
| `BlockRepository` | `bio_pages/{id}/blocks` |
| `LinkRepository` | `bio_pages/{id}/links` |
| `AnalyticsRepository` | `analytics_events` |
| `CustomDomainRepository` | `custom_domains` |

```typescript
// Example: Repository interface
interface BioPageRepository {
  findById(id: string): Promise<BioPage | null>;
  findByUsername(username: string): Promise<BioPage | null>;
  findByUserId(userId: string): Promise<BioPage[]>;
  create(data: CreateBioPageDTO): Promise<BioPage>;
  update(id: string, data: UpdateBioPageDTO): Promise<BioPage>;
  delete(id: string): Promise<void>;
}

// Example: Firestore implementation
class FirestoreBioPageRepository implements BioPageRepository {
  private collection = collection(db, 'bio_pages');

  async findByUsername(username: string): Promise<BioPage | null> {
    const q = query(this.collection, where('username', '==', username));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return this.mapToModel(snapshot.docs[0]);
  }

  private mapToModel(doc: DocumentSnapshot): BioPage {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      username: data.username,
      bioDescription: data.bioDescription,
      themeConfig: data.themeConfig,
      viewCount: data.viewCount,
      createdAt: data.createdAt?.toDate(),
    };
  }
}
```

### 3.4 Infrastructure Layer

The infrastructure layer contains all external service integrations.

**Components:**
- Firebase configuration and initialization
- Firebase Auth wrapper
- Firebase Storage wrapper
- External API clients (Google AI, e-commerce scrapers)

---

## 4. Data Flow

### 4.1 Read Flow (Query)

```
┌──────────┐    ┌────────────┐    ┌─────────────┐    ┌────────────┐    ┌──────────┐
│   User   │───▶│ Component  │───▶│ React Query │───▶│  Service   │───▶│Repository│
│ Clicks   │    │ useQuery() │    │   Cache     │    │            │    │          │
└──────────┘    └────────────┘    └─────────────┘    └────────────┘    └──────────┘
                      ▲                                                      │
                      │                                                      ▼
                      │                                                ┌──────────┐
                      └────────────────────────────────────────────────│Firestore │
                                      (cached data)                    └──────────┘
```

### 4.2 Write Flow (Mutation)

```
┌──────────┐    ┌────────────┐    ┌─────────────┐    ┌────────────┐    ┌──────────┐
│   User   │───▶│ Component  │───▶│useMutation()│───▶│  Service   │───▶│Repository│
│ Submits  │    │            │    │             │    │ (validate) │    │          │
└──────────┘    └────────────┘    └─────────────┘    └────────────┘    └──────────┘
                      │                                                      │
                      │                                                      ▼
                      │                                                ┌──────────┐
                      │◀───────────────(invalidate cache)──────────────│Firestore │
                      │                                                └──────────┘
```

---

## 5. State Management Strategy

### 5.1 Server State (TanStack Query)

For data from Firestore that needs to be cached, refetched, and synchronized.

```typescript
// queries.ts
export const bioPageKeys = {
  all: ['bioPages'] as const,
  byUser: (userId: string) => [...bioPageKeys.all, 'user', userId] as const,
  byUsername: (username: string) => [...bioPageKeys.all, 'username', username] as const,
};

// useBioPages.ts
export function useBioPages(userId: string) {
  return useQuery({
    queryKey: bioPageKeys.byUser(userId),
    queryFn: () => bioPageService.getByUserId(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateBioPage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bioPageService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bioPageKeys.all });
    },
  });
}
```

### 5.2 Client State (Zustand)

For UI-only state that doesn't need server synchronization.

```typescript
// stores/uiStore.ts
interface UIState {
  currentTab: 'links' | 'appearance' | 'analytics' | 'settings';
  isMobileMenuOpen: boolean;
  activeModal: string | null;
  setCurrentTab: (tab: UIState['currentTab']) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentTab: 'links',
  isMobileMenuOpen: false,
  activeModal: null,
  setCurrentTab: (tab) => set({ currentTab: tab }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
}));
```

---

## 6. Error Handling Strategy

### 6.1 Error Types

```typescript
// errors/AppError.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
    this.name = 'ConflictError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}
```

### 6.2 Error Handling in Layers

```typescript
// Repository: Wrap Firebase errors
async create(data: CreateBioPageDTO): Promise<BioPage> {
  try {
    const docRef = await addDoc(this.collection, data);
    return this.findById(docRef.id);
  } catch (error) {
    if (error.code === 'permission-denied') {
      throw new UnauthorizedError('Permission denied');
    }
    throw new AppError('Failed to create bio page', 'DATABASE_ERROR');
  }
}

// Component: Use error boundary + toast
function Dashboard() {
  const { data, error, isError } = useBioPages(userId);

  useEffect(() => {
    if (isError) {
      toast.error(getErrorMessage(error));
    }
  }, [isError, error]);
}
```

---

## 7. Real-time Updates

For features requiring live updates (e.g., preview), use Firestore's `onSnapshot`:

```typescript
// hooks/useBioPageRealtime.ts
export function useBioPageRealtime(pageId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const docRef = doc(db, 'bio_pages', pageId);
    
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = mapToBioPage(snapshot);
        queryClient.setQueryData(bioPageKeys.byId(pageId), data);
      }
    });

    return () => unsubscribe();
  }, [pageId, queryClient]);
}
```

---

## 8. Security Considerations

### 8.1 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Bio pages owned by user
    match /bio_pages/{pageId} {
      allow read: if true; // Public pages
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null 
        && request.auth.uid == resource.data.userId;

      // Blocks subcollection
      match /blocks/{blockId} {
        allow read: if true;
        allow write: if request.auth != null 
          && request.auth.uid == get(/databases/$(database)/documents/bio_pages/$(pageId)).data.userId;
      }
    }

    // Analytics: append-only
    match /analytics_events/{eventId} {
      allow read: if false;
      allow create: if true;
    }
  }
}
```

### 8.2 Input Validation

All user input must be validated at the service layer before reaching the repository:

- Sanitize URLs to prevent XSS
- Validate file types and sizes
- Validate username format
- Sanitize HTML/markdown content

---

## 9. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CDN (Cloudflare/Vercel)                     │
│                    ┌─────────────────────────────┐                  │
│                    │   Static Assets (JS, CSS)   │                  │
│                    └─────────────────────────────┘                  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                         Hosting (Vercel/Firebase)                   │
│                    ┌─────────────────────────────┐                  │
│                    │    React SPA Application    │                  │
│                    └─────────────────────────────┘                  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                         Firebase Services                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │  Firestore  │  │    Auth     │  │   Storage   │  │ Functions  │ │
│  │ (Database)  │  │(OAuth/JWT)  │  │  (Images)   │  │ (Optional) │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 10. Future Microservice Migration Path

When scaling requires actual microservices:

1. **Auth Service** → Separate Node.js service with Firebase Admin SDK
2. **Bio Page API** → REST/GraphQL API service
3. **Analytics Service** → Dedicated analytics backend (possibly with ClickHouse)
4. **Scraper Service** → Serverless functions for e-commerce data extraction
5. **Email Service** → Dedicated email sending service (SendGrid, etc.)

The current architecture's clean separation makes this migration straightforward - repositories become API clients, services remain mostly unchanged.

