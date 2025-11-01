#!/bin/bash

# Deployment script for Nextute on VPS
# Run this script on your VPS after uploading the code

set -e

echo "🚀 Starting Nextute deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not installed)
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Install PM2 globally (if not installed)
if ! command -v pm2 &> /dev/null; then
    echo "📥 Installing PM2..."
    sudo npm install -g pm2
fi

# Install Nginx (if not installed)
if ! command -v nginx &> /dev/null; then
    echo "📥 Installing Nginx..."
    sudo apt install -y nginx
fi

# Navigate to project directory
cd /root/Nextute-main

# Backend setup
echo "🔧 Setting up backend..."
cd backend
npm install
npx prisma generate
npx prisma migrate deploy

# Start backend with PM2
echo "🚀 Starting backend..."
pm2 delete nextute-backend 2>/dev/null || true
pm2 start server.js --name nextute-backend
pm2 save

# Frontend setup
echo "🔧 Building frontend..."
cd ../frontend
npm install
npm run build

# Copy frontend build to Nginx directory
echo "📋 Deploying frontend..."
sudo rm -rf /var/www/nextute
sudo mkdir -p /var/www/nextute
sudo cp -r dist/* /var/www/nextute/

# Setup Nginx configuration
echo "⚙️ Configuring Nginx..."
sudo tee /etc/nginx/sites-available/nextute > /dev/null <<'EOF'
server {
    listen 80;
    server_name 72.60.218.219;

    # Frontend
    location / {
        root /var/www/nextute;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/nextute /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
echo "🔄 Reloading Nginx..."
sudo nginx -t
sudo systemctl restart nginx

# Setup PM2 to start on boot
pm2 startup systemd -u root --hp /root
pm2 save

echo "✅ Deployment complete!"
echo "🌐 Your app should be accessible at http://72.60.218.219"
echo ""
echo "Useful commands:"
echo "  pm2 status          - Check backend status"
echo "  pm2 logs            - View backend logs"
echo "  pm2 restart all     - Restart backend"
echo "  sudo systemctl status nginx - Check Nginx status"
