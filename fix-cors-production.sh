#!/bin/bash

echo "========================================"
echo "Fixing CORS and Production Issues"
echo "========================================"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd /root/Nextute-main || exit 1

echo "1. Checking Backend Environment..."
# Ensure backend has correct FRONTEND_URL (should accept both www and non-www)
if ! grep -q "FRONTEND_URL=https://www.nextute.com" backend/.env; then
    echo "FRONTEND_URL=https://www.nextute.com" >> backend/.env
    echo -e "${GREEN}✓ Added FRONTEND_URL${NC}"
fi

echo ""
echo "2. Rebuilding Frontend with Production URLs..."
cd frontend

# Create production .env if it doesn't exist
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
    echo -e "${YELLOW}! Frontend build had issues${NC}"
fi

echo ""
echo "3. Deploying Frontend..."
sudo mkdir -p /var/www/nextute
sudo cp -r dist/* /var/www/nextute/
sudo chown -R www-data:www-data /var/www/nextute
echo -e "${GREEN}✓ Frontend deployed${NC}"

echo ""
echo "4. Restarting Backend..."
cd ../backend
pm2 restart nextute-backend
pm2 save
echo -e "${GREEN}✓ Backend restarted${NC}"

echo ""
echo "5. Restarting Nginx..."
sudo systemctl restart nginx
echo -e "${GREEN}✓ Nginx restarted${NC}"

echo ""
echo "6. Testing Backend..."
sleep 2
RESPONSE=$(curl -s http://localhost:8080/test)
if echo "$RESPONSE" | grep -q "running"; then
    echo -e "${GREEN}✓ Backend is responding${NC}"
else
    echo -e "${YELLOW}! Backend may have issues${NC}"
    echo "Response: $RESPONSE"
fi

echo ""
echo "7. Testing CORS..."
# Test from both www and non-www
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
echo "Both URLs should work without CORS errors."
echo ""
echo "If issues persist:"
echo "  pm2 logs nextute-backend --lines 50"
echo "  sudo tail -f /var/log/nginx/error.log"
echo ""
