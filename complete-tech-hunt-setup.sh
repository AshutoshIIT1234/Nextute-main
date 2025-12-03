#!/bin/bash

# Complete Tech Hunt Setup on VPS

echo "🔧 Complete Tech Hunt Setup"
echo "============================"
echo ""

cd /root/Nextute-main || exit 1

# Step 1: Pull latest code
echo "1️⃣  Pulling latest code..."
git pull origin main
echo ""

# Step 2: Update backend
echo "2️⃣  Setting up backend..."
cd backend

# Install dependencies (in case new ones were added)
npm install

# Generate Prisma client
echo "   Generating Prisma client..."
npx prisma generate

# Push database schema
echo "   Creating database table..."
npx prisma db push --accept-data-loss

echo "✅ Backend setup complete"
echo ""

# Step 3: Update frontend
echo "3️⃣  Building frontend..."
cd ../frontend
npm install
npm run build
echo "✅ Frontend built"
echo ""

# Step 4: Deploy frontend
echo "4️⃣  Deploying frontend..."
sudo rm -rf /var/www/nextute/*
sudo cp -r dist/* /var/www/nextute/
sudo chown -R www-data:www-data /var/www/nextute
sudo chmod -R 755 /var/www/nextute
echo "✅ Frontend deployed"
echo ""

# Step 5: Restart services
echo "5️⃣  Restarting services..."
cd ..
pm2 restart all
sudo systemctl reload nginx
echo "✅ Services restarted"
echo ""

# Step 6: Wait and test
echo "6️⃣  Testing..."
sleep 5

echo ""
echo "Backend test:"
curl -s http://localhost:8080/test | jq '.'

echo ""
echo "Tech Hunt stats:"
curl -s http://localhost:8080/api/tech-hunt/stats | jq '.'

echo ""
echo "Backend logs (last 20 lines):"
pm2 logs backend --lines 20 --nostream

echo ""
echo "============================"
echo "✅ Setup Complete!"
echo "============================"
echo ""
echo "🌐 Visit: https://www.nextute.com/tech-hunt"
echo ""
echo "If you still see errors:"
echo "  1. Check logs: pm2 logs backend"
echo "  2. Check database: npx prisma studio"
echo "  3. Verify table exists: npx prisma db pull"
echo ""
