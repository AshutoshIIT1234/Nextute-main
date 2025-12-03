#!/bin/bash

echo "========================================="
echo "Complete Backend Fix for VPS"
echo "========================================="

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd /root/Nextute-main/backend || exit 1

echo ""
echo "1. Fixing bcrypt imports..."
sed -i 's/from "bcrypt"/from "bcryptjs"/g' prisma/seed.js
sed -i 's/from "bcrypt"/from "bcryptjs"/g' controllers/forgotAndResetPasswordController.js
echo -e "${GREEN}✓ Fixed bcrypt imports${NC}"

echo ""
echo "2. Stopping backend..."
pm2 stop nextute-backend 2>/dev/null || true
pm2 delete nextute-backend 2>/dev/null || true

echo ""
echo "3. Starting backend..."
pm2 start server.js --name nextute-backend --node-args="--max-old-space-size=512"
pm2 save

echo ""
echo "4. Waiting for backend to start..."
sleep 5

echo ""
echo "5. Testing backend..."
TEST_RESULT=$(curl -s http://localhost:8080/test)
echo "Response: $TEST_RESULT"

if echo "$TEST_RESULT" | grep -q "running"; then
    echo -e "${GREEN}✓ Backend is running!${NC}"
else
    echo -e "${YELLOW}⚠ Backend may have issues${NC}"
fi

echo ""
echo "6. Testing institutes endpoint..."
INSTITUTES_RESULT=$(curl -s http://localhost:8080/api/institutes/all-institutes)
if echo "$INSTITUTES_RESULT" | grep -q "institute"; then
    echo -e "${GREEN}✓ Institutes endpoint working!${NC}"
else
    echo "Response: $INSTITUTES_RESULT"
fi

echo ""
echo "7. Checking for errors in logs..."
pm2 logs nextute-backend --lines 20 --nostream | grep -i error || echo -e "${GREEN}✓ No errors found${NC}"

echo ""
echo "8. PM2 Status:"
pm2 list

echo ""
echo "========================================="
echo "Fix Complete!"
echo "========================================="
echo ""
echo "Test your API:"
echo "  https://www.nextute.com/api/institutes/all-institutes"
echo ""
echo "Monitor logs:"
echo "  pm2 logs nextute-backend"
.