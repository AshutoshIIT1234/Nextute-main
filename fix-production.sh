#!/bin/bash
# Complete Production Fix Script

echo "=== FIXING PRODUCTION SITE ==="

# 1. Fix HTTPS (SSL Certificate)
echo "Step 1: Reinstalling SSL Certificate..."
sudo certbot --nginx -d nextute.com -d www.nextute.com --reinstall --non-interactive

# 2. Pull latest code
echo "Step 2: Pulling latest code..."
cd /root/Nextute-main
git stash
git pull origin main

# 3. Fix backend
echo "Step 3: Fixing backend..."
cd backend
rm -rf node_modules package-lock.json
npm install
pm2 restart nextute-backend
sleep 3
pm2 status

# 4. Rebuild frontend with correct config
echo "Step 4: Rebuilding frontend..."
cd ../frontend
cat > .env << 'EOF'
VITE_API_URL=/api
EOF

rm -rf dist node_modules/.vite
npm install
npm run build

# 5. Deploy frontend
echo "Step 5: Deploying frontend..."
sudo rm -rf /var/www/nextute/*
sudo cp -r dist/* /var/www/nextute/
sudo chown -R www-data:www-data /var/www/nextute
sudo chmod -R 755 /var/www/nextute

# 6. Update nginx config
echo "Step 6: Updating nginx..."
cd ..
sudo cp nginx-vps.conf /etc/nginx/sites-available/nextute
sudo nginx -t && sudo systemctl restart nginx

# 7. Verify
echo "=== VERIFICATION ==="
echo "Backend status:"
pm2 status
echo ""
echo "Nginx status:"
sudo systemctl status nginx --no-pager
echo ""
echo "Files deployed:"
ls -la /var/www/nextute/ | head -10
echo ""
echo "=== DONE ==="
echo "Visit: https://nextute.com"
echo "Careers page: https://nextute.com/careers"
