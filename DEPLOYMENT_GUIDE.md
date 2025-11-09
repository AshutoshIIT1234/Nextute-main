# VPS Deployment Guide

## Recent Updates to Deploy

1. ✅ Testimonial infinite loop
2. ✅ Email OTP improvements with logging
3. ✅ 403 error fixes with better error messages
4. ✅ Calendly links for mentors (Shubhomoy Dey)
5. ✅ Mentorship pricing update (Early Bird Offer)
6. ✅ Debug endpoints for troubleshooting

## Pre-Deployment Checklist

- [ ] All changes committed to Git
- [ ] Environment variables configured on VPS
- [ ] Database migrations ready
- [ ] PM2 or process manager configured
- [ ] Backup current deployment

## Deployment Steps

### Option 1: Using Git (Recommended)

#### Step 1: Commit and Push Changes
```bash
# On local machine
git add .
git commit -m "feat: Add Early Bird pricing, Calendly links, email improvements, and bug fixes"
git push origin main
```

#### Step 2: SSH into VPS
```bash
ssh your-user@your-vps-ip
```

#### Step 3: Pull Latest Changes
```bash
cd /path/to/Nextute-main

# Backup current version
cp -r . ../Nextute-backup-$(date +%Y%m%d-%H%M%S)

# Pull latest changes
git pull origin main
```

#### Step 4: Update Backend
```bash
cd backend

# Install any new dependencies
npm install

# Update Prisma schema
npx prisma db push

# Run mentor seed to update Calendly links
node prisma/seed-mentors.js

# Restart backend
pm2 restart backend
# OR if using different process manager:
# systemctl restart nextute-backend
```

#### Step 5: Update Frontend
```bash
cd ../frontend

# Install any new dependencies
npm install

# Build production version
npm run build

# If using PM2 to serve:
pm2 restart frontend

# If using nginx, copy build files:
# sudo cp -r dist/* /var/www/nextute/
# sudo systemctl restart nginx
```

### Option 2: Manual File Upload (If Git not available)

#### Step 1: Create Deployment Package
```bash
# On local machine
# Exclude node_modules and build files
tar -czf nextute-update.tar.gz \
  --exclude='node_modules' \
  --exclude='frontend/dist' \
  --exclude='frontend/node_modules' \
  --exclude='backend/node_modules' \
  --exclude='.git' \
  .
```

#### Step 2: Upload to VPS
```bash
scp nextute-update.tar.gz your-user@your-vps-ip:/tmp/
```

#### Step 3: Extract and Deploy on VPS
```bash
ssh your-user@your-vps-ip

# Backup current version
cd /path/to/Nextute-main
sudo cp -r . ../Nextute-backup-$(date +%Y%m%d-%H%M%S)

# Extract new files
cd /path/to/Nextute-main
tar -xzf /tmp/nextute-update.tar.gz

# Install dependencies and build
cd backend
npm install
npx prisma db push
node prisma/seed-mentors.js

cd ../frontend
npm install
npm run build

# Restart services
pm2 restart all
```

## Database Updates

### Prisma Schema Changes
```bash
cd backend

# Push schema changes (adds calendly_link column)
npx prisma db push

# Update mentors with Calendly links
node prisma/seed-mentors.js
```

### Verify Database
```bash
# Check if calendly_link column exists
npx prisma studio
# Or use psql:
# psql $DATABASE_URL -c "SELECT name, calendly_link FROM mentors;"
```

## Environment Variables

Ensure these are set on VPS (in backend/.env):
```env
DATABASE_URL="your-postgres-url"
EMAIL_USER=nextuteedtech@gmail.com
EMAIL_PASS="your-app-password"
TOKEN_KEY=your-secret-key
FRONTEND_URL=https://www.nextute.com
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
NODE_ENV=production
PORT=8080
```

## Service Restart Commands

### Using PM2
```bash
# Restart all services
pm2 restart all

# Or restart individually
pm2 restart backend
pm2 restart frontend

# Check status
pm2 status
pm2 logs
```

### Using systemd
```bash
# Restart backend
sudo systemctl restart nextute-backend

# Restart frontend (if applicable)
sudo systemctl restart nextute-frontend

# Check status
sudo systemctl status nextute-backend
sudo journalctl -u nextute-backend -f
```

### Using Docker (if applicable)
```bash
# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Check logs
docker-compose logs -f
```

## Post-Deployment Verification

### 1. Check Backend Health
```bash
curl https://api.nextute.com/test
# Should return: {"status":true,"message":"Server is running!"}
```

### 2. Check Email Configuration
```bash
cd backend
node test-email.js
# Should send test email successfully
```

### 3. Check Database
```bash
# Verify mentors have Calendly links
curl https://api.nextute.com/api/mentorship/mentors
```

### 4. Test Frontend
- Visit: https://www.nextute.com
- Check testimonials are looping
- Check mentorship pricing shows Early Bird offers
- Test signup/login flow
- Verify OTP emails arrive

### 5. Check Logs
```bash
# PM2 logs
pm2 logs backend --lines 100

# System logs
sudo journalctl -u nextute-backend -n 100

# Nginx logs (if applicable)
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Rollback Plan (If Issues Occur)

### Quick Rollback
```bash
# Stop current services
pm2 stop all

# Restore backup
cd /path/to
rm -rf Nextute-main
mv Nextute-backup-YYYYMMDD-HHMMSS Nextute-main

# Restart services
cd Nextute-main
pm2 restart all
```

### Database Rollback
```bash
# If you need to remove calendly_link column
cd backend
# Create migration to remove column
npx prisma migrate dev --name remove_calendly_link
```

## Troubleshooting

### Backend Not Starting
```bash
# Check logs
pm2 logs backend

# Common issues:
# 1. Port already in use
sudo lsof -i :8080
sudo kill -9 <PID>

# 2. Database connection
# Verify DATABASE_URL in .env

# 3. Missing dependencies
cd backend
npm install
```

### Frontend Not Loading
```bash
# Check nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx

# Check if build exists
ls -la /var/www/nextute/

# Rebuild if needed
cd frontend
npm run build
sudo cp -r dist/* /var/www/nextute/
```

### Email Not Working
```bash
# Test email configuration
cd backend
node test-email.js

# Check environment variables
echo $EMAIL_USER
echo $EMAIL_PASS

# Check server logs for email errors
pm2 logs backend | grep "email"
```

## Performance Optimization

### After Deployment
```bash
# Clear PM2 logs
pm2 flush

# Optimize PM2
pm2 optimize

# Clear nginx cache (if applicable)
sudo rm -rf /var/cache/nginx/*
sudo systemctl restart nginx
```

## Monitoring

### Set Up Monitoring
```bash
# PM2 monitoring
pm2 monit

# Set up PM2 startup script
pm2 startup
pm2 save
```

### Health Checks
Add to crontab for automated health checks:
```bash
crontab -e

# Add this line:
*/5 * * * * curl -f https://api.nextute.com/test || echo "Backend down" | mail -s "Nextute Alert" admin@nextute.com
```

## Security Checklist

- [ ] SSL certificates valid and renewed
- [ ] Firewall rules configured
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured

## Quick Commands Reference

```bash
# Status check
pm2 status

# View logs
pm2 logs backend --lines 50

# Restart services
pm2 restart all

# Database push
cd backend && npx prisma db push

# Run seeds
cd backend && node prisma/seed-mentors.js

# Frontend build
cd frontend && npm run build

# Check processes
ps aux | grep node

# Check ports
sudo netstat -tulpn | grep :8080
```

## Support

If you encounter issues:
1. Check logs: `pm2 logs backend`
2. Verify environment variables
3. Test database connection
4. Check firewall rules
5. Review nginx configuration

---

**Last Updated:** $(date)
**Deployment Version:** Early Bird Pricing + Calendly Links + Email Improvements
