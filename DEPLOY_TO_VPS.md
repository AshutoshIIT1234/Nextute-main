# Quick VPS Deployment Steps

## 🚀 Deploy Updates to VPS

### Method 1: Using Git (Fastest)

```bash
# 1. SSH into your VPS
ssh your-user@your-vps-ip

# 2. Navigate to project directory
cd /path/to/Nextute-main

# 3. Create backup
cp -r . ../Nextute-backup-$(date +%Y%m%d-%H%M%S)

# 4. Pull latest changes
git pull origin main

# 5. Update Backend
cd backend
npm install
npx prisma db push
node prisma/seed-mentors.js

# 6. Update Frontend
cd ../frontend
npm install
npm run build

# 7. Restart services
pm2 restart all

# 8. Check status
pm2 status
pm2 logs backend --lines 20
```

### Method 2: Using Deployment Script

```bash
# 1. Make script executable (first time only)
chmod +x deploy.sh

# 2. Run deployment script
./deploy.sh

# 3. Follow the prompts and verify
```

### Method 3: Manual Upload (No Git)

**On Local Machine:**
```bash
# 1. Commit changes
git add .
git commit -m "Update pricing and features"

# 2. Create archive (excluding node_modules)
tar --exclude='node_modules' \
    --exclude='frontend/dist' \
    --exclude='.git' \
    -czf nextute-update.tar.gz .

# 3. Upload to VPS
scp nextute-update.tar.gz user@vps-ip:/tmp/
```

**On VPS:**
```bash
# 1. SSH into VPS
ssh user@vps-ip

# 2. Backup current version
cd /path/to/Nextute-main
sudo cp -r . ../Nextute-backup-$(date +%Y%m%d)

# 3. Extract update
tar -xzf /tmp/nextute-update.tar.gz

# 4. Install & Build Backend
cd backend
npm install
npx prisma db push
node prisma/seed-mentors.js

# 5. Install & Build Frontend
cd ../frontend
npm install
npm run build

# 6. Restart
pm2 restart all
```

## ✅ Verification Checklist

After deployment, verify:

```bash
# 1. Backend health
curl http://localhost:8080/test

# 2. Check services
pm2 status

# 3. View logs
pm2 logs backend --lines 50

# 4. Test email
cd backend && node test-email.js

# 5. Check mentors API
curl http://localhost:8080/api/mentorship/mentors | jq
```

## 🌐 Test on Website

1. **Visit:** https://www.nextute.com
2. **Check Testimonials:** Should loop infinitely
3. **Check Mentorship Page:** 
   - Pro Plan: ₹1,500 → ₹1,000 (Early Bird)
   - Premium Plan: ₹1,999 → ₹1,499 (Early Bird)
4. **Test Signup:** OTP should arrive in email
5. **Test Login:** Should work without 403 errors

## 🔄 Rollback (If Needed)

```bash
# Stop services
pm2 stop all

# Restore backup
cd /path/to
rm -rf Nextute-main
mv Nextute-backup-YYYYMMDD Nextute-main

# Restart
cd Nextute-main
pm2 restart all
```

## 📊 Monitor After Deployment

```bash
# Real-time logs
pm2 logs backend

# Monitor resources
pm2 monit

# Check errors
pm2 logs backend --err

# Restart if needed
pm2 restart backend
```

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check what's using port 8080
sudo lsof -i :8080

# Kill process if needed
sudo kill -9 <PID>

# Check logs
pm2 logs backend --lines 100
```

### Frontend not updating
```bash
# Rebuild
cd frontend
npm run build

# If using nginx, copy files
sudo cp -r dist/* /var/www/nextute/
sudo systemctl restart nginx
```

### Database issues
```bash
# Check connection
cd backend
npx prisma studio

# Reset if needed (CAUTION: loses data)
npx prisma migrate reset
```

## 📝 What's Being Deployed

✅ **Testimonial Loop** - Infinite carousel
✅ **Email Improvements** - Better OTP logging
✅ **403 Fix** - Better error messages
✅ **Calendly Links** - Shubhomoy: one-one-mentorship-clone
✅ **Pricing Update:**
   - Pro: ₹1,000 (was ₹1,500)
   - Premium: ₹1,499 (was ₹1,999)
✅ **Debug Endpoints** - /api/debug/auth-status

## 🔐 Security Check

Before deploying, ensure:
- [ ] .env file has correct values
- [ ] DATABASE_URL is correct
- [ ] EMAIL credentials are valid
- [ ] RAZORPAY keys are production keys
- [ ] FRONTEND_URL is https://www.nextute.com
- [ ] NODE_ENV=production

## 📞 Support

If deployment fails:
1. Check logs: `pm2 logs backend`
2. Verify .env variables
3. Test database connection
4. Rollback if necessary
5. Contact dev team

---

**Quick Command Reference:**
```bash
pm2 restart all          # Restart all services
pm2 logs backend         # View backend logs
pm2 status              # Check service status
pm2 monit               # Monitor resources
npx prisma studio       # Open database GUI
```
