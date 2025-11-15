#!/bin/bash

echo "========================================"
echo "Restarting Backend"
echo "========================================"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd /root/Nextute-main/backend || exit 1

echo "1. Checking current PM2 status..."
echo "========================================"
pm2 list

echo ""
echo "2. Stopping backend..."
echo "========================================"
pm2 stop nextute-backend
pm2 delete nextute-backend

echo ""
echo "3. Cleaning corrupted node_modules..."
echo "========================================"
rm -rf node_modules
rm -f package-lock.json
echo -e "${GREEN}✓ Cleaned${NC}"

echo ""
echo "4. Reinstalling dependencies..."
echo "========================================"
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ npm install failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Dependencies installed${NC}"

echo ""
echo "5. Running Prisma generate..."
echo "========================================"
npx prisma generate

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Prisma generate failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prisma client generated${NC}"

echo ""
echo "6. Checking .env configuration..."
echo "========================================"
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ .env file exists${NC}"
    echo "Current FRONTEND_URL:"
    grep "FRONTEND_URL" .env || echo "FRONTEND_URL not set"
    
    # Ensure FRONTEND_URL is set
    if ! grep -q "FRONTEND_URL=" .env; then
        echo "FRONTEND_URL=https://nextute.com" >> .env
        echo -e "${GREEN}✓ Added FRONTEND_URL${NC}"
    fi
else
    echo -e "${RED}✗ .env file not found!${NC}"
    exit 1
fi

echo ""
echo "7. Starting backend with PM2..."
echo "========================================"
pm2 start server.js --name nextute-backend --node-args="--max-old-space-size=512"
pm2 save

echo ""
echo "8. Waiting for backend to start..."
sleep 5

echo ""
echo "9. Checking backend status..."
echo "========================================"
pm2 list

echo ""
echo "10. Testing backend..."
echo "========================================"
RESPONSE=$(curl -s http://localhost:8080/test)
if echo "$RESPONSE" | grep -q "running"; then
    echo -e "${GREEN}✓ Backend is responding!${NC}"
    echo "Response: $RESPONSE"
else
    echo -e "${YELLOW}Backend response: $RESPONSE${NC}"
fi

echo ""
echo "11. Checking recent logs..."
echo "========================================"
pm2 logs nextute-backend --lines 20 --nostream

echo ""
echo "========================================"
echo "Backend Restart Complete!"
echo "========================================"
echo ""
echo "To monitor logs in real-time:"
echo "  pm2 logs nextute-backend"
echo ""
echo "To check status:"
echo "  pm2 status"
echo ""
echo "If backend still has issues:"
echo "  pm2 logs nextute-backend --lines 50"
echo ""
