# Custom Domain - Self-Hosted Guide

Hướng dẫn sử dụng tính năng Custom Domain để host bio page trên domain riêng **mà không cần deploy server lên cloud**.

## 🎯 Ý tưởng

```
┌─────────────────────────────────────────────────────────────────┐
│  MÁY CỦA BẠN (PRO User)                                        │
│                                                                 │
│  ┌──────────────────┐                                          │
│  │  localhost:3002  │ ◄──── Vite dev server (npm run dev)      │
│  │  (React App)     │                                          │
│  └────────┬─────────┘                                          │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────┐                                          │
│  │  Tunnel Service  │ cloudflared / ngrok                      │
│  │  abc.ngrok.io    │ → expose localhost ra internet           │
│  └────────┬─────────┘                                          │
└───────────┼─────────────────────────────────────────────────────┘
            │
            │ Internet
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  VISITOR (bất kỳ ai trên internet)                             │
│                                                                 │
│  Truy cập: https://abc.ngrok.io                                │
│            ↓                                                    │
│  Request forward về localhost:3002 của bạn                     │
│            ↓                                                    │
│  React app check hostname (abc.ngrok.io)                       │
│            ↓                                                    │
│  Query Firebase: abc.ngrok.io → bioPageId                      │
│            ↓                                                    │
│  Load bio data & render page                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Điểm quan trọng:**

- Server (Vite) chạy trên máy bạn, KHÔNG deploy đi đâu
- Tunnel service chỉ là "cầu nối" giữa internet và localhost
- Firebase chỉ lưu data (bio, links, domain mapping), không phải host app
- Khi tắt máy/tunnel → domain không truy cập được

---

## 📋 Các bước thực hiện

### Option 1: Cloudflare Tunnel (Khuyên dùng - Dễ nhất)

**Ưu điểm:**

- Miễn phí, không cần đăng ký
- Có HTTPS tự động
- Subdomain ngẫu nhiên (\*.trycloudflare.com)
- Dễ setup, 2 phút là xong

**Bước thực hiện:**

1. **Cài đặt cloudflared:**

   ```bash
   # macOS
   brew install cloudflare/cloudflare/cloudflared

   # Hoặc download từ: https://github.com/cloudflare/cloudflared/releases
   ```

2. **Chạy dev server như bình thường:**

   ```bash
   cd /Users/vothanhnhan/Linktreese
   npm run dev
   # Server chạy tại http://localhost:3002 (hoặc port khác)
   ```

3. **Tạo tunnel (terminal mới):**

   ```bash
   cloudflared tunnel --url http://localhost:3002
   ```

4. **Output sẽ như thế này:**

   ```
   Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):
   https://random-name-1234.trycloudflare.com
   ```

5. **Test:**
   - Mở https://random-name-1234.trycloudflare.com trong browser
   - Login và vào Settings → Custom Domain
   - Nhập domain: `random-name-1234.trycloudflare.com`
   - Click "Verify" → Sẽ verify thành công (demo mode)
   - Truy cập `https://random-name-1234.trycloudflare.com` → Hiển thị bio page

**Lưu ý:**

- Domain thay đổi mỗi lần chạy `cloudflared`
- Để domain cố định, dùng `cloudflared tunnel create` (cần đăng ký Cloudflare account miễn phí)

---

### Option 2: ngrok (Nhanh, có free tier)

**Ưu điểm:**

- Setup nhanh, 1 command
- Có dashboard để xem requests
- Free tier: subdomain ngẫu nhiên

**Bước thực hiện:**

1. **Cài đặt ngrok:**

   ```bash
   # macOS
   brew install ngrok/ngrok/ngrok

   # Hoặc download từ: https://ngrok.com/download
   ```

2. **Đăng ký account miễn phí:**

   - Vào https://dashboard.ngrok.com/signup
   - Copy authtoken

   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

3. **Chạy dev server:**

   ```bash
   npm run dev
   # Server tại http://localhost:3002
   ```

4. **Expose qua ngrok:**

   ```bash
   ngrok http 3002
   ```

5. **Output:**

   ```
   Forwarding  https://abc123.ngrok-free.app -> http://localhost:3002
   ```

6. **Test:**
   - Mở https://abc123.ngrok-free.app
   - Login → Settings → Custom Domain
   - Nhập: `abc123.ngrok-free.app`
   - Verify → Success
   - Truy cập domain → Bio page hiển thị

**Nâng cao (Paid):**

- ngrok Pro: custom subdomain cố định (`myname.ngrok.app`)
- ngrok Enterprise: custom domain thật (`links.yourdomain.com`)

---

### Option 3: Deploy lên Server/Vercel với Domain Thật

**Nếu bạn có domain thực:**

1. **Deploy app lên Vercel/Netlify:**

   ```bash
   # Vercel
   npm install -g vercel
   vercel --prod

   # Hoặc Netlify
   netlify deploy --prod
   ```

2. **Config DNS:**

   - Vào domain registrar (GoDaddy, Namecheap, etc.)
   - Thêm CNAME record:
     ```
     links.yourdomain.com → your-app.vercel.app
     ```

3. **Trong Settings UI:**

   - Nhập: `links.yourdomain.com`
   - Service sẽ sinh TXT record để verify:
     ```
     _vielink-verification.links.yourdomain.com
     TXT vielink-verify-abc123xyz
     ```

4. **Thêm TXT record vào DNS:**

   - Name: `_vielink-verification.links`
   - Type: TXT
   - Value: `vielink-verify-abc123xyz`

5. **Click Verify:**
   - Production mode: service sẽ query DNS để check TXT record
   - Demo mode (hiện tại): auto-verify

---

## 🔧 Code Đã Implement

### 1. Types (`src/shared/types/customDomain.ts`)

```typescript
export interface CustomDomain {
  id: string;
  userId: string;
  bioPageId: string;
  domain: string;
  status: "pending" | "verified" | "active" | "failed";
  verificationToken: string;
  verificationMethod: "txt" | "cname";
  // ...
}
```

### 2. Repository (`src/infrastructure/repositories/customDomainRepository.ts`)

- `createDomain()` - Lưu domain vào Firestore
- `getDomainByName()` - Tìm domain
- `updateDomainStatus()` - Update trạng thái verify/active

### 3. Service (`src/features/custom-domain/services/customDomainService.ts`)

- `createDomain()` - Validate + tạo domain
- `verifyDomain()` - Verify DNS (demo: auto-success)
- `getBioPageByDomain()` - Map domain → bioPageId

### 4. Hook (`src/features/custom-domain/hooks/useCustomDomain.ts`)

```typescript
const { domain, createDomain, verifyDomain, deleteDomain } = useCustomDomain({
  userId,
  bioPageId,
});
```

### 5. UI (`src/components/Settings.tsx`)

- Section "Custom Domain" with PRO badge
- Input + Verify button
- Verification instructions
- Status display (verified/pending)

### 6. Routing (`src/features/bio-page/components/PublicBioPage.tsx`)

```typescript
// Check if accessing via custom domain
const currentHost = window.location.hostname;
const isCustomDomain =
  !currentHost.includes("localhost") && !currentHost.includes("vielink.vn");

if (isCustomDomain) {
  bioPageId = await customDomainService.getBioPageByDomain(currentHost);
}
```

---

## 🎬 Flow Hoàn Chỉnh

1. **User vào Settings → Custom Domain**
2. **Nhập domain (ví dụ: `abc.trycloudflare.com`)**
3. **Click "Verify Domain":**
   - Frontend gọi `createDomain(domain)`
   - Service tạo record trong Firestore:
     ```json
     {
       "domain": "abc.trycloudflare.com",
       "status": "pending",
       "verificationToken": "vielink-verify-xyz123",
       "verificationMethod": "txt"
     }
     ```
   - Service gọi `verifyDomain(domainId)`
   - **Demo mode:** Auto-verify → status = "active"
   - **Production mode:** Query DNS TXT record
4. **UI hiển thị "Domain Verified"**
5. **User truy cập `https://abc.trycloudflare.com`:**
   - `PublicBioPage` detect custom domain
   - Gọi `getBioPageByDomain("abc.trycloudflare.com")`
   - Load bioPage data
   - Render PublicBioView

---

## 🚀 Test Ngay

**Bước 1:** Chạy app

```bash
npm run dev
```

**Bước 2:** Tạo tunnel (chọn 1 cách)

```bash
# Cloudflare
cloudflared tunnel --url http://localhost:3002

# Hoặc ngrok
ngrok http 3002
```

**Bước 3:** Test

1. Mở tunnel URL trong browser
2. Login account
3. Vào Settings → Custom Domain
4. Nhập tunnel domain (ví dụ: `abc123.trycloudflare.com`)
5. Click "Verify" → Success
6. Reload page → Bio page hiển thị với custom domain

---

## 🔐 Production Considerations

Khi deploy thật cần:

1. **DNS Verification Real:**

   - Dùng DNS query library (dns-lookup, node-dns)
   - Check TXT record: `_vielink-verification.{domain}`
   - Or CNAME: `{domain}` → `vielink.vn`

2. **SSL Certificate:**

   - Auto với CDN (Cloudflare, Vercel)
   - Or Let's Encrypt ACME
   - Store cert trong Firestore/S3

3. **Server Config:**

   - Nginx/Caddy virtual host
   - Or CDN edge workers
   - Map custom domain → origin

4. **Rate Limiting:**
   - Limit số domain per user
   - Prevent abuse/spam domains

---

## ❓ FAQ

**Q: Tại sao dùng cloudflared thay vì ngrok?**
A: Cloudflared không cần đăng ký, instant subdomain, và free. ngrok cần auth token.

**Q: Domain tạm có thay đổi không?**
A: Có, cloudflared tạo subdomain mới mỗi lần chạy. Muốn cố định cần tạo named tunnel hoặc dùng ngrok Pro.

**Q: Demo mode có gì khác Production?**
A: Demo auto-verify domain. Production phải query DNS thật để verify ownership.

**Q: Custom domain có track analytics không?**
A: Có! Analytics tracking vẫn hoạt động bình thường với custom domain.

---

Chúc demo thành công! 🎉
