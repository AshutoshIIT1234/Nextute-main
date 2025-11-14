#!/bin/bash

echo "========================================"
echo "Nextute Production Deployment Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're on the VPS
if [ -f "/etc/nginx/sites-available/nextute" ]; then
    echo -e "${GREEN}Detected VPS environment${NC}"
    ON_VPS=true
else
    echo -e "${YELLOW}Running in local/build environment${NC}"
    ON_VPS=false
fi

# Step 1: Backend Setup
echo ""
echo "Step 1: Setting up Backend..."
cd backend || exit 1

echo "Installing backend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Backend npm install failed!${NC}"
    exit 1
fi

echo "Running Prisma migrations..."
npx prisma generate
npx prisma migrate deploy
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Warning: Prisma migration had issues (may be normal if already migrated)${NC}"
fi

# Step 2: Frontend Build
echo ""
echo "Step 2: Building Frontend..."
cd ../frontend || exit 1

echo "Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Frontend npm install failed!${NC}"
    exit 1
fi

echo "Building production bundle..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Frontend build failed!${NC}"
    exit 1
fi

# Step 3: Deploy (if on VPS)
if [ "$ON_VPS" = true ]; then
    echo ""
    echo "Step 3: Deploying to production..."
    
    # Copy frontend build
    echo "Copying frontend files..."
    sudo mkdir -p /var/www/nextute
    sudo cp -r dist/* /var/www/nextute/
    
    # Restart backend with PM2
    echo "Restarting backend..."
    cd ../backend
    pm2 restart nextute-backend || pm2 start server.js --name nextute-backend
    
    # Restart Nginx
    echo "Restarting Nginx..."
    sudo systemctl restart nginx
    
    echo ""
    echo -e "${GREEN}========================================"
    echo "Deployment completed successfully!"
    echo "========================================${NC}"
    echo ""
    echo "Your application is now live at:"
    echo "https://nextute.com"
    echo ""
    echo "Useful commands:"
    echo "  pm2 logs nextute-backend  - View backend logs"
    echo "  pm2 status                - Check PM2 status"
    echo "  sudo nginx -t             - Test Nginx config"
    echo ""
else
    echo ""
    echo -e "${GREEN}========================================"
    echo "Build completed successfully!"
    echo "========================================${NC}"
    echo ""
    echo "To deploy to VPS, run these commands:"
    echo ""
    echo "1. Upload to VPS:"
    echo "   rsync -avz --exclude 'node_modules' Nextute-main/ root@72.60.218.219:/root/Nextute-main/"
    echo ""
    echo "2. SSH to VPS and run:"
    echo "   ssh root@72.60.218.219"
    echo "   cd /root/Nextute-main"
    echo "   ./deploy-production.sh"
    echo ""
fi
