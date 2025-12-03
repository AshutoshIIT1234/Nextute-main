#!/bin/bash

# Deploy Tech Hunt Feature to VPS
# This script updates the database schema and deploys the new feature

echo "🎯 Deploying Tech Hunt Feature"
echo "================================"
echo ""

VPS_IP="72.60.218.219"
VPS_USER="root"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}📦 What will be deployed:${NC}"
echo "  ✅ New database table: tech_hunt_participants"
echo "  ✅ Backend API: /api/tech-hunt/claim"
echo "  ✅ Frontend page: /tech-hunt"
echo "  ✅ Reward claim form with validation"
echo ""

read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

echo ""
echo "🚀 Starting deployment..."
echo ""

ssh $VPS_USER@$VPS_IP << 'ENDSSH'
    set -e
    
    cd /root/Nextute-main || cd /home/*/Nextute-main || cd /var/www/Nextute-main
    
    echo "📍 Working directory: $(pwd)"
    echo ""
    
    # Backup
    echo "💾 Creating backup..."
    cp -r . ../Nextute-backup-techhunt-$(date +%Y%m%d-%H%M%S)
    echo "✅ Backup created"
    echo ""
    
    # Pull latest code
    echo "📥 Pulling latest code..."
    git pull origin main
    echo "✅ Code updated"
    echo ""
    
    # Update backend
    echo "🔧 Updating backend..."
    cd backend
    npm install
    echo "✅ Dependencies installed"
    echo ""
    
    # Update database schema
    echo "🗄️  Updating database schema..."
    npx prisma db push
    echo "✅ Database schema updated (tech_hunt_participants table created)"
    echo ""
    
    # Update frontend
    echo "🎨 Updating frontend..."
    cd ../frontend
    npm install
    echo "✅ Dependencies installed"
    echo ""
    
    echo "🏗️  Building frontend..."
    npm run build
    echo "✅ Frontend built"
    echo ""
    
    # Restart services
    echo "🔄 Restarting services..."
    cd ..
    pm2 restart all
    echo "✅ Services restarted"
    echo ""
    
    # Wait for services to start
    sleep 3
    
    # Test backend
    echo "🧪 Testing backend..."
    if curl -f http://localhost:8080/test &> /dev/null; then
        echo "✅ Backend is responding"
    else
        echo "❌ Backend not responding"
    fi
    echo ""
    
    # Test Tech Hunt API
    echo "🧪 Testing Tech Hunt API..."
    if curl -f http://localhost:8080/api/tech-hunt/stats &> /dev/null; then
        echo "✅ Tech Hunt API is working"
        curl http://localhost:8080/api/tech-hunt/stats
    else
        echo "❌ Tech Hunt API not responding"
    fi
    echo ""
    
    echo "===================================="
    echo "🎉 Tech Hunt Feature Deployed!"
    echo "===================================="
    echo ""
    echo "📋 What was deployed:"
    echo "  ✅ Database table for participants"
    echo "  ✅ Backend API endpoints"
    echo "  ✅ Frontend reward claim page"
    echo "  ✅ Form validation & duplicate check"
    echo ""
    echo "🌐 Access the page:"
    echo "  https://www.nextute.com/tech-hunt"
    echo ""
    echo "📊 API Endpoints:"
    echo "  POST /api/tech-hunt/claim - Claim reward"
    echo "  GET  /api/tech-hunt/stats - Get statistics"
    echo "  GET  /api/tech-hunt/participants - Get all participants"
    echo ""
    echo "🧪 Test the feature:"
    echo "  1. Visit: https://www.nextute.com/tech-hunt"
    echo "  2. Fill in the form"
    echo "  3. Submit and verify success message"
    echo ""
ENDSSH

echo ""
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo "🔗 Quick Links:"
echo "  Tech Hunt Page: https://www.nextute.com/tech-hunt"
echo "  Stats API: https://www.nextute.com/api/tech-hunt/stats"
echo ""
echo "📝 Next Steps:"
echo "  1. Test the form submission"
echo "  2. Verify duplicate prevention works"
echo "  3. Check participant data in database"
echo "  4. Share the link with participants!"
echo ""
