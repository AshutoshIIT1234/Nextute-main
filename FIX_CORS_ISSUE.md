# CORS Issue Fix

## Problem
```
Access to fetch at 'https://www.nextute.com/api/institutes/all-institutes' 
from origin 'https://nextute.com' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Root Cause
The frontend is being accessed from `https://nextute.com` (without www) but the API is at `https://www.nextute.com` (with www). The CORS configuration only allowed the FRONTEND_URL from .env, which might not include both variants.

## Solution
Updated the CORS configuration in `backend/server.js` to explicitly allow both:
- `https://nextute.com` (without www)
- `https://www.nextute.com` (with www)

## Changes Made

### File: `backend/server.js`

**Before:**
```javascript
const allowedOrigins = new Set([
  process.env.FRONTEND_URL,
  ...devLocalOrigins,
].filter(Boolean));
```

**After:**
```javascript
const allowedOrigins = new Set([
  process.env.FRONTEND_URL,
  "https://nextute.com",
  "https://www.nextute.com",
  ...devLocalOrigins,
].filter(Boolean));
```

## Why This Happens

### Domain Variants
When users access your site, they might use:
1. `https://nextute.com` (without www)
2. `https://www.nextute.com` (with www)

Both are valid but considered different origins by CORS policy.

### API Location
Your API is hosted at `https://www.nextute.com/api`, so when someone visits `https://nextute.com` (without www), the browser blocks the cross-origin request.

## Deployment

### Quick Deploy to VPS
```bash
ssh root@72.60.218.219
cd /root/Nextute-main
git pull origin main
pm2 restart backend
```

### Verify Fix
```bash
# Check backend logs
pm2 logs backend --lines 20

# Test API
curl https://www.nextute.com/api/test
```

## Additional Recommendations

### 1. Set Up URL Redirect (Recommended)
Configure your web server to redirect one variant to the other:

**Option A: Redirect www to non-www**
```nginx
# In nginx config
server {
    server_name www.nextute.com;
    return 301 https://nextute.com$request_uri;
}
```

**Option B: Redirect non-www to www**
```nginx
# In nginx config
server {
    server_name nextute.com;
    return 301 https://www.nextute.com$request_uri;
}
```

### 2. Update DNS
Ensure both A records point to your VPS:
- `nextute.com` → 72.60.218.219
- `www.nextute.com` → 72.60.218.219

### 3. SSL Certificate
Make sure SSL certificate covers both variants:
```bash
# Using certbot
sudo certbot --nginx -d nextute.com -d www.nextute.com
```

## Testing

### Test CORS from Browser Console
```javascript
// Open browser console on https://nextute.com
fetch('https://www.nextute.com/api/test')
  .then(r => r.json())
  .then(d => console.log('Success:', d))
  .catch(e => console.error('Error:', e));
```

### Test from Both Domains
1. Visit `https://nextute.com` → Should work
2. Visit `https://www.nextute.com` → Should work
3. Check browser console for CORS errors

## Environment Variables

Verify your backend `.env` has:
```env
FRONTEND_URL=https://www.nextute.com
```

But now both variants are explicitly allowed in the code.

## Troubleshooting

### Still Getting CORS Error?

**Check 1: Backend Restarted**
```bash
pm2 restart backend
pm2 logs backend
```

**Check 2: Cache**
- Clear browser cache
- Hard refresh: Ctrl+Shift+R
- Try incognito mode

**Check 3: Backend Running**
```bash
pm2 status
curl http://localhost:8080/test
```

**Check 4: Nginx Configuration**
```bash
sudo nginx -t
sudo systemctl status nginx
```

### 503 Error

The 503 error indicates the backend service is down or not responding.

**Check:**
```bash
# Check if backend is running
pm2 status

# Check backend logs
pm2 logs backend --err

# Check port
sudo lsof -i :8080

# Restart if needed
pm2 restart backend
```

## Best Practices

### 1. Choose One Primary Domain
Decide whether to use:
- `nextute.com` (cleaner, shorter)
- `www.nextute.com` (traditional)

Then redirect the other to it.

### 2. Update All References
Update these to use your primary domain:
- Frontend `.env` files
- Backend `.env` files
- Social media links
- Email templates
- Documentation

### 3. SEO Considerations
Having both variants can hurt SEO. Use 301 redirects to consolidate.

## Summary

✅ **Fixed:** CORS now allows both `nextute.com` and `www.nextute.com`
✅ **Deploy:** Just restart backend on VPS
⚠️ **Recommended:** Set up redirect from one to the other
⚠️ **Check:** Ensure backend is running (503 error)

## Quick Fix Commands

```bash
# Connect to VPS
ssh root@72.60.218.219

# Update code
cd /root/Nextute-main
git pull origin main

# Restart backend
pm2 restart backend

# Check status
pm2 status
pm2 logs backend --lines 20

# Test API
curl http://localhost:8080/test
```

---

**Status:** ✅ Fixed - Deploy to resolve
**Priority:** High (affects all API calls)
