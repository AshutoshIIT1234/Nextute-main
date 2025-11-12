# 🚀 Deploy to VPS - Quick Guide

## ✅ What's Being Deployed

This deployment includes:
- ✨ **Automatic Cache Busting** - Users get notified of updates automatically
- 🔔 Update notifications with one-click refresh
- 📋 Smart cache headers (no more manual cache clearing!)
- ⚡ All your latest features and fixes

---

## 🎯 Option 1: Automated Deployment (Recommended)

### From Windows (Double-click):
```
deploy-to-vps.bat
```

This will:
1. Commit your changes
2. Push to GitHub
3. Copy deployment script to VPS
4. Execute deployment automatically

---

## 🔧 Option 2: Manual Deployment

### Step 1: Push Changes to GitHub
```bash
git add .
git commit -m "Deploy: Update with cache busting"
git push origin main
```

### Step 2: SSH to VPS
```bash
ssh root@72.60.218.219
```

### Step 3: Deploy on VPS
```bash
cd /root/Nextute-main
git pull origin main
chmod +x deploy-with-cache-busting.sh
./deploy-with-cache-busting.sh
```

---

## 📊 Verify Deployment

After deployment, check:

1. **Website is live:**
   ```
   https://www.nextute.com
   ```

2. **Version file exists:**
   ```
   https://www.nextute.com/version.json
   ```
   Should show: `{"version":"2025-01-XX-XX-XX-XX"}`

3. **Backend is running:**
   ```bash
   ssh root@72.60.218.219
   pm2 status
   pm2 logs backend --lines 50
   ```

4. **Cache busting works:**
   - Open website in browser
   - Wait 5 minutes
   - You should see "New Update Available!" notification
   - Click "Refresh Now" to see latest version

---

## 🔍 Check Cache Headers

Open browser DevTools (F12) → Network tab → Reload page

Check these files:
- **index.html**: Should have `Cache-Control: no-cache, no-store, must-revalidate`
- **main.js**: Should have `Cache-Control: public, max-age=3600, must-revalidate`
- **version.json**: Should have `Cache-Control: no-cache, must-revalidate`

---

## 🐛 Troubleshooting

### If deployment fails:

1. **Check Git credentials:**
   ```bash
   git config user.name "AshutoshIIT1234"
   git remote -v
   ```

2. **Check SSH connection:**
   ```bash
   ssh root@72.60.218.219 "echo Connection successful"
   ```

3. **Manual restart on VPS:**
   ```bash
   ssh root@72.60.218.219
   cd /root/Nextute-main
   pm2 restart all
   pm2 logs --lines 100
   ```

### If users don't see updates:

1. **Check version.json is accessible:**
   ```
   curl https://www.nextute.com/version.json
   ```

2. **Check browser console for errors:**
   - Open DevTools (F12)
   - Look for version checker logs
   - Should see: "Current version: ..." and "Server version: ..."

3. **Force cache clear (one-time):**
   - Press Ctrl+Shift+R (hard refresh)
   - Or clear browser cache manually

---

## 📝 Rollback (If Needed)

If something goes wrong:

```bash
ssh root@72.60.218.219
cd /root
ls -la | grep Nextute-backup
# Find the latest backup
rm -rf Nextute-main
mv Nextute-backup-YYYYMMDD-HHMMSS Nextute-main
cd Nextute-main
pm2 restart all
```

---

## 🎉 Success Indicators

After successful deployment:
- ✅ Website loads at https://www.nextute.com
- ✅ No console errors in browser DevTools
- ✅ PM2 shows all services running
- ✅ version.json is accessible
- ✅ Users see update notification within 5 minutes
- ✅ Backend logs show no errors

---

## 📞 Quick Commands Reference

```bash
# Check PM2 status
ssh root@72.60.218.219 "pm2 status"

# View backend logs
ssh root@72.60.218.219 "pm2 logs backend --lines 50"

# Restart services
ssh root@72.60.218.219 "pm2 restart all"

# Check version file
curl https://www.nextute.com/version.json

# Test backend health
curl https://www.nextute.com/api/test
```

---

## 🚀 Ready to Deploy?

Run this command:
```bash
deploy-to-vps.bat
```

Or follow the manual steps above!

**Your users will automatically see the new version within 5 minutes!** 🎊
