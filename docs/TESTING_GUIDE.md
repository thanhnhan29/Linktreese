# Quick Testing Guide

## 🧪 Test Domain Routing Architecture

### Before Testing

Make sure your dev server is running:

```bash
npm run dev
```

---

## Test 1: Platform Domain (localhost)

### Access localhost routes:

```
✓ http://localhost:3000/login           → Login page
✓ http://localhost:3000/dashboard/oke4  → Dashboard (if logged in)
✓ http://localhost:3000/oke4            → Public bio page
```

**Expected Console Log:**

```
[App] Domain routing: {
  domainType: 'platform',
  hostname: 'localhost',
  path: '/login'
}
```

---

## Test 2: Custom Domain (Cloudflare Tunnel)

### 1. Start tunnel (in separate terminal):

```bash
cloudflared tunnel --url http://localhost:3000
```

### 2. Copy tunnel URL from terminal:

```
https://small-procedure-properly-branches.trycloudflare.com
```

### 3. Add domain in Settings:

```
1. Login to localhost:3000
2. Go to Settings
3. Click "Setup Custom Domain"
4. Enter: small-procedure-properly-branches.trycloudflare.com
5. Click "Kết nối"
```

### 4. Test tunnel domain:

```
✓ https://small-procedure...trycloudflare.com/          → Bio page (root)
✓ https://small-procedure...trycloudflare.com/oke4     → Bio page (username)
✗ https://small-procedure...trycloudflare.com/login    → Bio page (blocked!)
✗ https://small-procedure...trycloudflare.com/dashboard → Bio page (blocked!)
```

**Expected Console Log:**

```
[App] Domain routing: {
  domainType: 'custom',
  hostname: 'small-procedure-properly-branches.trycloudflare.com',
  path: '/login'
}
[PublicBioPage] Checking custom domain: small-procedure-properly-branches.trycloudflare.com
[customDomainService] Looking up domain: small-procedure-properly-branches.trycloudflare.com
```

---

## ✅ Success Criteria

- [ ] Localhost shows login page at `/login`
- [ ] Localhost shows dashboard at `/dashboard/:username`
- [ ] Tunnel domain shows bio page at root `/`
- [ ] Tunnel domain blocks `/login` (shows bio page instead)
- [ ] Tunnel domain blocks `/dashboard` (shows bio page instead)
- [ ] Console logs show correct `domainType`

---

## 🐛 Troubleshooting

### Issue: Tunnel domain shows 404

**Solution:** Make sure you added the domain in Settings and it's marked as "active"

### Issue: Still seeing login page on tunnel domain

**Solution:** Check console logs - if `domainType` is 'platform', tunnel domain might be in PLATFORM_DOMAINS array

### Issue: "Domain not found" in Firestore

**Solution:**

1. Check Firebase Console → custom_domains collection
2. Verify domain matches exactly (no https://, no trailing /)
3. Check status is "active"

---

## 🎯 Demo Script (30 seconds)

```
1. Show localhost:3000/login → "This is the platform"
2. Show localhost:3000/dashboard → "Only accessible from platform domain"
3. Open tunnel URL in new tab → "This is user's custom domain"
4. Try tunnel-url/login → "Platform features blocked - security!"
5. Show bio page working → "Users only see their content"
```
