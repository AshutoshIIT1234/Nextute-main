# Nextute VPS Deployment Guide

## Prerequisites
- VPS with Ubuntu/Debian (root@72.60.218.219)
- SSH access to the server

## Step 1: Upload Code to VPS

From your local machine, upload the project to your VPS:

```bash
# Option 1: Using SCP
scp -r Nextute-main root@72.60.218.219:/root/

# Option 2: Using rsync (recommended - faster for updates)
rsync -avz --exclude 'node_modules' --exclude '.git' Nextute-main/ root@72.60.218.219:/root/Nextute-main/
```

## Step 2: SSH into Your VPS

```bash
ssh root@72.60.218.219
```

## Step 3: Run Deployment Script

```bash
cd /root/Nextute-main
chmod +x deploy.sh
./deploy.sh
```

The script will:
- Install Node.js, PM2, and Nginx
- Install backend dependencies
- Run Prisma migrations
- Start backend with PM2
- Build and deploy frontend
- Configure Nginx as reverse proxy

## Step 4: Update Environment Variables

### Backend Environment
```bash
nano /root/Nextute-main/backend/.env
```

Update `FRONTEND_URL` to your domain or IP:
```
FRONTEND_URL=http://72.60.218.219
```

### Frontend Environment
```bash
nano /root/Nextute-main/frontend/.env
```

Update backend URL:
```
VITE_BACKEND_BASE_URL=http://72.60.218.219/api
```

After updating, rebuild frontend:
```bash
cd /root/Nextute-main/frontend
npm run build
sudo cp -r dist/* /var/www/nextute/
```

And restart backend:
```bash
pm2 restart nextute-backend
```

## Step 5: Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

## Useful Commands

### Backend Management
```bash
pm2 status                    # Check status
pm2 logs nextute-backend      # View logs
pm2 restart nextute-backend   # Restart backend
pm2 stop nextute-backend      # Stop backend
pm2 delete nextute-backend    # Remove from PM2
```

### Nginx Management
```bash
sudo systemctl status nginx   # Check status
sudo systemctl restart nginx  # Restart Nginx
sudo nginx -t                 # Test configuration
sudo tail -f /var/log/nginx/error.log  # View error logs
```

### Update Deployment
```bash
# From local machine, upload changes
rsync -avz --exclude 'node_modules' --exclude '.git' Nextute-main/ root@72.60.218.219:/root/Nextute-main/

# On VPS, update backend
cd /root/Nextute-main/backend
npm install
pm2 restart nextute-backend

# Update frontend
cd /root/Nextute-main/frontend
npm install
npm run build
sudo cp -r dist/* /var/www/nextute/
```

## Optional: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
sudo certbot renew --dry-run
```

## Troubleshooting

### Backend not starting
```bash
pm2 logs nextute-backend
# Check for errors in the logs
```

### Frontend not loading
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Database connection issues
```bash
# Check if DATABASE_URL is correct in backend/.env
cd /root/Nextute-main/backend
npx prisma db pull  # Test connection
```

## Access Your Application

- Frontend: http://72.60.218.219
- Backend API: http://72.60.218.219/api

## Notes

- Backend runs on port 8080 (proxied through Nginx)
- Frontend is served by Nginx on port 80
- PM2 ensures backend auto-restarts on crashes
- PM2 is configured to start on system boot
