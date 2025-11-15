#!/bin/bash

echo "========================================"
echo "Fixing bcrypt Issue"
echo "========================================"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

cd /root/Nextute-main/backend || exit 1

echo "1. Stopping backend..."
pm2 stop nextute-backend

echo ""
echo "2. Installing bcrypt specifically..."
echo "========================================"
npm install bcrypt --save

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ bcrypt install failed, trying rebuild...${NC}"
    npm rebuild bcrypt
fi

echo ""
echo "3. Verifying bcrypt installation..."
echo "========================================"
if [ -d "node_modules/bcrypt" ]; then
    echo -e "${GREEN}✓ bcrypt directory exists${NC}"
    ls -la node_modules/bcrypt/
else
    echo -e "${RED}✗ bcrypt not found in node_modules${NC}"
    echo "Trying alternative installation..."
    npm install bcryptjs --save
fi

echo ""
echo "4. Checking package.json..."
echo "========================================"
grep "bcrypt" package.json

echo ""
echo "5. Restarting backend..."
echo "========================================"
pm2 restart nextute-backend

echo ""
echo "6. Waiting for backend..."
sleep 5

echo ""
echo "7. Checking logs..."
echo "========================================"
pm2 logs nextute-backend --lines 30 --nostream

echo ""
echo "8. Testing backend..."
echo "========================================"
RESPONSE=$(curl -s http://localhost:8080/test)
if echo "$RESPONSE" | grep -q "running"; then
    echo -e "${GREEN}✓ Backend is working!${NC}"
    echo "Response: $RESPONSE"
else
    echo -e "${RED}Backend still not responding properly${NC}"
    echo "Response: $RESPONSE"
fi

echo ""
echo "========================================"
echo "Done!"
echo "========================================"
