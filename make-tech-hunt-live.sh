#!/bin/bash

# Make Tech Hunt Live NOW!

echo "🚀 Making Tech Hunt Live!"
echo "========================="
echo ""

cd /root/Nextute-main || exit 1

# Update database schema
echo "1️⃣  Updating database..."
cd backend
npx prisma db push --accept-data-loss
echo "✅ Database updated"
echo ""

# Rebuild frontend
echo "2️⃣  Building frontend..."
cd ../frontend
npm run build
echo "✅ Frontend built"
echo ""

# Deploy to Nginx
echo "3️⃣  Deploying to Nginx..."
sudo rm -rf /var/www/nextute/*
sudo cp -r dist/* /var/www/nextute/
sudo chown -R www-data:www-data /var/www/nextute
sudo chmod -R 755 /var/www/nextute
echo "✅ Deployed to Nginx"
echo ""

# Restart services
echo "4️⃣  Restarting services..."
pm2 restart all
sudo systemctl reload nginx
echo "✅ Services restarted"
echo ""

# Test
echo "5️⃣  Testing..."
sleep 3
curl -s http://localhost:8080/test | jq '.'
curl -s http://localhost:8080/api/tech-hunt/stats | jq '.'
echo ""

echo "========================="
echo "🎉 Tech Hunt is LIVE!"
echo "========================="
echo ""
echo "🌐 Visit: https://www.nextute.com/tech-hunt"
echo ""
echo "📊 Stats: https://www.nextute.com/api/tech-hunt/stats"
echo "👥 Participants: https://www.nextute.com/api/tech-hunt/participants"
echo ""
echo "✅ Event is now accepting reward claims!"
echo ""
