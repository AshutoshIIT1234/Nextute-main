#!/bin/bash

echo "========================================"
echo "Fixing Backend Dependencies and CORS"
echo "========================================"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd /root/Nextute-main || exit 1

echo "1. Fixing Backend Dependencies..."
echo "========================================"
cd backend

# Stop the backend first
pm2 stop nextute-backend

# Install missing dependencies
echo "Installing bcrypt and other dependencies..."
npm install bcrypt
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi

# Ensure backend has correct FRONTEND_URL
if ! grep -q "FRONTEND_URL=https://www.nextute.com" .env; then
    echo "FRONTEND_URL=https://www.nextute.com" >> .env
    echo -e "${GREEN}✓ Added FRONTEND_URL to backend .env${NC}"
fi

echo ""
echo "2. Rebuilding Frontend with Production URLs..."
echo "========================================"
cd ../frontend

# Create production .env
cat > .env << 'EOF'
VITE_API_URL=https://nextute.com/api
VITE_BACKEND_URL=https://nextute.com/api
VITE_BACKEND_BASE_URL=https://nextute.com
EOF

echo -e "${GREEN}✓ Frontend .env configured${NC}"

# Install and build
npm install --production=false
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend built successfully${NC}"
else
    echo -e "${RED}✗ Frontend build failed${NC}"
    exit 1
fi

echo ""
echo "3. Deploying Frontend..."
echo "========================================"
sudo mkdir -p /var/www/nextute
sudo cp -r dist/* /var/www/nextute/
sudo chown -R www-data:www-data /var/www/nextute
echo -e "${GREEN}✓ Frontend deployed${NC}"

echo ""
echo "4. Starting Backend..."
echo "========================================"
cd ../backend
pm2 restart nextute-backend
pm2 save
echo -e "${GREEN}✓ Backend restarted${NC}"

echo ""
echo "5. Waiting for backend to start..."
sleep 5

echo ""
echo "6. Checking Backend Status..."
echo "========================================"
pm2 status nextute-backend

echo ""
echo "7. Testing Backend..."
RESPONSE=$(curl -s http://localhost:8080/test)
if echo "$RESPONSE" | grep -q "running"; then
    echo -e "${GREEN}✓ Backend is responding correctly${NC}"
else
    echo -e "${YELLOW}! Backend response: $RESPONSE${NC}"
fi

echo ""
echo "8. Restarting Nginx..."
echo "========================================"
sudo systemctl restart nginx
echo -e "${GREEN}✓ Nginx restarted${NC}"

echo ""
echo "9. Testing CORS..."
echo "========================================"
echo "Testing from nextute.com..."
curl -s -H "Origin: https://nextute.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:8080/api/institutes/all-institutes \
     -I | grep -i "access-control"

echo ""
echo "Testing from www.nextute.com..."
curl -s -H "Origin: https://www.nextute.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:8080/api/institutes/all-institutes \
     -I | grep -i "access-control"

echo ""
echo "========================================"
echo "Fix Complete!"
echo "========================================"
echo ""
echo "Your site should now work at:"
echo "  https://nextute.com"
echo "  https://www.nextute.com"
echo ""
echo "To check for errors:"
echo "  pm2 logs nextute-backend --lines 50"
echo "  sudo tail -f /var/log/nginx/error.log"
echo ""
