#!/bin/bash

echo "=== Fixing Backend 404 Issue ==="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Navigate to backend directory (try both possible paths)
if [ -d "/root/Nextute-main/backend" ]; then
    cd /root/Nextute-main/backend || exit 1
elif [ -d "/root/nextute/backend" ]; then
    cd /root/nextute/backend || exit 1
else
    echo -e "${RED}ERROR: Backend directory not found!${NC}"
    exit 1
fi

echo "Current directory: $(pwd)"
echo ""

echo "1. Stopping existing backend processes..."
pm2 stop nextute-backend 2>/dev/null || true
pm2 delete nextute-backend 2>/dev/null || true
pm2 stop backend 2>/dev/null || true
pm2 delete backend 2>/dev/null || true

echo ""
echo "2. Installing/updating dependencies..."
npm install

echo ""
echo "3. Checking environment variables..."
if [ ! -f .env ]; then
    echo "ERROR: .env file not found!"
    exit 1
fi

echo "PORT=$(grep PORT .env)"
echo "NODE_ENV=$(grep NODE_ENV .env)"
echo "DATABASE_URL exists: $(grep -q DATABASE_URL .env && echo 'Yes' || echo 'No')"

echo ""
echo "4. Testing database connection..."
npx prisma db pull --force || echo "Warning: Database connection issue"

echo ""
echo "5. Starting backend with PM2..."
pm2 start server.js --name nextute-backend --node-args="--max-old-space-size=512"
pm2 save

echo ""
echo "6. Waiting for backend to start..."
sleep 5

echo ""
echo "7. Testing backend endpoints..."
echo "Testing /test endpoint:"
curl -s http://localhost:8080/test | jq . || curl -s http://localhost:8080/test

echo ""
echo "Testing /api/institutes/all-institutes endpoint:"
curl -s http://localhost:8080/api/institutes/all-institutes | jq . || curl -s http://localhost:8080/api/institutes/all-institutes

echo ""
echo "8. Checking PM2 status..."
pm2 list

echo ""
echo "9. Showing recent logs..."
pm2 logs nextute-backend --lines 20 --nostream

echo ""
echo "10. Restarting nginx..."
systemctl restart nginx

echo ""
echo "=== Fix Complete ==="
echo ""
echo "Test your API at: https://www.nextute.com/api/institutes/all-institutes"
