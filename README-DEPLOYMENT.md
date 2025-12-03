# 🚀 Nextute Deployment Guide

## ⚡ Quick Deploy (Recommended)

**Just run this:**
```batch
DEPLOY-NOW.bat
```

This single command will:
- ✅ Fix all backend issues (bcrypt errors)
- ✅ Rebuild frontend with latest changes
- ✅ Deploy to production VPS
- ✅ Restart all services
- ✅ Verify everything works

**Time:** 5-10 minutes

---

## 🔍 What Was Wrong

### Backend Error
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'bcrypt'
```

### Root Cause
Two files were importing `bcrypt` but `package.json` only has `bcryptjs`:
- `backend/prisma/seed.js`
- `backend/controllers/forgotAndResetPasswordController.js`

### Fix Applied
Changed all imports from `bcrypt` to `bcryptjs` ✅

---

## 📁 Deployment Scripts

### Complete Deployment
| Script | Description | Time |
|--------|-------------|------|
| **DEPLOY-NOW.bat** | 🌟 Everything in one click | 5-10 min |
| **DEPLOY-FULL.bat** | Backend + Frontend | 5-10 min |
| **deploy-full-update.sh** | VPS-side complete update | 10-15 min |

### Quick Fixes
| Script | Description | Time |
|--------|-------------|------|
| **RUN-BACKEND-FIX.bat** | Backend only (bcrypt fix) | 1 min |
| **fix-backend-complete.sh** | VPS backend fix | 2 min |

### Git-Based
| Script | Description | Time |
|--------|-------------|------|
| **complete-vps-update.sh** | Pull from git + deploy | 10-15 min |

---

## 🎯 Step-by-Step Instructions

### For Your Current Situation:

1. **Open Command Prompt in this folder**
   - Right-click in folder → "Open in Terminal"

2. **Run the deployment:**
   ```batch
   DEPLOY-NOW.bat
   ```

3. **Wait for completion** (5-10 minutes)

4. **Test your site:**
   - Visit: https://www.nextute.com
   - Test API: https://www.nextute.com/api/institutes/all-institutes
   - Press `Ctrl+Shift+R` to hard refresh

5. **Done!** ✅

---

## 🧪 Verification

### Check Backend
```bash
curl https://www.nextute.com/api/institutes/all-institutes
```
Should return JSON with institute data (not 404)

### Check Frontend
1. Visit https://www.nextute.com
2. Open DevTools (F12)
3. Check Console for errors
4. Hard refresh: `Ctrl+Shift+R`

### Check Logs (SSH)
```bash
ssh root@72.60.218.219
pm2 logs nextute-backend --lines 50
```
Should NOT see "Cannot find package 'bcrypt'" errors

---

## 🔧 Manual Deployment (Advanced)

If you prefer manual control:

### 1. Fix Backend
```bash
ssh root@72.60.218.219
cd /root/Nextute-main/backend
sed -i 's/from "bcrypt"/from "bcryptjs"/g' prisma/seed.js
sed -i 's/from "bcrypt"/from "bcryptjs"/g' controllers/forgotAndResetPasswordController.js
pm2 restart nextute-backend
```

### 2. Update Frontend
```bash
cd /root/Nextute-main/frontend
npm install
npm run build
sudo cp -r dist/* /var/www/nextute/
sudo systemctl restart nginx
```

---

## 🆘 Troubleshooting

### Backend Still Not Working
```bash
ssh root@72.60.218.219
pm2 logs nextute-backend --lines 100
pm2 restart nextute-backend
```

### Frontend Not Updating
1. Clear browser cache: `Ctrl+Shift+Delete`
2. Hard refresh: `Ctrl+Shift+R`
3. Try incognito mode: `Ctrl+Shift+N`

### Complete Reset
```bash
ssh root@72.60.218.219
cd /root/Nextute-main
bash deploy-full-update.sh
```

---

## 📊 VPS Information

- **IP:** 72.60.218.219
- **User:** root
- **Backend Port:** 8080
- **Frontend Path:** /var/www/nextute
- **PM2 Process:** nextute-backend

---

## ✅ Success Checklist

After deployment, verify:

- [ ] Backend responds: `curl http://localhost:8080/test`
- [ ] API works: `https://www.nextute.com/api/institutes/all-institutes`
- [ ] Frontend loads: `https://www.nextute.com`
- [ ] No console errors in browser DevTools
- [ ] PM2 shows backend running: `pm2 list`
- [ ] No bcrypt errors in logs: `pm2 logs nextute-backend`

---

## 🎉 You're All Set!

Your deployment scripts are ready. Just run:

```batch
DEPLOY-NOW.bat
```

And you're done! 🚀
