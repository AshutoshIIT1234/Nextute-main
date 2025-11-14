#!/bin/bash

echo "========================================"
echo "Nextute Production Quick Fix"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Navigate to project directory
cd /root/Nextute-main || exit 1

echo "1. Fixing Backend Environment..."
# Ensure NODE_ENV is set
if ! grep -q "NODE_ENV=production" backend/.env; then
    echo "NODE_ENV=production" >> backend/.env
    echo -e "${GREEN}✓ Added NODE_ENV=production${NC}"
fi

# Ensure JWT_SECRET exists
if ! grep -q "JWT_SECRET=" backend/.env; then
    if grep -q "TOKEN_KEY=" backend/.env; then
        TOKEN_VALUE=$(grep "TOKEN_KEY=" backend/.env | cut -d= -f2)
        echo "JWT_SECRET=$TOKEN_VALUE" >> backend/.env
        echo -e "${GREEN}✓ Added JWT_SECRET${NC}"
    fi
fi

echo ""
echo "2. Rebuilding Frontend..."
cd frontend
npm install --production=false
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend built successfully${NC}"
else
    echo -e "${YELLOW}! Frontend build had issues${NC}"
fi

echo ""
echo "3. Deploying Frontend..."
sudo mkdir -p /var/www/nextute
sudo cp -r dist/* /var/www/nextute/
sudo chown -R www-data:www-data /var/www/nextute
echo -e "${GREEN}✓ Frontend deployed${NC}"

echo ""
echo "4. Updating Backend..."
cd ../backend
npm install --production
npx prisma generate
echo -e "${GREEN}✓ Backend dependencies updated${NC}"

echo ""
echo "5. Restarting Services..."
# Restart backend
pm2 restart nextute-backend || pm2 start server.js --name nextute-backend
pm2 save

# Restart Nginx
sudo systemctl restart nginx

echo -e "${GREEN}✓ Services restarted${NC}"

echo ""
echo "6. Testing Backend..."
sleep 2
RESPONSE=$(curl -s http://localhost:8080/test)
if echo "$RESPONSE" | grep -q "running"; then
    echo -e "${GREEN}✓ Backend is responding${NC}"
else
    echo -e "${YELLOW}! Backend may have issues. Check logs: pm2 logs nextute-backend${NC}"
fi

echo ""
echo "========================================"
echo "Fix Complete!"
echo "========================================"
echo ""
echo "Your site should now be working at:"
echo "https://nextute.com"
echo ""
echo "If issues persist, run: ./diagnose-production.sh"
echo ""
