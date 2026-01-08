# Domain-Based Multi-Tenant Architecture

## 🎯 Overview

This architecture implements **domain-based routing** to separate platform features from user content, following SaaS best practices (similar to Vercel, Netlify, Heroku custom domains).

## 🏗️ Architecture

### Two Domain Types

#### 1. **Platform Domain** (Full App Access)

- `localhost` / `127.0.0.1`
- `vielink.vn`
- Access: Dashboard, Login, Signup, Settings, Admin

#### 2. **Custom Domain** (Content Only)

- User tunnel domains: `*.trycloudflare.com`, `*.ngrok.io`
- User real domains: `mybio.com`, `john.dev`
- Access: **ONLY** bio pages (public content)
- **BLOCKED**: Dashboard, Login, Platform routes

---

## 🔐 Security Benefits

### What This Prevents:

- ❌ User domains accessing `/dashboard`
- ❌ User domains accessing `/login` or admin routes
- ❌ Auth cookies/sessions leaking to custom domains
- ❌ SEO duplicate content issues
- ❌ Security vulnerabilities via domain hijacking

### How It Works:

```
┌─────────────────────────────────────────────────┐
│  Request comes in                               │
│  ↓                                              │
│  Check hostname (domain detection)              │
│  ↓                                              │
│  ┌─────────────────┬──────────────────────┐   │
│  │ Platform Domain │  Custom Domain        │   │
│  │ (localhost)     │  (user tunnel/domain) │   │
│  ├─────────────────┼──────────────────────┤   │
│  │ → Full Routes   │  → Bio Page ONLY      │   │
│  │   /dashboard    │     / or /:username   │   │
│  │   /login        │     (block others)    │   │
│  │   /settings     │                       │   │
│  │   /:username    │                       │   │
│  └─────────────────┴──────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## 📁 File Structure

```
src/
├── shared/
│   ├── lib/
│   │   └── domainUtils.ts          # Domain detection logic
│   ├── contexts/
│   │   └── DomainContext.tsx       # React context for domain type
│   └── components/
│       └── DomainGuard.tsx         # Route protection component
├── app/
│   ├── App.tsx                     # Main routing with domain logic
│   └── providers/
│       └── index.tsx               # DomainProvider wrapper
└── features/
    └── bio-page/
        └── components/
            └── PublicBioPage.tsx   # Public bio page (custom domain target)
```

---

## 🛠️ Implementation Details

### 1. Domain Detection (`domainUtils.ts`)

```typescript
// Check if current domain is platform domain
isPlatformDomain("localhost"); // true
isPlatformDomain("vielink.vn"); // true
isPlatformDomain("abc.trycloudflare.com"); // false

// Get domain type
getDomainType(); // 'platform' | 'custom'
```

### 2. Domain Context (`DomainContext.tsx`)

Global context to share domain type across app:

```typescript
const { domainType, isPlatform, isCustom } = useDomain();
```

### 3. Routing Logic (`App.tsx`)

```typescript
// Early routing decision
const domainType = getDomainType();

if (domainType === "custom") {
  // Custom domain: only render PublicBioPage
  return <PublicBioPage />;
}

// Platform domain: full app
return <Routes>...</Routes>;
```

---

## 🧪 Testing Guide

### Test Case 1: Platform Domain (localhost)

```bash
# Access platform features
✓ http://localhost:3000/login
✓ http://localhost:3000/dashboard/john
✓ http://localhost:3000/john  (public bio page)
```

### Test Case 2: Custom Domain (tunnel)

```bash
# Setup tunnel
cloudflared tunnel --url http://localhost:3000

# Access via tunnel domain
✓ https://abc.trycloudflare.com/          → bio page (if mapped)
✓ https://abc.trycloudflare.com/john     → john's bio page
✗ https://abc.trycloudflare.com/login    → bio page (blocked)
✗ https://abc.trycloudflare.com/dashboard → bio page (blocked)
```

### Verification Checklist:

- [ ] Localhost shows full app (login, dashboard)
- [ ] Tunnel domain shows ONLY bio pages
- [ ] Tunnel domain /login redirects to bio page
- [ ] Tunnel domain /dashboard blocked
- [ ] Console logs show correct domain type

---

## 📊 Demo Flow (3-Minute Pitch)

### Story:

> "Notice what happens when I access via different domains..."

### Demo Steps:

**1. Show Platform (localhost)**

```
✓ Login page
✓ Dashboard with links editor
✓ Settings with custom domain setup
```

**2. Add Custom Domain**

```
Settings → Add Domain → Enter tunnel URL
→ Domain saved with bio page mapping
```

**3. Show Custom Domain (tunnel)**

```
✓ Access tunnel URL → Shows bio page immediately
✗ Try /login → Blocked (stays on bio page)
✗ Try /dashboard → Blocked
```

**4. Explain Security**

```
"Custom domains are isolated - users can't access platform features.
This prevents:
- Auth leaks
- Admin exposure
- Security vulnerabilities"
```

---

## 🔑 Key Technical Points (for Q&A)

### Q: "How does this work with one codebase?"

**A:** Domain detection at routing level. Same backend, different views based on hostname.

### Q: "What about DNS?"

**A:**

- **Development**: Tunnel (cloudflared/ngrok) forwards to localhost
- **Production**: User sets CNAME/A record to platform server

### Q: "How do you prevent platform route access?"

**A:** Early routing decision - custom domains never reach platform routes.

### Q: "Performance impact?"

**A:** Minimal - one `window.location.hostname` check at app load.

---

## 🚀 Production Deployment

### For Self-Hosted Users (like you):

```bash
1. Deploy app to server
2. Run tunnel (cloudflared/ngrok)
3. Add tunnel domain in Settings
4. Share tunnel URL with visitors
```

### For PRO Users (real domains):

```bash
1. User owns domain (mybio.com)
2. User sets DNS:
   CNAME mybio.com → your-platform-server.com
3. User adds domain in Settings
4. Platform maps domain → bio page
5. Visitors access mybio.com → see bio page
```

---

## 📝 Notes

- This architecture follows **Vercel/Netlify pattern**
- Separates **platform concerns** from **user content**
- Enables **white-label experiences**
- Scales to thousands of custom domains
- No infrastructure changes needed

---

## 🎓 Learning Resources

- [Vercel Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains)
- [Cloudflare Workers Routing](https://developers.cloudflare.com/workers/examples/routing/)
- [Multi-Tenant SaaS Patterns](https://docs.aws.amazon.com/whitepapers/latest/saas-architecture-fundamentals/multi-tenant-saas-architecture.html)
