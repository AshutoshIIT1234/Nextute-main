#!/bin/bash

# Fix 500 Error - Create Database Table

echo "🔧 Fixing 500 Error"
echo "==================="
echo ""

cd /root/Nextute-main/backend || exit 1

echo "1. Generating Prisma Client..."
npx prisma generate

echo ""
echo "2. Creating database table..."
npx prisma db push --accept-data-loss

echo ""
echo "3. Restarting backend..."
pm2 restart backend

echo ""
echo "4. Checking backend status..."
sleep 3
pm2 logs backend --lines 20

echo ""
echo "5. Testing API..."
curl -s http://localhost:8080/test | jq '.'
curl -s http://localhost:8080/api/tech-hunt/stats | jq '.'

echo ""
echo "==================="
echo "✅ Fix Complete!"
echo "==================="
echo ""
echo "Try accessing the page again:"
echo "https://www.nextute.com/tech-hunt"
echo ""
