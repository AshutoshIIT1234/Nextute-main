# Hostinger Deployment Guide

## Step 1: Fix Git Authentication & Push to GitHub

### Option A: Using GitHub Desktop (Easiest)
1. Open GitHub Desktop
2. Select your Nextute-main repository
3. It will show the changed files
4. Add commit message: "Fix: Remove broken Cloudinary logo from emails"
5. Click "Commit to main"
6. Click "Push origin"

### Option B: Using Git Command Line
```bash
# Navigate to your project
cd M:\one\Nextute-main

# Check current remote
git remote -v

# If you need to re-authenticate, use GitHub CLI or Personal Access Token
# For HTTPS with token:
git remote set-url origin https://YOUR_GITHUB_TOKEN@github.com/AshutoshIIT1234/Nextute-main.git

# Or use SSH (recommended):
git remote set-url origin git@github.com:AshutoshIIT1234/Nextute-main.git

# Stage all changes
git add .

# Commit
git commit -m "Fix: Remove broken Cloudinary logo from emails (404 error)"

# Push
git push origin main
```

### Option C: Create Personal Access Token
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` permissions
3. Copy the token
4. Use it in the remote URL:
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/AshutoshIIT1234/Nextute-main.git
git push origin main
```

---

## Step 2: Deploy to Hostinger VPS

### Method 1: SSH + Git Pull (Recommended)

#### Connect to Hostinger VPS
```bash
ssh root@72.60.218.219
# Or if you have a different user:
ssh your_username@your_hostinger_ip
```

#### Pull Latest Changes
```bash
cd /root/Nextute-main
# or wherever your project is located

# Pull from GitHub
git pull origin main

# Restart backend with PM2
pm2 restart nextute-backend

# Check logs
pm2 logs nextute-backend --lines 50
```

---

### Method 2: Manual File Upload via SFTP

If Git is not set up on Hostinger, use SFTP:

#### Using FileZilla or WinSCP:
1. Connect to: `72.60.218.219`
2. Username: `root` (or your Hostinger username)
3. Password: Your VPS password
4. Protocol: SFTP (SSH File Transfer Protocol)
5. Port: 22

#### Upload these files:
- `backend/utils/emailSender.js` → `/root/Nextute-main/backend/utils/`
- `backend/utils/sendUpdateEmail.js` → `/root/Nextute-main/backend/utils/`

#### Then SSH and restart:
```bash
ssh root@72.60.218.219
pm2 restart nextute-backend
```

---

### Method 3: Using SCP from Windows

```powershell
# Copy files directly from Windows to Hostinger
scp M:\one\Nextute-main\backend\utils\emailSender.js root@72.60.218.219:/root/Nextute-main/backend/utils/
scp M:\one\Nextute-main\backend\utils\sendUpdateEmail.js root@72.60.218.219:/root/Nextute-main/backend/utils/

# Then SSH and restart
ssh root@72.60.218.219
pm2 restart nextute-backend
pm2 logs nextute-backend
```

---

## Step 3: Verify Deployment

### Check Backend Status
```bash
pm2 status
pm2 logs nextute-backend --lines 100
```

### Test Email Functionality
1. Go to your website
2. Try to register a new user
3. Check if verification email is sent without 404 errors
4. Check PM2 logs for "✅ Email sent successfully"

---

## Common Hostinger VPS Commands

```bash
# Check PM2 processes
pm2 list

# Restart specific app
pm2 restart nextute-backend

# View logs
pm2 logs nextute-backend

# Stop app
pm2 stop nextute-backend

# Start app
pm2 start nextute-backend

# Check Nginx status
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

---

## Troubleshooting

### If PM2 is not installed:
```bash
npm install -g pm2
```

### If backend won't start:
```bash
cd /root/Nextute-main/backend
npm install
pm2 start server.js --name nextute-backend
```

### If you get permission errors:
```bash
sudo chown -R $USER:$USER /root/Nextute-main
```

### Check if port 8080 is in use:
```bash
netstat -tulpn | grep 8080
```

---

## Quick Reference

**Your VPS IP:** 72.60.218.219  
**Backend Port:** 8080  
**PM2 App Name:** nextute-backend  
**Project Path:** /root/Nextute-main

**After any code change:**
1. Push to GitHub
2. SSH to Hostinger
3. `git pull origin main`
4. `pm2 restart nextute-backend`
5. Check logs: `pm2 logs`
