#!/bin/bash

# Nuclear Frontend Update - Forces complete refresh
# VPS: 72.60.218.219

echo "💣 NUCLEAR FRONTEND UPDATE"
echo "=========================="
echo "This will force a complete frontend refresh"
echo ""

VPS_IP="72.60.218.219"
VPS_USER="root"

ssh $VPS_USER@$VPS_IP << 'ENDSSH'
    set -e
    
    echo "📍 Finding project..."
    if [ -d "/root/Nextute-main" ]; then
        cd /root/Nextute-main
    elif [ -d "/home/*/Nextute-main" ]; then
        cd /home/*/Nextute-main
    elif [ -d "/var/www/Nextute-main" ]; then
        cd /var/www/Nextute-main
    else
        echo "❌ Cannot find project"
        exit 1
    fi
    
    echo "✅ Working in: $(pwd)"
    echo ""
    
    # Step 1: Stop all services
    echo "🛑 Step 1: Stopping all services..."
    pm2 stop all || true
    pm2 delete all || true
    echo "✅ Services stopped"
    echo ""
    
    # Step 2: Nuclear clean
    echo "💣 Step 2: Nuclear clean..."
    cd frontend
    rm -rf node_modules
    rm -rf dist
    rm -rf .vite
    rm -rf .cache
    rm -rf package-lock.json
    echo "✅ Frontend completely cleaned"
    echo ""
    
    # Step 3: Force pull latest code
    echo "📥 Step 3: Force pulling latest code..."
    cd ..
    git fetch origin --all
    git reset --hard origin/main
    echo "✅ Latest code pulled"
    echo ""
    
    # Step 4: Fresh install
    echo "📦 Step 4: Fresh install..."
    cd frontend
    npm cache clean --force
    npm install --force
    echo "✅ Dependencies installed"
    echo ""
    
    # Step 5: Build with verbose output
    echo "🏗️  Step 5: Building frontend..."
    NODE_ENV=production npm run build
    echo "✅ Frontend built"
    echo ""
    
    # Step 6: Verify build
    echo "🔍 Step 6: Verifying build..."
    if [ -f "dist/index.html" ]; then
        echo "✅ Build successful"
        echo "📊 Build info:"
        ls -lh dist/index.html
        echo ""
        echo "📁 Build contents:"
        ls -la dist/ | head -15
    else
        echo "❌ Build failed - dist/index.html not found"
        exit 1
    fi
    echo ""
    
    # Step 7: Deploy to nginx
    echo "🌐 Step 7: Deploying to nginx..."
    if [ -d "/var/www/nextute" ]; then
        echo "Backing up current nginx files..."
        sudo mv /var/www/nextute /var/www/nextute-backup-$(date +%Y%m%d-%H%M%S) || true
        
        echo "Creating fresh directory..."
        sudo mkdir -p /var/www/nextute
        
        echo "Copying new build..."
        sudo cp -r dist/* /var/www/nextute/
        
        echo "Setting permissions..."
        sudo chown -R www-data:www-data /var/www/nextute || true
        sudo chmod -R 755 /var/www/nextute
        
        echo "✅ Files deployed to nginx"
        echo "📊 Nginx directory:"
        sudo ls -lh /var/www/nextute/index.html
    else
        echo "⚠️  /var/www/nextute not found, skipping nginx deployment"
    fi
    echo ""
    
    # Step 8: Clear all caches
    echo "🧹 Step 8: Clearing all caches..."
    
    # Clear nginx cache
    if [ -d "/var/cache/nginx" ]; then
        sudo rm -rf /var/cache/nginx/*
        echo "✅ Nginx cache cleared"
    fi
    
    # Clear systemd cache
    sudo systemctl daemon-reload || true
    
    # Restart nginx
    if command -v nginx &> /dev/null; then
        sudo nginx -t && sudo systemctl restart nginx
        echo "✅ Nginx restarted"
    fi
    echo ""
    
    # Step 9: Restart PM2
    echo "🔄 Step 9: Restarting PM2..."
    cd ..
    
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js
    else
        cd backend
        pm2 start server.js --name backend
        cd ..
    fi
    
    pm2 save
    echo "✅ PM2 restarted"
    echo ""
    
    # Step 10: Final verification
    echo "✅ Step 10: Final verification"
    echo "=============================="
    echo ""
    
    pm2 status
    echo ""
    
    echo "🧪 Testing backend..."
    sleep 3
    if curl -f http://localhost:8080/test &> /dev/null; then
        echo "✅ Backend is responding"
    else
        echo "❌ Backend not responding"
    fi
    echo ""
    
    echo "=============================="
    echo "🎉 NUCLEAR UPDATE COMPLETE!"
    echo "=============================="
    echo ""
    echo "⚠️  CRITICAL: You MUST clear your browser cache!"
    echo ""
    echo "How to clear browser cache:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Option 1: Hard Refresh (Fastest)"
    echo "  Windows: Ctrl + Shift + R"
    echo "  Mac:     Cmd + Shift + R"
    echo ""
    echo "Option 2: Clear All Cache"
    echo "  1. Press Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)"
    echo "  2. Select 'Cached images and files'"
    echo "  3. Select 'All time'"
    echo "  4. Click 'Clear data'"
    echo ""
    echo "Option 3: Use Incognito/Private Mode"
    echo "  Chrome/Edge: Ctrl+Shift+N"
    echo "  Firefox:     Ctrl+Shift+P"
    echo ""
    echo "🌐 Then visit: https://www.nextute.com"
    echo ""
    echo "✅ What to verify:"
    echo "  • Testimonials loop infinitely"
    echo "  • Mentorship pricing shows:"
    echo "    - Pro: ₹1,500 → ₹1,000 (Early Bird)"
    echo "    - Premium: ₹1,999 → ₹1,499 (Early Bird)"
    echo "  • Razorpay shows correct amounts (₹1,000 / ₹1,499)"
    echo ""
ENDSSH

echo ""
echo "✅ Nuclear update completed!"
echo ""
echo "🚨 IMPORTANT: Clear your browser cache NOW!"
echo "   Press: Ctrl+Shift+R (or Cmd+Shift+R on Mac)"
echo ""
