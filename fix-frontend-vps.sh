#!/bin/bash

# Fix Frontend Not Updating on VPS
# VPS IP: 72.60.218.219

echo "🔧 Fixing Frontend Update Issue"
echo "================================"
echo ""

VPS_IP="72.60.218.219"
VPS_USER="root"

echo "Connecting to VPS: $VPS_IP"
echo ""

ssh $VPS_USER@$VPS_IP << 'ENDSSH'
    set -e
    
    # Find project directory
    if [ -d "/root/Nextute-main" ]; then
        cd /root/Nextute-main
    elif [ -d "/home/*/Nextute-main" ]; then
        cd /home/*/Nextute-main
    elif [ -d "/var/www/Nextute-main" ]; then
        cd /var/www/Nextute-main
    else
        echo "❌ Cannot find Nextute-main directory"
        exit 1
    fi
    
    echo "📍 Working in: $(pwd)"
    echo ""
    
    # Step 1: Clean frontend completely
    echo "🧹 Step 1: Cleaning frontend..."
    cd frontend
    rm -rf node_modules
    rm -rf dist
    rm -rf .vite
    echo "✅ Frontend cleaned"
    echo ""
    
    # Step 2: Pull latest code
    echo "📥 Step 2: Pulling latest frontend code..."
    cd ..
    if [ -d ".git" ]; then
        git fetch origin
        git checkout origin/main -- frontend/
        echo "✅ Latest frontend code pulled"
    else
        echo "⚠️  Not a git repo"
    fi
    echo ""
    
    # Step 3: Install dependencies
    echo "📦 Step 3: Installing frontend dependencies..."
    cd frontend
    npm install --force
    echo "✅ Dependencies installed"
    echo ""
    
    # Step 4: Build frontend
    echo "🏗️  Step 4: Building frontend..."
    npm run build
    echo "✅ Frontend built"
    echo ""
    
    # Step 5: Check if using nginx
    echo "🔍 Step 5: Checking for nginx..."
    if command -v nginx &> /dev/null; then
        echo "✅ Nginx found"
        
        # Find nginx web root
        if [ -d "/var/www/nextute" ]; then
            echo "📋 Copying build to /var/www/nextute..."
            sudo cp -r dist/* /var/www/nextute/
            echo "✅ Files copied to nginx"
            
            echo "🔄 Restarting nginx..."
            sudo systemctl restart nginx
            echo "✅ Nginx restarted"
        elif [ -d "/var/www/html" ]; then
            echo "📋 Copying build to /var/www/html..."
            sudo cp -r dist/* /var/www/html/
            echo "✅ Files copied to nginx"
            
            echo "🔄 Restarting nginx..."
            sudo systemctl restart nginx
            echo "✅ Nginx restarted"
        else
            echo "⚠️  Nginx web root not found"
        fi
    else
        echo "ℹ️  Nginx not found, skipping..."
    fi
    echo ""
    
    # Step 6: Restart PM2 (if serving frontend)
    echo "🔄 Step 6: Restarting PM2..."
    cd ..
    if command -v pm2 &> /dev/null; then
        pm2 restart all
        echo "✅ PM2 restarted"
        pm2 status
    else
        echo "⚠️  PM2 not found"
    fi
    echo ""
    
    # Step 7: Clear caches
    echo "🧹 Step 7: Clearing caches..."
    
    # Clear nginx cache if exists
    if [ -d "/var/cache/nginx" ]; then
        sudo rm -rf /var/cache/nginx/*
        echo "✅ Nginx cache cleared"
    fi
    
    # Clear PM2 logs
    if command -v pm2 &> /dev/null; then
        pm2 flush
        echo "✅ PM2 logs cleared"
    fi
    echo ""
    
    # Step 8: Verification
    echo "✅ Step 8: Verification"
    echo "================================"
    echo ""
    
    echo "📊 Frontend build info:"
    ls -lh frontend/dist/index.html
    echo ""
    
    echo "📁 Build contents:"
    ls -la frontend/dist/ | head -10
    echo ""
    
    if [ -d "/var/www/nextute" ]; then
        echo "📁 Nginx directory:"
        ls -lh /var/www/nextute/index.html
    fi
    echo ""
    
    echo "================================"
    echo "🎉 Frontend Update Complete!"
    echo "================================"
    echo ""
    echo "⚠️  IMPORTANT: Clear your browser cache!"
    echo ""
    echo "How to clear browser cache:"
    echo "  • Chrome/Edge: Ctrl+Shift+Delete"
    echo "  • Firefox: Ctrl+Shift+Delete"
    echo "  • Safari: Cmd+Option+E"
    echo ""
    echo "OR use Hard Refresh:"
    echo "  • Windows: Ctrl+Shift+R or Ctrl+F5"
    echo "  • Mac: Cmd+Shift+R"
    echo ""
    echo "OR test in Incognito/Private mode"
    echo ""
    echo "🌐 Visit: https://www.nextute.com"
    echo ""
ENDSSH

echo ""
echo "✅ Frontend fix script completed!"
echo ""
echo "📋 Next steps:"
echo "  1. Hard refresh your browser: Ctrl+Shift+R"
echo "  2. Or open in incognito/private mode"
echo "  3. Visit: https://www.nextute.com"
echo "  4. Check mentorship pricing"
echo ""
