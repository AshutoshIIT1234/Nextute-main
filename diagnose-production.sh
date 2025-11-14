#!/bin/bash

echo "========================================"
echo "Nextute Production Diagnostics"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check 1: Backend Status
echo "1. Checking Backend (PM2)..."
if command -v pm2 &> /dev/null; then
    pm2 list | grep nextute-backend
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Backend is running${NC}"
    else
        echo -e "${RED}✗ Backend is NOT running${NC}"
        echo "  Fix: pm2 start /root/Nextute-main/backend/server.js --name nextute-backend"
    fi
else
    echo -e "${RED}✗ PM2 is not installed${NC}"
fi
echo ""

# Check 2: Backend Logs
echo "2. Recent Backend Logs (last 20 lines)..."
if command -v pm2 &> /dev/null; then
    pm2 logs nextute-backend --lines 20 --nostream
fi
echo ""

# Check 3: Nginx Status
echo "3. Checking Nginx..."
if command -v nginx &> /dev/null; then
    sudo systemctl status nginx | grep "Active:"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Nginx is installed${NC}"
    fi
    
    # Test Nginx config
    sudo nginx -t 2>&1 | tail -2
else
    echo -e "${RED}✗ Nginx is not installed${NC}"
fi
echo ""

# Check 4: Frontend Files
echo "4. Checking Frontend Files..."
if [ -d "/var/www/nextute" ]; then
    FILE_COUNT=$(ls -1 /var/www/nextute | wc -l)
    echo -e "${GREEN}✓ Frontend directory exists with $FILE_COUNT files${NC}"
    
    if [ -f "/var/www/nextute/index.html" ]; then
        echo -e "${GREEN}✓ index.html found${NC}"
    else
        echo -e "${RED}✗ index.html NOT found${NC}"
        echo "  Fix: sudo cp -r /root/Nextute-main/frontend/dist/* /var/www/nextute/"
    fi
else
    echo -e "${RED}✗ Frontend directory does not exist${NC}"
    echo "  Fix: sudo mkdir -p /var/www/nextute && sudo cp -r /root/Nextute-main/frontend/dist/* /var/www/nextute/"
fi
echo ""

# Check 5: Backend Port
echo "5. Checking Backend Port (8080)..."
if netstat -tuln | grep -q ":8080"; then
    echo -e "${GREEN}✓ Port 8080 is listening${NC}"
else
    echo -e "${RED}✗ Port 8080 is NOT listening${NC}"
    echo "  Fix: Check backend logs and restart: pm2 restart nextute-backend"
fi
echo ""

# Check 6: Environment Variables
echo "6. Checking Environment Files..."
if [ -f "/root/Nextute-main/backend/.env" ]; then
    echo -e "${GREEN}✓ Backend .env exists${NC}"
    
    # Check critical variables
    if grep -q "NODE_ENV=production" /root/Nextute-main/backend/.env; then
        echo -e "${GREEN}  ✓ NODE_ENV=production${NC}"
    else
        echo -e "${YELLOW}  ! NODE_ENV not set to production${NC}"
    fi
    
    if grep -q "DATABASE_URL" /root/Nextute-main/backend/.env; then
        echo -e "${GREEN}  ✓ DATABASE_URL configured${NC}"
    else
        echo -e "${RED}  ✗ DATABASE_URL missing${NC}"
    fi
else
    echo -e "${RED}✗ Backend .env NOT found${NC}"
fi
echo ""

# Check 7: Database Connection
echo "7. Testing Database Connection..."
cd /root/Nextute-main/backend
npx prisma db pull --force 2>&1 | grep -E "(success|error|failed)" | head -3
echo ""

# Check 8: Nginx Configuration
echo "8. Checking Nginx Configuration..."
if [ -f "/etc/nginx/sites-available/nextute" ]; then
    echo -e "${GREEN}✓ Nginx config exists${NC}"
    
    if [ -L "/etc/nginx/sites-enabled/nextute" ]; then
        echo -e "${GREEN}✓ Nginx config is enabled${NC}"
    else
        echo -e "${RED}✗ Nginx config is NOT enabled${NC}"
        echo "  Fix: sudo ln -s /etc/nginx/sites-available/nextute /etc/nginx/sites-enabled/"
    fi
else
    echo -e "${RED}✗ Nginx config NOT found${NC}"
fi
echo ""

# Check 9: SSL Certificates
echo "9. Checking SSL Certificates..."
if [ -f "/etc/letsencrypt/live/nextute.com/fullchain.pem" ]; then
    echo -e "${GREEN}✓ SSL certificate exists${NC}"
    
    # Check expiry
    EXPIRY=$(sudo openssl x509 -enddate -noout -in /etc/letsencrypt/live/nextute.com/fullchain.pem | cut -d= -f2)
    echo "  Expires: $EXPIRY"
else
    echo -e "${YELLOW}! SSL certificate not found (using HTTP only)${NC}"
fi
echo ""

# Check 10: Firewall
echo "10. Checking Firewall..."
if command -v ufw &> /dev/null; then
    sudo ufw status | grep -E "(80|443|8080)"
else
    echo "UFW not installed"
fi
echo ""

# Check 11: Disk Space
echo "11. Checking Disk Space..."
df -h / | tail -1
echo ""

# Check 12: Memory Usage
echo "12. Checking Memory Usage..."
free -h | grep -E "(Mem|Swap)"
echo ""

echo "========================================"
echo "Diagnostics Complete"
echo "========================================"
echo ""
echo "Quick Fixes:"
echo "  Restart Backend:  pm2 restart nextute-backend"
echo "  View Logs:        pm2 logs nextute-backend"
echo "  Restart Nginx:    sudo systemctl restart nginx"
echo "  Test Backend:     curl http://localhost:8080/test"
echo "  Nginx Logs:       sudo tail -f /var/log/nginx/error.log"
echo ""
