#!/bin/bash

echo "========================================="
echo "COMPLETE VPS UPDATE - Backend + Frontend"
echo "========================================="

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running on VPS
if [ ! -d "/var/www/nextute" ]; then
    echo -e "${RED}ERROR: This script must be run on the VPS!${NC}"
    exit 1
fi

cd /root/Nextute-main || exit 1

echo ""
echo "========================================="
echo "PART 1: Backend Update"
echo "========================================="

cd backend || exit 1

echo ""
echo "1. Fixing bcrypt imports..."
sed -i 's/from "bcrypt"/from "bcryptjs"/g' prisma/seed.js
sed -i 's/from "bcrypt"/from "bcryptjs"/g' controllers/forgotAndResetPasswordController.js
echo -e "${GREEN}✓ Fixed bcrypt imports${NC}"

echo ""
echo "2. Installing/updating backend dependencies..."
npm install

echo ""
echo "3. Regenerating Prisma client..."
npx prisma generate

echo ""
echo "4. Restarting backend..."
pm2 stop nextute-backend 2>/dev/null || true
pm2 delete nextute-backend 2>/dev/null || true
pm2 start server.js --name nextute-backend --node-args="--max-old-space-size=512"
pm2 save

echo ""
echo "5. Testing backend..."
sleep 3
TEST_RESULT=$(curl -s http://localhost:8080/test)
if echo "$TEST_RESULT" | grep -q "running"; then
    echo -e "${GREEN}✓ Backend is running!${NC}"
else
    echo -e "${YELLOW}⚠ Backend response: $TEST_RESULT${NC}"
fi

echo ""
echo "========================================="
echo "PART 2: Frontend Update"
echo "========================================="

cd ../frontend || exit 1

echo ""
echo "6. Cleaning frontend..."
rm -rf node_modules package-lock.json dist

echo ""
echo "7. Installing frontend dependencies..."
npm install

echo ""
echo "8. Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Frontend build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Frontend built successfully${NC}"

echo ""
echo "9. Deploying frontend to /var/www/nextute..."
sudo rm -rf /var/www/nextute/*
sudo cp -r dist/* /var/www/nextute/
sudo chown -R www-data:www-data /var/www/nextute

echo -e "${GREEN}✓ Frontend deployed${NC}"

echo ""
echo "10. Restarting nginx..."
sudo systemctl restart nginx

echo ""
echo "========================================="
echo "VERIFICATION"
echo "========================================="

echo ""
echo "Backend Status:"
pm2 list

echo ""
echo "Testing endpoints..."
echo "Backend health:"
curl -s http://localhost:8080/test

echo ""
echo "Institutes endpoint:"
curl -s http://localhost:8080/api/institutes/all-institutes | head -c 200

echo ""
echo "Nginx status:"
sudo systemctl status nginx --no-pager | head -n 5

echo ""
echo "========================================="
echo "DEPLOYMENT COMPLETE!"
echo "========================================="
echo ""
echo "Your site is live at:"
echo "  https://www.nextute.com"
echo ""
echo "Test backend API:"
echo "  https://www.nextute.com/api/institutes/all-institutes"
echo ""
echo "Monitor backend:"
echo "  pm2 logs nextute-backend"
echo ""
echo "Check nginx logs:"
echo "  sudo tail -f /var/log/nginx/error.log"
echo ""
