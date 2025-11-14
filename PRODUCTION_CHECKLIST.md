# Production Deployment Checklist

## 🔴 Critical Issues Fixed

### 1. Environment Variables
- ✅ Added `NODE_ENV=production` to backend/.env
- ✅ Added `JWT_SECRET` to backend/.env (was missing)
- ✅ Fixed frontend/.env to use production URLs
- ✅ Created `.env.production.example` template

### 2. Configuration Issues
- ✅ Frontend API URL now points to `https://nextute.com/api`
- ✅ Backend CORS configured for production domain
- ✅ Nginx configuration verified

---

## 🚀 Quick Deployment (Windows)

### Option 1: Run Automated Script
```cmd
deploy-production.bat
```

Then upload to VPS:
```cmd
scp -r Nextute-main root@72.60.218.219:/root/
```

### Option 2: Manual Steps
```cmd
cd frontend
npm install
npm run build

cd ..\backend
npm install
npx prisma generate
```

---

## 🐧 VPS Deployment (Linux)

### Step 1: Upload Code
```bash
# From your local machine
rsync -avz --exclude 'node_modules' --exclude '.git' Nextute-main/ root@72.60.218.219:/root/Nextute-main/
```

### Step 2: SSH to VPS
```bash
ssh root@72.60.218.219
```

### Step 3: Run Quick Fix Script
```bash
cd /root/Nextute-main
chmod +x fix-production-issues.sh
./fix-production-issues.sh
```

**OR** Run Full Deployment:
```bash
chmod +x deploy-production.sh
./deploy-production.sh
```

---

## 🔍 Troubleshooting

### If Website is Not Loading

1. **Run Diagnostics:**
```bash
cd /root/Nextute-main
chmod +x diagnose-production.sh
./diagnose-production.sh
```

2. **Check Backend Logs:**
```bash
pm2 logs nextute-backend --lines 50
```

3. **Check Nginx Logs:**
```bash
sudo tail -f /var/log/nginx/error.log
```

4. **Test Backend Directly:**
```bash
curl http://localhost:8080/test
```

### Common Issues & Fixes

#### Issue: "502 Bad Gateway"
**Cause:** Backend is not running
**Fix:**
```bash
cd /root/Nextute-main/backend
pm2 restart nextute-backend
pm2 logs nextute-backend
```

#### Issue: "CORS Error" in Browser Console
**Cause:** Frontend URL mismatch
**Fix:**
```bash
# Check backend/.env has correct FRONTEND_URL
nano /root/Nextute-main/backend/.env
# Should be: FRONTEND_URL=https://www.nextute.com

pm2 restart nextute-backend
```

#### Issue: "Cannot connect to database"
**Cause:** DATABASE_URL incorrect or database down
**Fix:**
```bash
cd /root/Nextute-main/backend
npx prisma db pull
# If this fails, check DATABASE_URL in .env
```

#### Issue: Frontend shows blank page
**Cause:** Build files not deployed
**Fix:**
```bash
cd /root/Nextute-main/frontend
npm run build
sudo cp -r dist/* /var/www/nextute/
sudo systemctl restart nginx
```

#### Issue: "Module not found" errors
**Cause:** Dependencies not installed
**Fix:**
```bash
cd /root/Nextute-main/backend
npm install
pm2 restart nextute-backend

cd /root/Nextute-main/frontend
npm install
npm run build
sudo cp -r dist/* /var/www/nextute/
```

---

## ✅ Production Verification

After deployment, verify these:

### 1. Backend Health Check
```bash
curl http://localhost:8080/test
# Should return: {"status":true,"message":"Server is running!"}
```

### 2. Frontend Accessible
```bash
curl -I https://nextute.com
# Should return: HTTP/1.1 200 OK
```

### 3. API Endpoint Test
```bash
curl https://nextute.com/api/test
# Should return: {"status":true,"message":"Server is running!"}
```

### 4. PM2 Status
```bash
pm2 status
# nextute-backend should show "online"
```

### 5. Nginx Status
```bash
sudo systemctl status nginx
# Should show "active (running)"
```

---

## 📋 Environment Variables Reference

### Backend (.env)
```env
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
TOKEN_KEY=your_token
EMAIL_USER=your_email
EMAIL_PASS=your_password
FRONTEND_URL=https://www.nextute.com
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Frontend (.env)
```env
VITE_API_URL=https://nextute.com/api
VITE_BACKEND_URL=https://nextute.com/api
VITE_BACKEND_BASE_URL=https://nextute.com
```

---

## 🔄 Regular Maintenance

### Update Code
```bash
# On VPS
cd /root/Nextute-main
git pull origin main
./fix-production-issues.sh
```

### View Logs
```bash
# Backend logs
pm2 logs nextute-backend

# Nginx access logs
sudo tail -f /var/log/nginx/nextute_access.log

# Nginx error logs
sudo tail -f /var/log/nginx/nextute_error.log
```

### Restart Services
```bash
# Restart backend only
pm2 restart nextute-backend

# Restart Nginx only
sudo systemctl restart nginx

# Restart both
pm2 restart nextute-backend && sudo systemctl restart nginx
```

### Check Resource Usage
```bash
# Memory and CPU
pm2 monit

# Disk space
df -h

# System resources
htop
```

---

## 🔐 Security Checklist

- ✅ HTTPS enabled (Let's Encrypt)
- ✅ Firewall configured (ports 80, 443, 22)
- ✅ CORS properly configured
- ✅ Helmet.js security headers
- ✅ Rate limiting enabled
- ✅ Environment variables secured
- ✅ Database connection encrypted (SSL)

---

## 📞 Emergency Contacts

**VPS Details:**
- IP: 72.60.218.219
- User: root
- SSH: `ssh root@72.60.218.219`

**Important Paths:**
- Project: `/root/Nextute-main`
- Frontend: `/var/www/nextute`
- Nginx Config: `/etc/nginx/sites-available/nextute`
- SSL Certs: `/etc/letsencrypt/live/nextute.com/`

**Quick Commands:**
```bash
# Full restart
pm2 restart nextute-backend && sudo systemctl restart nginx

# Emergency stop
pm2 stop nextute-backend

# Emergency start
cd /root/Nextute-main/backend && pm2 start server.js --name nextute-backend

# Check everything
./diagnose-production.sh
```

---

## 📈 Performance Monitoring

### Setup PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Enable PM2 Startup
```bash
pm2 startup
pm2 save
```

---

## 🎯 Next Steps

1. ✅ Fix environment variables (DONE)
2. ✅ Create deployment scripts (DONE)
3. ✅ Create diagnostic tools (DONE)
4. 🔄 Deploy to production (RUN: `./fix-production-issues.sh`)
5. ✅ Verify all endpoints working
6. 📊 Setup monitoring (optional)
7. 🔄 Setup automated backups (recommended)

---

**Last Updated:** 2025-11-15
