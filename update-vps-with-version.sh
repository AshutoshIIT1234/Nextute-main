#!/bin/bash

echo "========================================="
echo "   Updating VPS with Version Bump"
echo "========================================="

# Generate new version
VERSION=$(date +"%Y%m%d-%H%M%S")
BUILD_TIME=$(date +"%Y-%m-%d %H:%M:%S")

echo "New Version: $VERSION"

# Update version.json
cat > frontend/version.json << EOF
{
  "version": "$VERSION",
  "buildTime": "$BUILD_TIME"
}
EOF

echo "✓ Version file updated"

# Build frontend
echo "Building frontend..."
cd frontend
npm run build

# Deploy
echo "Deploying to /var/www/nextute..."
sudo rm -rf /var/www/nextute/*
sudo cp -r dist/* /var/www/nextute/

# Update nginx config
echo "Updating nginx config..."
cd ..
sudo cp nginx-vps.conf /etc/nginx/sites-available/nextute
sudo nginx -t && sudo systemctl reload nginx

# Restart backend
echo "Restarting backend..."
pm2 restart nextute-backend

echo "========================================="
echo "   ✓ Deployment Complete!"
echo "   Version: $VERSION"
echo "   Clear browser cache and visit:"
echo "   https://nextute.com"
echo "========================================="
