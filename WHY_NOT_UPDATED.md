# Why VPS Not Updated - Troubleshooting Guide

## Common Reasons Updates Don't Show

### 1. 🔄 Frontend Not Rebuilt
**Problem:** Code updated but frontend not rebuilt
**Check:**
```bash
ls -la frontend/dist/index.html
# Check if date is recent
```
**Fix:**
```bash
cd frontend
rm -rf dist node_modules
npm install
npm run build
```

### 2. 🔴 PM2 Not Restarted
**Problem:** Services still running old code
**Check:**
```bash
pm2 status
pm2 logs backend --lines 20
```
**Fix:**
```bash
pm2 restart all
# OR force restart
pm2 delete all
pm2 start ecosystem.config.js
```

### 3. 📦 Git Not Pulled
**Problem:** Latest code not on VPS
**Check:**
```bash
git log -1 --oneline
git status
```
**Fix:**
```bash
git fetch origin
git pull origin main
# OR force pull
git reset --hard origin/main
```

### 4. 🗄️ Database Not Updated
**Problem:** Schema changes not applied
**Check:**
```bash
cd backend
npx prisma db pull
# Check if calendly_link column exists
```
**Fix:**
```bash
cd backend
npx prisma db push --accept-data-loss
node prisma/seed-mentors.js
```

### 5. 🌐 Browser Cache
**Problem:** Browser showing cached version
**Check:** Open in incognito/private mode
**Fix:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Test in incognito mode

### 6. 🔧 Nginx Cache (If using Nginx)
**Problem:** Nginx serving cached files
**Check:**
```bash
sudo nginx -t
ls -la /var/www/nextute/
```
**Fix:**
```bash
# Copy new build
sudo cp -r frontend/dist/* /var/www/nextute/
# Clear nginx cache
sudo rm -rf /var/cache/nginx/*
sudo systemctl restart nginx
```

### 7. 📝 Environment Variables
**Problem:** Missing or incorrect .env values
**Check:**
```bash
cd backend
cat .env | grep -E "DATABASE_URL|EMAIL_USER|TOKEN_KEY"
```
**Fix:**
```bash
# Edit .env file
nano backend/.env
# Restart after changes
pm2 restart all
```

### 8. 🔌 Port Issues
**Problem:** Backend not running on correct port
**Check:**
```bash
sudo lsof -i :8080
curl http://localhost:8080/test
```
**Fix:**
```bash
# Kill process on port
sudo kill -9 $(lsof -t -i:8080)
# Restart
pm2 restart backend
```

### 9. 📂 Wrong Directory
**Problem:** Deploying to wrong location
**Check:**
```bash
pwd
ls -la
# Should see backend/ and frontend/ folders
```
**Fix:**
```bash
cd /correct/path/to/Nextute-main
```

### 10. 🔐 Permission Issues
**Problem:** No permission to write files
**Check:**
```bash
ls -la
# Check file ownership
```
**Fix:**
```bash
sudo chown -R $USER:$USER .
chmod -R 755 .
```

## 🔍 Quick Diagnostic Commands

Run these on your VPS:

```bash
# 1. Check if backend is running
curl http://localhost:8080/test

# 2. Check PM2 status
pm2 status

# 3. Check recent logs
pm2 logs backend --lines 50

# 4. Check Git status
git log -1 --oneline
git status

# 5. Check frontend build date
ls -la frontend/dist/index.html

# 6. Check database connection
cd backend && npx prisma db pull

# 7. Check for errors
pm2 logs backend --err --lines 50

# 8. Check port usage
sudo lsof -i :8080
```

## 🚨 Nuclear Option - Complete Rebuild

If nothing works, use this:

```bash
# 1. Stop everything
pm2 stop all
pm2 delete all

# 2. Clean everything
rm -rf backend/node_modules frontend/node_modules frontend/dist

# 3. Pull latest
git fetch origin
git reset --hard origin/main

# 4. Rebuild backend
cd backend
npm install
npx prisma generate
npx prisma db push
node prisma/seed-mentors.js

# 5. Rebuild frontend
cd ../frontend
npm install
npm run build

# 6. Restart
cd ..
pm2 start ecosystem.config.js
pm2 save

# 7. Verify
pm2 logs backend --lines 20
curl http://localhost:8080/test
```

## 📊 Verify Updates Are Live

### Check Backend Updates:
```bash
# 1. Test email logging
cd backend
node test-email.js
# Should see detailed logs with emojis

# 2. Check mentor Calendly links
curl http://localhost:8080/api/mentorship/mentors | grep calendlyLink

# 3. Check debug endpoint
curl http://localhost:8080/api/debug/auth-status
```

### Check Frontend Updates:
1. **Visit:** https://www.nextute.com
2. **Open DevTools** (F12)
3. **Check Console** for any errors
4. **Go to Mentorship page**
5. **Verify pricing:**
   - Pro Plan should show: ~~₹1,500~~ **₹1,000** 🎉 Early Bird Offer
   - Premium Plan should show: ~~₹1,999~~ **₹1,499** 🎉 Early Bird Offer
6. **Check Testimonials** - Should loop infinitely

### Check Database Updates:
```bash
cd backend
npx prisma studio
# Check mentors table for calendly_link column
# Verify Shubhomoy Dey has: https://calendly.com/nextuteedtech/one-one-mentorship-clone
```

## 🎯 Specific Update Checks

### 1. Testimonial Loop
**File:** `frontend/src/components/Testimonial.jsx`
**Check:** Swiper should have `loop={true}`
**Test:** Testimonials should loop infinitely on homepage

### 2. Email Improvements
**File:** `backend/utils/emailSender.js`
**Check:** Should have console.log with emojis (📧, 🔑, ✅)
**Test:** Run `node test-email.js` and check logs

### 3. Pricing Update
**Files:** 
- `frontend/src/pages/MentorshipComingSoon.jsx`
- `frontend/src/pages/MentorDetailPage.jsx`
**Check:** Should show strikethrough original prices
**Test:** Visit mentorship page and check pricing

### 4. Calendly Links
**File:** `backend/prisma/seed-mentors.js`
**Check:** Mentors should have calendlyLink field
**Test:** 
```bash
curl http://localhost:8080/api/mentorship/mentors | jq '.[].calendlyLink'
```

### 5. 403 Fix
**File:** `backend/controllers/studentAuthController.js`
**Check:** Better error messages with requiresVerification flag
**Test:** Try accessing profile without verification

## 📞 Still Not Working?

### Run Automated Troubleshooter:
```bash
chmod +x troubleshoot-deployment.sh
./troubleshoot-deployment.sh
```

### Run Force Update:
```bash
chmod +x force-update.sh
./force-update.sh
```

### Manual Step-by-Step:
1. SSH into VPS
2. Navigate to project: `cd /path/to/Nextute-main`
3. Check current state: `git status`
4. Pull latest: `git pull origin main`
5. Update backend: `cd backend && npm install && npx prisma db push && node prisma/seed-mentors.js`
6. Update frontend: `cd ../frontend && npm install && npm run build`
7. Restart: `pm2 restart all`
8. Check logs: `pm2 logs backend`
9. Test: `curl http://localhost:8080/test`
10. Visit website and verify changes

## 🔑 Key Files to Check

After deployment, these files should be updated:

**Backend:**
- `backend/utils/emailSender.js` - Has new logging
- `backend/controllers/studentAuthController.js` - Better error messages
- `backend/prisma/schema.prisma` - Has calendly_link field
- `backend/controllers/mentorshipController.js` - Uses Calendly links

**Frontend:**
- `frontend/src/components/Testimonial.jsx` - Has loop={true}
- `frontend/src/pages/MentorshipComingSoon.jsx` - New pricing
- `frontend/dist/index.html` - Recent build date

**Database:**
- `mentors` table has `calendly_link` column
- Shubhomoy Dey has correct Calendly link

---

**If all else fails, contact your VPS provider or check:**
- Server logs: `/var/log/`
- Nginx logs: `/var/log/nginx/`
- System logs: `journalctl -xe`
