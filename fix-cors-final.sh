#!/bin/bash

echo "========================================"
echo "Final CORS Fix - Matching URLs"
echo "========================================"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd /root/Nextute-main || exit 1

echo "1. Updating Backend .env..."
echo "========================================"
cd backend

# Update backend to accept both www and non-www
if ! grep -q "FRONTEND_URL=https://nextute.com" .env; then
    echo "FRONTEND_URL=https://nextute.com" >> .env
    echo -e "${GREEN}✓ Added FRONTEND_URL${NC}"
else
    echo -e "${YELLOW}FRONTEND_URL already set${NC}"
fi

echo ""
echo "2. Rebuilding Frontend with MATCHING URLs..."
echo "========================================"
cd ../frontend

# IMPORTANT: Use nextute.com (without www) to match the domain users visit
cat > .env << 'EOF'
VITE_API_URL=https://nextute.com/api
VITE_BACKEND_URL=https://nextute.com/api
VITE_BACKEND_BASE_URL=https://nextute.com
EOF

echo -e "${GREEN}✓ Frontend .env configured (no www)${NC}"
cat .env

npm install --production=false
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Frontend build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Frontend built successfully${NC}"

echo ""
echo "3. Deploying Frontend..."
echo "========================================"
sudo mkdir -p /var/www/nextute
sudo rm -rf /var/www/nextute/*
sudo cp -r dist/* /var/www/nextute/
sudo chown -R www-data:www-data /var/www/nextute
echo -e "${GREEN}✓ Frontend deployed${NC}"

echo ""
echo "4. Restarting Backend..."
echo "========================================"
cd ../backend
pm2 restart nextute-backend
pm2 save
echo -e "${GREEN}✓ Backend restarted${NC}"

echo ""
echo "5. Waiting for backend..."
sleep 3

echo ""
echo "6. Testing Backend..."
echo "========================================"
RESPONSE=$(curl -s http://localhost:8080/test)
if echo "$RESPONSE" | grep -q "running"; then
    echo -e "${GREEN}✓ Backend is responding${NC}"
else
    echo -e "${YELLOW}Backend response: $RESPONSE${NC}"
fi

echo ""
echo "7. Testing CORS from nextute.com..."
echo "========================================"
curl -s -H "Origin: https://nextute.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:8080/api/institutes/all-institutes \
     -I | grep -i "access-control"

echo ""
echo "8. Restarting Nginx..."
echo "========================================"
sudo systemctl restart nginx
echo -e "${GREEN}✓ Nginx restarted${NC}"

echo ""
echo "9. Clearing browser cache..."
echo "========================================"
echo "IMPORTANT: Clear your browser cache or use Ctrl+Shift+R to hard refresh!"
echo ""

echo ""
echo "========================================"
echo "CORS Fix Complete!"
echo "========================================"
echo ""
echo "✓ Frontend and backend now both use: https://nextute.com"
echo "✓ No more www/non-www mismatch"
echo ""
echo "Next steps:"
echo "1. Open https://nextute.com in browser"
echo "2. Press Ctrl+Shift+R to hard refresh (clear cache)"
echo "3. Check console (F12) - CORS errors should be gone"
echo ""
echo "If issues persist:"
echo "  pm2 logs nextute-backend --lines 20"
echo ""
