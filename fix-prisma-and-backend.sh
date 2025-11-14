#!/bin/bash

echo "========================================"
echo "Fixing Prisma and Backend Issues"
echo "========================================"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd /root/Nextute-main/backend || exit 1

echo "1. Stopping Backend..."
echo "========================================"
pm2 stop nextute-backend

echo ""
echo "2. Cleaning node_modules and package-lock..."
echo "========================================"
rm -rf node_modules
rm -f package-lock.json
echo -e "${GREEN}✓ Cleaned${NC}"

echo ""
echo "3. Reinstalling all dependencies..."
echo "========================================"
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ npm install failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Dependencies installed${NC}"

echo ""
echo "4. Manually running Prisma generate..."
echo "========================================"
npx prisma generate

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Prisma generate failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prisma client generated${NC}"

echo ""
echo "5. Ensuring backend .env is correct..."
echo "========================================"
if ! grep -q "FRONTEND_URL=https://www.nextute.com" .env; then
    echo "FRONTEND_URL=https://www.nextute.com" >> .env
    echo -e "${GREEN}✓ Added FRONTEND_URL${NC}"
fi

echo ""
echo "6. Rebuilding Frontend..."
echo "========================================"
cd ../frontend

cat > .env << 'EOF'
VITE_API_URL=https://nextute.com/api
VITE_BACKEND_URL=https://nextute.com/api
VITE_BACKEND_BASE_URL=https://nextute.com
EOF

npm install --production=false
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Frontend build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Frontend built${NC}"

echo ""
echo "7. Deploying Frontend..."
echo "========================================"
sudo mkdir -p /var/www/nextute
sudo cp -r dist/* /var/www/nextute/
sudo chown -R www-data:www-data /var/www/nextute
echo -e "${GREEN}✓ Frontend deployed${NC}"

echo ""
echo "8. Starting Backend..."
echo "========================================"
cd ../backend
pm2 restart nextute-backend
pm2 save

echo ""
echo "9. Waiting for backend to initialize..."
sleep 5

echo ""
echo "10. Checking Backend Status..."
echo "========================================"
pm2 list

echo ""
echo "11. Testing Backend..."
RESPONSE=$(curl -s http://localhost:8080/test)
if echo "$RESPONSE" | grep -q "running"; then
    echo -e "${GREEN}✓ Backend is responding${NC}"
else
    echo -e "${YELLOW}Backend response: $RESPONSE${NC}"
fi

echo ""
echo "12. Restarting Nginx..."
echo "========================================"
sudo systemctl restart nginx
echo -e "${GREEN}✓ Nginx restarted${NC}"

echo ""
echo "========================================"
echo "Fix Complete!"
echo "========================================"
echo ""
echo "Check backend logs:"
echo "  pm2 logs nextute-backend --lines 20"
echo ""
echo "If you see bcrypt errors, run:"
echo "  cd /root/Nextute-main/backend"
echo "  npm rebuild bcrypt"
echo "  pm2 restart nextute-backend"
echo ""
