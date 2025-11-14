# 🚨 CORS Error Fix - Production

## The Problem

Your website shows these errors in the browser console:
```
Access to fetch at 'https://www.nextute.com/api/institutes/all-institutes' 
from origin 'https://nextute.com' has been blocked by CORS policy
```

```
undefined/api/students/auth/login:1 Failed to load resource: 405 (Not Allowed)
```

## Root Causes

1. **www vs non-www mismatch** - Frontend at `https://nextute.com` trying to call API at `https://www.nextute.com/api`
2. **Undefined base URL** - `VITE_BACKEND_BASE_URL` not being loaded correctly
3. **Frontend not rebuilt** - Old build still has localhost URLs

---

## ✅ Quick Fix (FASTEST)

### Run This on Windows:
```cmd
cd Nextute-main
FIX_CORS_NOW.bat
```

This will:
- ✅ Rebuild frontend with correct URLs
- ✅ Upload to VPS
- ✅ Fix CORS automatically
- ✅ Restart all services

**Done!** Your site will work at both:
- https://nextute.com
- https://www.nextute.com

---

## 🔧 Manual Fix (If automated fails)

### Step 1: Fix Frontend .env
```bash
# On your local machine
cd Nextute-main/frontend

# Create .env file with:
VITE_API_URL=https://nextute.com/api
VITE_BACKEND_URL=https://nextute.com/api
VITE_BACKEND_BASE_URL=https://nextute.com
```

### Step 2: Rebuild Frontend
```cmd
npm install
npm run build
```

### Step 3: Upload to VPS
```cmd
scp -r Nextute-main root@72.60.218.219:/root/
```

### Step 4: Deploy on VPS
```bash
ssh root@72.60.218.219
cd /root/Nextute-main

# Deploy frontend
cd frontend
sudo cp -r dist/* /var/www/nextute/

# Restart services
pm2 restart nextute-backend
sudo systemctl restart nginx
```

---

## 🔍 Verify It's Fixed

### 1. Check Browser Console
Open https://nextute.com and press F12:
- ❌ Before: CORS errors
- ✅ After: No CORS errors

### 2. Test API Calls
```bash
# Should return JSON data
curl https://nextute.com/api/institutes/all-institutes
```

### 3. Check Backend Logs
```bash
ssh root@72.60.218.219
pm2 logs nextute-backend --lines 20
```

Should show successful API requests, no CORS errors.

---

## 📊 What Was Fixed

### Frontend .env (Before)
```env
VITE_BACKEND_BASE_URL=http://localhost:8080  ❌ Wrong!
```

### Frontend .env (After)
```env
VITE_BACKEND_BASE_URL=https://nextute.com  ✅ Correct!
```

### Backend CORS (Already Correct)
The backend already accepts both:
- `https://nextute.com`
- `https://www.nextute.com`

The issue was the frontend wasn't rebuilt with production URLs.

---

## 🎯 Why This Happened

1. **Development vs Production** - Frontend .env had localhost URLs
2. **Not Rebuilt** - Old build was deployed without rebuilding
3. **Environment Variables** - Vite needs rebuild to pick up new .env values

---

## 🆘 Still Having Issues?

### Issue: "undefined/api/..." in console
**Cause:** `VITE_BACKEND_BASE_URL` is undefined  
**Fix:** Rebuild frontend with correct .env

```bash
cd frontend
npm run build
sudo cp -r dist/* /var/www/nextute/
```

### Issue: CORS errors persist
**Cause:** Backend not accepting origin  
**Fix:** Check backend logs

```bash
pm2 logs nextute-backend
```

Look for CORS-related errors.

### Issue: 405 Method Not Allowed
**Cause:** Nginx blocking requests  
**Fix:** Check nginx config

```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

---

## 📝 Technical Details

### How Frontend Gets API URL

In `AppContext.jsx`:
```javascript
const VITE_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
```

This reads from `.env` file **at build time**, not runtime.

### Why Rebuild is Required

Vite embeds environment variables during build:
1. `.env` file is read
2. Variables are replaced in code
3. Code is bundled

Changing `.env` after build has no effect!

### Backend CORS Configuration

In `server.js`:
```javascript
const allowedOrigins = new Set([
  "https://nextute.com",
  "https://www.nextute.com",
  // ... more origins
]);
```

Backend already accepts both www and non-www.

---

## ✅ Checklist

After running the fix:

- [ ] Frontend rebuilt with production URLs
- [ ] Frontend deployed to `/var/www/nextute`
- [ ] Backend restarted with PM2
- [ ] Nginx restarted
- [ ] No CORS errors in browser console
- [ ] API calls working (check Network tab)
- [ ] Can log in/register
- [ ] Institutes loading on homepage

---

## 🚀 Quick Commands

```bash
# Rebuild and deploy
FIX_CORS_NOW.bat

# Or on VPS directly
./fix-cors-production.sh

# Check logs
pm2 logs nextute-backend

# Test API
curl https://nextute.com/api/test

# Restart everything
pm2 restart nextute-backend && sudo systemctl restart nginx
```

---

**Status:** Ready to fix  
**Estimated Time:** 5 minutes  
**Difficulty:** Easy (automated script available)
