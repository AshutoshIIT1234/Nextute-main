#!/bin/bash

echo "========================================="
echo "Fixing bcrypt and Database Issues"
echo "========================================="

cd /root/Nextute-main/backend || exit 1

echo ""
echo "1. Stopping backend..."
pm2 stop nextute-backend
pm2 delete nextute-backend

echo ""
echo "2. Removing node_modules and package-lock..."
rm -rf node_modules package-lock.json

echo ""
echo "3. Installing dependencies with bcrypt..."
npm install

echo ""
echo "4. Rebuilding bcrypt for your system..."
npm rebuild bcrypt --build-from-source

echo ""
echo "5. Verifying bcrypt installation..."
if [ -d "node_modules/bcrypt" ]; then
    echo "✓ bcrypt is installed"
else
    echo "✗ bcrypt installation failed, trying alternative..."
    npm install bcrypt@latest --save
fi

echo ""
echo "6. Regenerating Prisma client..."
npx prisma generate

echo ""
echo "7. Testing database connection..."
npx prisma db pull --force || echo "Warning: DB connection issue"

echo ""
echo "8. Checking .env configuration..."
echo "DATABASE_URL exists: $(grep -q DATABASE_URL .env && echo 'Yes' || echo 'No')"
echo "PORT: $(grep PORT .env | cut -d '=' -f2)"

echo ""
echo "9. Starting backend..."
pm2 start server.js --name nextute-backend --node-args="--max-old-space-size=512"
pm2 save

echo ""
echo "10. Waiting for backend to start..."
sleep 5

echo ""
echo "11. Testing backend..."
curl -s http://localhost:8080/test

echo ""
echo "12. Checking logs..."
pm2 logs nextute-backend --lines 30 --nostream

echo ""
echo "========================================="
echo "Fix Complete!"
echo "========================================="
echo ""
echo "If you still see bcrypt errors, run:"
echo "  cd /root/Nextute-main/backend"
echo "  npm uninstall bcrypt"
echo "  npm install bcrypt --build-from-source"
echo "  pm2 restart nextute-backend"
