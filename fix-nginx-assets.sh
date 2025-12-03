#!/bin/bash

# Fix Nginx Asset Loading Issues
# This rebuilds the frontend and ensures Nginx serves the correct files

echo "🔧 Fixing Nginx Asset Loading Issues"
echo "====================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Find project directory
if [ -d "/root/Nextute-main" ]; then
    PROJECT_DIR="/root/Nextute-main"
elif [ -d "/home/*/Nextute-main" ]; then
    PROJECT_DIR=$(find /home -name "Nextute-main" -type d 2>/dev/null | head -1)
elif [ -d "/var/www/Nextute-main" ]; then
    PROJECT_DIR="/var/www/Nextute-main"
else
    echo -e "${RED}❌ Cannot find Nextute-main directory${NC}"
    exit 1
fi

echo -e "${GREEN}📍 Project directory: $PROJECT_DIR${NC}"
cd "$PROJECT_DIR" || exit 1
echo ""

# Step 1: Clean old build
echo "🧹 Cleaning old build..."
cd frontend
rm -rf dist
rm -rf node_modules/.vite
echo -e "${GREEN}✅ Old build cleaned${NC}"
echo ""

# Step 2: Rebuild frontend
echo "🏗️  Building fresh frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

# Step 3: Check where Nginx expects files
NGINX_ROOT="/var/www/nextute"
echo "📂 Nginx root directory: $NGINX_ROOT"
echo ""

# Step 4: Copy built files to Nginx directory
echo "📦 Copying built files to Nginx directory..."
sudo mkdir -p "$NGINX_ROOT"
sudo rm -rf "$NGINX_ROOT"/*
sudo cp -r dist/* "$NGINX_ROOT/"
echo -e "${GREEN}✅ Files copied${NC}"
echo ""

# Step 5: Set correct permissions
echo "🔐 Setting correct permissions..."
sudo chown -R www-data:www-data "$NGINX_ROOT"
sudo chmod -R 755 "$NGINX_ROOT"
echo -e "${GREEN}✅ Permissions set${NC}"
echo ""

# Step 6: Verify files exist
echo "🔍 Verifying files..."
if [ -f "$NGINX_ROOT/index.html" ]; then
    echo -e "${GREEN}✅ index.html found${NC}"
else
    echo -e "${RED}❌ index.html NOT found${NC}"
fi

ASSET_COUNT=$(find "$NGINX_ROOT/assets" -type f 2>/dev/null | wc -l)
echo -e "${GREEN}✅ Found $ASSET_COUNT asset files${NC}"
echo ""

# Step 7: Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Nginx config is valid${NC}"
else
    echo -e "${RED}❌ Nginx config has errors${NC}"
    exit 1
fi
echo ""

# Step 8: Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx
echo -e "${GREEN}✅ Nginx reloaded${NC}"
echo ""

# Step 9: Clear browser cache instruction
echo "====================================="
echo -e "${GREEN}🎉 Fix Complete!${NC}"
echo "====================================="
echo ""
echo "Next steps:"
echo "1. Clear your browser cache (Ctrl+Shift+Delete)"
echo "2. Visit: https://www.nextute.com"
echo "3. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)"
echo ""
echo "If issues persist:"
echo "- Check: sudo tail -f /var/log/nginx/error.log"
echo "- Verify: ls -la $NGINX_ROOT/assets/"
echo ""
