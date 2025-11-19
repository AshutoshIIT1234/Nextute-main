# Backend 404 Fix Guide

## Problem
The `/api/institutes/all-institutes` endpoint returns 404 on VPS.

## Possible Causes
1. Backend process not running on port 8080
2. PM2 process crashed or not started
3. Environment variables not loaded correctly
4. Nginx not proxying correctly to backend

## Quick Fix (Run on VPS)

### Option 1: Use the automated fix script
```bash
cd /root/Nextute-main
bash fix-backend-404.sh
```

### Option 2: Manual steps

1. **Check if backend is running:**
```bash
pm2 list
# Look for 'nextute-backend' process
```

2. **Check what's on port 8080:**
```bash
lsof -i :8080
# OR
netstat -tulpn | grep :8080
```

3. **Restart backend:**
```bash
cd /root/Nextute-main/backend
pm2 stop nextute-backend
pm2 delete nextute-backend
pm2 start server.js --name nextute-backend
pm2 save
```

4. **Test backend directly:**
```bash
curl http://localhost:8080/test
curl http://localhost:8080/api/institutes/all-institutes
```

5. **Check backend logs:**
```bash
pm2 logs nextute-backend --lines 50
```

6. **Restart nginx:**
```bash
sudo systemctl restart nginx
```

## Verification

After fixing, test these URLs:
- http://localhost:8080/test (should return: {"status":true,"message":"Server is running!"})
- http://localhost:8080/api/institutes/all-institutes (should return institute data)
- https://www.nextute.com/api/institutes/all-institutes (should work from browser)

## Common Issues

### Backend not starting
- Check `.env` file exists in `/root/Nextute-main/backend/`
- Verify DATABASE_URL is correct
- Check for port conflicts: `lsof -i :8080`

### PM2 process exists but not responding
- Delete and recreate: `pm2 delete nextute-backend && pm2 start server.js --name nextute-backend`
- Check logs: `pm2 logs nextute-backend`

### Nginx not proxying
- Test nginx config: `sudo nginx -t`
- Restart nginx: `sudo systemctl restart nginx`
- Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`
