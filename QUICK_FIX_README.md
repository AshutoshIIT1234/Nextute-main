# 🚨 QUICK FIX - Website Not Working in Production

## The Problem
Your production website at https://nextute.com is not working due to:
1. ❌ Missing `NODE_ENV=production` in backend
2. ❌ Missing `JWT_SECRET` in backend
3. ❌ Wrong API URLs in frontend .env
4. ❌ Possible deployment issues

## ✅ The Fix (Already Applied)

I've fixed the following files:
- `backend/.env` - Added NODE_ENV and JWT_SECRET
- `frontend/.env` - Fixed API URLs to point to production
- Created deployment scripts for easy deployment

---

## 🚀 Deploy Now (Choose One Method)

### Method 1: Automated Fix (RECOMMENDED)

**On Windows (Local Machine):**
```cmd
cd Nextute-main
deploy-production.bat
```

**Then upload to VPS:**
```cmd
scp -r Nextute-main root@72.60.218.219:/root/
```

**Then SSH to VPS and run:**
```bash
ssh root@72.60.218.219
cd /root/Nextute-main
chmod +x fix-production-issues.sh
./fix-production-issues.sh
```

This will:
- ✅ Fix all environment variables
- ✅ Rebuild frontend
- ✅ Update backend
- ✅ Restart all services
- ✅ Test that everything works

---

### Method 2: Manual Fix (If automated fails)

**SSH to your VPS:**
```bash
ssh root@72.60.218.219
```

**Run these commands:**
```bash
cd /root/Nextute-main

# Fix backend
cd backend
npm install
pm2 restart nextute-backend

# Fix frontend
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/nextute/

# Restart nginx
sudo systemctl restart nginx
```

---

## 🔍 Verify It's Working

After deployment, test these:

1. **Backend Test:**
```bash
curl http://localhost:8080/test
```
Should return: `{"status":true,"message":"Server is running!"}`

2. **Frontend Test:**
Open browser: https://nextute.com

3. **Check Logs:**
```bash
pm2 logs nextute-backend --lines 20
```

---

## 🆘 Still Not Working?

Run the diagnostic script:
```bash
cd /root/Nextute-main
chmod +x diagnose-production.sh
./diagnose-production.sh
```

This will show you exactly what's wrong.

---

## 📝 What Changed

### backend/.env
```diff
+ NODE_ENV=production
+ JWT_SECRET=t7DU1935c_Fy7AEXAqY7bg
```

### frontend/.env
```diff
- VITE_BACKEND_URL=http://localhost:8080
+ VITE_BACKEND_URL=https://nextute.com/api

- VITE_BACKEND_BASE_URL=http://localhost:8080
+ VITE_BACKEND_BASE_URL=https://nextute.com
```

---

## 🎯 Quick Commands Reference

```bash
# View backend logs
pm2 logs nextute-backend

# Restart backend
pm2 restart nextute-backend

# Restart nginx
sudo systemctl restart nginx

# Check status
pm2 status

# Run diagnostics
./diagnose-production.sh

# Full fix
./fix-production-issues.sh
```

---

## 📞 Need Help?

1. Check `PRODUCTION_CHECKLIST.md` for detailed troubleshooting
2. Run `./diagnose-production.sh` to see what's wrong
3. Check logs: `pm2 logs nextute-backend`

---

**Your VPS:** root@72.60.218.219  
**Your Domain:** https://nextute.com  
**Backend Port:** 8080  
**PM2 App Name:** nextute-backend
