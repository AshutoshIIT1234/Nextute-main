# Deployment Options - Choose Your Method

## 🚀 Quick Reference

| Method | What It Does | When to Use |
|--------|-------------|-------------|
| **DEPLOY-FULL.bat** | Backend + Frontend (from Windows) | Best for complete updates |
| **RUN-BACKEND-FIX.bat** | Backend only (bcrypt fix) | Quick backend fix |
| **complete-vps-update.sh** | Everything via git pull | When code is committed to git |

---

## Option 1: Complete Deployment (Recommended)

**Run from Windows:**
```batch
DEPLOY-FULL.bat
```

**What it does:**
1. ✅ Uploads backend bcrypt fixes
2. ✅ Rebuilds frontend on VPS
3. ✅ Deploys to /var/www/nextute
4. ✅ Restarts backend (PM2)
5. ✅ Restarts nginx

**Time:** ~5-10 minutes

---

## Option 2: Backend Only Fix

**Run from Windows:**
```batch
RUN-BACKEND-FIX.bat
```

**What it does:**
1. ✅ Fixes bcrypt import errors
2. ✅ Restarts backend
3. ✅ Tests endpoints

**Time:** ~1 minute

---

## Option 3: Git-Based Deployment

**Prerequisites:**
- All changes committed to git
- Git repository accessible from VPS

**Run from Windows:**
```batch
ssh root@72.60.218.219
cd /root/Nextute-main
bash complete-vps-update.sh
```

**What it does:**
1. ✅ Pulls latest code from git
2. ✅ Fixes bcrypt imports
3. ✅ Updates backend
4. ✅ Rebuilds frontend
5. ✅ Deploys everything
6. ✅ Restarts all services

**Time:** ~10-15 minutes

---

## Option 4: Manual Deployment

**For advanced users who want full control:**

### Backend:
```bash
ssh root@72.60.218.219
cd /root/Nextute-main/backend
pm2 restart nextute-backend
```

### Frontend:
```bash
ssh root@72.60.218.219
cd /root/Nextute-main/frontend
npm run build
sudo cp -r dist/* /var/www/nextute/
sudo systemctl restart nginx
```

---

## 🎯 Recommended Workflow

### For Your Current Situation (Backend 404 Error):

1. **First, fix the backend:**
   ```batch
   RUN-BACKEND-FIX.bat
   ```

2. **Then, update frontend:**
   ```batch
   DEPLOY-FULL.bat
   ```

### For Future Updates:

1. **Commit your changes to git**
2. **Run complete update:**
   ```bash
   ssh root@72.60.218.219
   cd /root/Nextute-main
   bash complete-vps-update.sh
   ```

---

## 🔍 Verification Steps

After any deployment:

1. **Check backend:**
   ```bash
   curl https://www.nextute.com/api/institutes/all-institutes
   ```

2. **Check frontend:**
   - Visit: https://www.nextute.com
   - Press: Ctrl+Shift+R (hard refresh)

3. **Check logs:**
   ```bash
   ssh root@72.60.218.219
   pm2 logs nextute-backend --lines 50
   ```

---

## 🆘 Troubleshooting

### Backend not responding:
```bash
ssh root@72.60.218.219
pm2 restart nextute-backend
pm2 logs nextute-backend
```

### Frontend not updating:
```bash
# Clear browser cache: Ctrl+Shift+Delete
# Or test in incognito: Ctrl+Shift+N
```

### Still having issues:
```bash
ssh root@72.60.218.219
cd /root/Nextute-main
bash deploy-full-update.sh
```

---

## 📝 Files Created

- ✅ **DEPLOY-FULL.bat** - Complete deployment from Windows
- ✅ **RUN-BACKEND-FIX.bat** - Quick backend fix
- ✅ **deploy-full-update.sh** - Complete VPS update script
- ✅ **complete-vps-update.sh** - Updated with bcrypt fix
- ✅ **BACKEND_FIX_SUMMARY.md** - Detailed backend fix info
