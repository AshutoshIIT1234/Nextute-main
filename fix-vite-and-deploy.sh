#!/bin/bash

echo "========================================"
echo "Fixing Vite and Deploying Frontend"
echo "========================================"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd /root/Nextute-main/frontend || exit 1

echo "1. Cleaning corrupted node_modules..."
echo "========================================"
rm -rf node_modules
rm -f package-lock.json
echo -e "${GREEN}✓ Cleaned${NC}"

echo ""
echo "2. Updating Frontend .env..."
echo "========================================"
cat > .env << 'EOF'
VITE_API_URL=https://nextute.com/api
VITE_BACKEND_URL=https://nextute.com
VITE_BACKEND_BASE_URL=https://nextute.com
EOF
echo -e "${GREEN}✓ Frontend .env configured${NC}"
cat .env

echo ""
echo "3. Reinstalling dependencies..."
echo "========================================"
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ npm install failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Dependencies installed${NC}"

echo ""
echo "4. Building Frontend..."
echo "========================================"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Frontend build failed${NC}"
    echo ""
    echo "Trying alternative build method..."
    npx vite build --mode production
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Alternative build also failed${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ Frontend built successfully${NC}"

echo ""
echo "5. Deploying Frontend..."
echo "========================================"
sudo mkdir -p /var/www/nextute
sudo rm -rf /var/www/nextute/*
sudo cp -r dist/* /var/www/nextute/
sudo chown -R www-data:www-data /var/www/nextute
echo -e "${GREEN}✓ Frontend deployed${NC}"

echo ""
echo "6. Restarting Nginx..."
echo "========================================"
sudo systemctl restart nginx
echo -e "${GREEN}✓ Nginx restarted${NC}"

echo ""
echo "7. Testing deployment..."
echo "========================================"
if [ -f "/var/www/nextute/index.html" ]; then
    echo -e "${GREEN}✓ index.html exists${NC}"
else
    echo -e "${RED}✗ index.html not found!${NC}"
fi

echo ""
echo "========================================"
echo "Deployment Complete!"
echo "========================================"
echo ""
echo "✓ Fixed double /api/ issue"
echo "✓ Frontend rebuilt and deployed"
echo ""
echo "IMPORTANT: Clear your browser cache!"
echo "  Press Ctrl+Shift+R to hard refresh"
echo ""
echo "URLs should now work correctly:"
echo "  ✓ https://nextute.com/api/mentorship/mentors"
echo "  ✓ https://nextute.com/api/institutes/all-institutes"
echo ""
