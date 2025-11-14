# VPS Deployment Commands

## Quick Deployment (Copy & Paste)

SSH into your VPS and run these commands:

```bash
# Navigate to project directory
cd /root/Nextute-main

# Pull latest changes
git pull origin main

# Install frontend dependencies (if package.json changed)
cd frontend
npm install

# Build frontend for production
npm run build

# Install backend dependencies (if package.json changed)
cd ../backend
npm install

# Restart backend with PM2
pm2 restart all

# Check status
pm2 status
pm2 logs --lines 50
```

## What Was Optimized

### Files Removed (49+)
- ✅ 11 unused components (Card3D, GlowButton, Test, etc.)
- ✅ 3 unused utilities (performanceOptimizer, securityHeaders, etc.)
- ✅ 33+ redundant documentation files
- ✅ 2 backend files (duplicate controller, logs)

### Dependencies Removed (4)
- ✅ react-parallax-tilt (not used)
- ✅ rc-slider (not used)
- ✅ bcrypt (kept bcryptjs)
- ✅ crypto (built-in)

### Code Fixes
- ✅ Fixed unused parameters in server.js
- ✅ Fixed deprecated vite.config.js property
- ✅ Changed bcrypt to bcryptjs
- ✅ Removed Test component usage
- ✅ Fixed email sender function signature
- ✅ Created lightweight animations3D.js

### UI Improvements
- ✅ Fixed search bar styling (mobile & desktop)
- ✅ Fixed navbar dropdown z-index overlap
- ✅ Updated careers page theme to teal/emerald
- ✅ Improved responsive design

## Expected Results

After deployment:
- **15-20% smaller bundle size**
- **Faster page loads**
- **Cleaner codebase**
- **Better performance**
- **Consistent theme**

## Verification Steps

After deployment, verify:

1. **Frontend loads correctly**
   ```bash
   curl https://nextute.com
   ```

2. **Backend is running**
   ```bash
   pm2 status
   curl http://localhost:8080/test
   ```

3. **Check logs for errors**
   ```bash
   pm2 logs backend --lines 100
   ```

4. **Test key features**
   - Homepage loads
   - Search works
   - Institute pages load
   - Careers page displays correctly
   - Chatbot works

## Rollback (If Needed)

If something goes wrong:

```bash
cd /root/Nextute-main
git log --oneline -5
git reset --hard <previous-commit-hash>
cd frontend && npm run build
pm2 restart all
```

## Troubleshooting

### Frontend not updating?
```bash
# Clear nginx cache
sudo systemctl reload nginx

# Force rebuild
cd /root/Nextute-main/frontend
rm -rf dist node_modules/.vite
npm run build
```

### Backend errors?
```bash
# Check logs
pm2 logs backend --lines 100

# Restart
pm2 restart backend

# Check environment variables
cd /root/Nextute-main/backend
cat .env
```

### Database issues?
```bash
cd /root/Nextute-main/backend
npx prisma generate
npx prisma migrate deploy
```

## Performance Monitoring

After deployment, monitor:

```bash
# CPU and Memory
pm2 monit

# Logs
pm2 logs --lines 50

# Nginx access logs
tail -f /var/log/nginx/nextute_access.log
```

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs`
2. Check Nginx logs: `tail -f /var/log/nginx/nextute_error.log`
3. Verify environment variables are set correctly
4. Ensure database is accessible

---

**Status:** Ready for deployment ✅
**Estimated downtime:** < 2 minutes
**Risk level:** Low (all changes tested locally)
