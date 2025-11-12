# 🔧 Fix CORS Error - Complete Guide

## 🚨 The Problem

You're seeing this error:
```
Access to XMLHttpRequest at 'https://www.nextute.com/api/institutes/all-institutes' 
from origin 'https://nextute.com' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Why it happens:**
- Your site is accessible from both `nextute.com` and `www.nextute.com`
- When users visit `nextute.com`, it tries to call API at `www.nextute.com`
- Nginx isn't passing CORS headers properly
- Browser blocks the request for security

---

## ✅ The Solution

I've created a fix that:
1. Updates nginx to handle CORS properly
2. Allows both `nextute.com` and `www.nextute.com`
3. Handles OPTIONS preflight requests
4. Passes Origin header to backend

---

## 🚀 Quick Fix (Recommended)

### Just double-click this file:
```
fix-cors-now.bat
```

This will:
1. Copy the fixed nginx config to your VPS
2. Apply the fix automatically
3. Reload nginx
4. Test the fix

**Done in 30 seconds!**

---

## 🔧 Manual Fix (If you prefer)

### Step 1: Copy files to VPS
```bash
scp nginx-production.conf root@72.60.218.219:/root/Nextute-main/
scp fix-cors.sh root@72.60.218.219:/root/Nextute-main/
```

### Step 2: SSH to VPS
```bash
ssh root@72.60.218.219
```

### Step 3: Run the fix script
```bash
cd /root/Nextute-main
chmod +x fix-cors.sh
./fix-cors.sh
```

---

## 🧪 Test the Fix

After applying the fix:

### 1. Test both URLs:
- Open https://nextute.com
- Open https://www.nextute.com
- Both should work without errors

### 2. Check browser console (F12):
- Should see no CORS errors
- API calls should succeed

### 3. Test CORS headers manually:
```bash
curl -I -H "Origin: https://nextute.com" https://www.nextute.com/api/test
```

Should see:
```
Access-Control-Allow-Origin: https://nextute.com
Access-Control-Allow-Credentials: true
```

---

## 📋 What Changed

### Before:
- Nginx didn't have CORS headers
- Backend CORS was correct but nginx blocked it
- Only one domain worked at a time

### After:
- Nginx handles OPTIONS preflight requests
- CORS headers added at nginx level
- Both domains work seamlessly
- Origin header passed to backend

### Files Modified:
1. **nginx-production.conf** - New production nginx config with CORS
2. **nginx.conf** - Updated Docker nginx config with CORS
3. **fix-cors.sh** - Automated fix script

---

## 🔍 Verify Configuration

### Check nginx config:
```bash
ssh root@72.60.218.219
sudo nginx -t
```

### Check nginx is running:
```bash
sudo systemctl status nginx
```

### View nginx logs:
```bash
sudo tail -f /var/log/nginx/nextute_error.log
```

### Check CORS headers in response:
```bash
curl -v -H "Origin: https://nextute.com" https://www.nextute.com/api/test 2>&1 | grep -i "access-control"
```

---

## 🐛 Troubleshooting

### If CORS error persists:

1. **Clear browser cache:**
   - Press Ctrl+Shift+Delete
   - Clear cached images and files
   - Or use Incognito mode

2. **Check nginx is using new config:**
   ```bash
   ssh root@72.60.218.219
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **Verify nginx config location:**
   ```bash
   ls -la /etc/nginx/sites-available/nextute
   ls -la /etc/nginx/sites-enabled/nextute
   ```

4. **Check backend is running:**
   ```bash
   pm2 status
   pm2 logs backend --lines 50
   ```

5. **Test backend directly:**
   ```bash
   curl http://localhost:8080/test
   ```

### If nginx test fails:

```bash
# Restore backup
sudo cp /etc/nginx/sites-available/nextute.backup.* /etc/nginx/sites-available/nextute
sudo systemctl reload nginx
```

### If still having issues:

Check these logs:
```bash
# Nginx error log
sudo tail -f /var/log/nginx/nextute_error.log

# Nginx access log
sudo tail -f /var/log/nginx/nextute_access.log

# Backend logs
pm2 logs backend --lines 100
```

---

## 🎯 Alternative: Redirect www to non-www

If you prefer to use only one domain, you can redirect:

### Option A: Redirect www → non-www
Add this to nginx config:
```nginx
server {
    listen 443 ssl http2;
    server_name www.nextute.com;
    return 301 https://nextute.com$request_uri;
}
```

### Option B: Redirect non-www → www
Add this to nginx config:
```nginx
server {
    listen 443 ssl http2;
    server_name nextute.com;
    return 301 https://www.nextute.com$request_uri;
}
```

---

## 📊 Expected Results

After fix:
- ✅ Both `nextute.com` and `www.nextute.com` work
- ✅ No CORS errors in browser console
- ✅ API calls succeed from both domains
- ✅ OPTIONS preflight requests handled
- ✅ Credentials (cookies) work properly

---

## 🚀 Deploy Full Update

After fixing CORS, deploy all updates:
```bash
deploy-to-vps.bat
```

This includes:
- CORS fix
- Cache busting solution
- All latest features

---

## 📞 Quick Commands

```bash
# Apply CORS fix
fix-cors-now.bat

# Test CORS
curl -I -H "Origin: https://nextute.com" https://www.nextute.com/api/test

# Check nginx
ssh root@72.60.218.219 "sudo nginx -t && sudo systemctl status nginx"

# View logs
ssh root@72.60.218.219 "sudo tail -f /var/log/nginx/nextute_error.log"

# Restart nginx
ssh root@72.60.218.219 "sudo systemctl restart nginx"
```

---

## ✅ Ready to Fix?

Run this command:
```bash
fix-cors-now.bat
```

**Your CORS issue will be fixed in 30 seconds!** 🎊
