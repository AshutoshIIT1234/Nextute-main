#!/bin/bash

# Complete VPS Update Script
# Updates EVERYTHING: Backend + Frontend + All Changes
# VPS: 72.60.218.219

echo "🚀 COMPLETE VPS UPDATE"
echo "======================"
echo "This will update ALL changes:"
echo "  • Backend CORS fix"
echo "  • Frontend pricing updates"
echo "  • Razorpay pricing fix"
echo "  • Early Bird popup"
echo "  • All other changes"
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
    
    # ============================================
    # STEP 1: STOP ALL SERVICES
    # ============================================
    echo "🛑 STEP 1: Stopping all services..."
    pm2 stop all || true
    echo "✅ Services stopped"
    echo ""
    
    # ============================================
    # STEP 2: BACKUP CURRENT VERSION
    # ============================================
    echo "💾 STEP 2: Creating backup..."
    BACKUP_DIR="../Nextute-backup-$(date +%Y%m%d-%H%M%S)"
    cp -r . "$BACKUP_DIR"
    echo "✅ Backup created at: $BACKUP_DIR"
    echo ""
    
    # ============================================
    # STEP 3: PULL LATEST CODE
    # ============================================
    echo "📥 STEP 3: Pulling latest code..."
    git fetch origin --all
    git reset --hard origin/main
    echo "✅ Latest code pulled"
    echo ""
    echo "📊 Latest commit:"
    git log -1 --oneline
    echo ""
    
    # ============================================
    # STEP 4: UPDATE BACKEND
    # ============================================
    echo "🔧 STEP 4: Updating backend..."
    cd backend
    
    echo "  → Installing dependencies..."
    npm install
    
    echo "  → Updating database..."
    npx prisma db push || true
    
    echo "  → Updating mentors..."
    node prisma/seed-mentors.js || true
    
    echo "✅ Backend updated"
    echo ""
    
    # ============================================
    # STEP 5: NUCLEAR FRONTEND UPDATE
    # ============================================
    echo "💣 STEP 5: Nuclear frontend update..."
    cd ../frontend
    
    echo "  → Cleaning everything..."
    rm -rf node_modules
    rm -rf dist
    rm -rf .vite
    rm -rf .cache
    rm -rf package-lock.json
    
    echo "  → Fresh install..."
    npm cache clean --force
    npm install --force
    
    echo "  → Building frontend..."
    NODE_ENV=production npm run build
    
    echo "✅ Frontend built"
    echo ""
    
    # ============================================
    # STEP 6: VERIFY BUILD
    # ============================================
    echo "🔍 STEP 6: Verifying build..."
    if [ -f "dist/index.html" ]; then
        echo "✅ Build successful"
        echo "📊 Build info:"
        ls -lh dist/index.html
        echo ""
        
        # Check for new pricing in build
        echo "🔍 Checking for updated pricing..."
        if grep -r "1000" dist/assets/*.js > /dev/null 2>&1; then
            echo "✅ Found 1000 (Pro Plan pricing)"
        fi
        if grep -r "1499" dist/assets/*.js > /dev/null 2>&1; then
            echo "✅ Found 1499 (Premium Plan pricing)"
        fi
    else
        echo "❌ Build failed"
        exit 1
    fi
    echo ""
    
    # ============================================
    # STEP 7: DEPLOY TO NGINX
    # ============================================
    echo "🌐 STEP 7: Deploying to nginx..."
    if [ -d "/var/www/nextute" ]; then
        echo "  → Backing up current nginx files..."
        sudo mv /var/www/nextute /var/www/nextute-backup-$(date +%Y%m%d-%H%M%S) || true
        
        echo "  → Creating fresh directory..."
        sudo mkdir -p /var/www/nextute
        
        echo "  → Copying new build..."
        sudo cp -r dist/* /var/www/nextute/
        
        echo "  → Setting permissions..."
        sudo chown -R www-data:www-data /var/www/nextute || true
        sudo chmod -R 755 /var/www/nextute
        
        echo "✅ Files deployed to nginx"
        echo "📊 Nginx directory:"
        sudo ls -lh /var/www/nextute/index.html
    else
        echo "⚠️  /var/www/nextute not found"
        echo "  Creating directory..."
        sudo mkdir -p /var/www/nextute
        sudo cp -r dist/* /var/www/nextute/
        sudo chown -R www-data:www-data /var/www/nextute || true
        sudo chmod -R 755 /var/www/nextute
        echo "✅ Files deployed"
    fi
    echo ""
    
    # ============================================
    # STEP 8: CLEAR ALL CACHES
    # ============================================
    echo "🧹 STEP 8: Clearing all caches..."
    
    # Clear nginx cache
    if [ -d "/var/cache/nginx" ]; then
        sudo rm -rf /var/cache/nginx/*
        echo "✅ Nginx cache cleared"
    fi
    
    # Reload systemd
    sudo systemctl daemon-reload || true
    
    # Restart nginx
    if command -v nginx &> /dev/null; then
        echo "  → Testing nginx config..."
        sudo nginx -t
        echo "  → Restarting nginx..."
        sudo systemctl restart nginx
        echo "✅ Nginx restarted"
    fi
    echo ""
    
    # ============================================
    # STEP 9: START SERVICES
    # ============================================
    echo "🔄 STEP 9: Starting services..."
    cd ..
    
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js
    else
        cd backend
        pm2 start server.js --name backend
        cd ..
    fi
    
    pm2 save
    echo "✅ Services started"
    echo ""
    
    # ============================================
    # STEP 10: VERIFICATION
    # ============================================
    echo "✅ STEP 10: Final verification"
    echo "=============================="
    echo ""
    
    echo "📊 PM2 Status:"
    pm2 status
    echo ""
    
    echo "🧪 Testing backend..."
    sleep 3
    if curl -f http://localhost:8080/test &> /dev/null; then
        echo "✅ Backend is responding"
        curl http://localhost:8080/test
    else
        echo "❌ Backend not responding"
        echo "Check logs: pm2 logs backend"
    fi
    echo ""
    
    echo "=============================="
    echo "🎉 UPDATE COMPLETE!"
    echo "=============================="
    echo ""
    echo "📋 What was updated:"
    echo "  ✅ Backend CORS fix (allows both nextute.com and www.nextute.com)"
    echo "  ✅ Frontend pricing (Pro: ₹1,000, Premium: ₹1,499)"
    echo "  ✅ Razorpay pricing (matches displayed prices)"
    echo "  ✅ Early Bird popup (with GIFs)"
    echo "  ✅ Testimonial infinite loop"
    echo "  ✅ Email improvements"
    echo "  ✅ Calendly links"
    echo "  ✅ All other changes"
    echo ""
    echo "⚠️  CRITICAL: CLEAR YOUR BROWSER CACHE!"
    echo ""
    echo "How to clear browser cache:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "1. Hard Refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)"
    echo "2. Clear Cache: Ctrl+Shift+Delete → Clear 'Cached images and files'"
    echo "3. Incognito Mode: Ctrl+Shift+N (test in private window)"
    echo ""
    echo "🌐 Then visit: https://www.nextute.com"
    echo ""
    echo "✅ What to verify:"
    echo "  • No CORS errors in console"
    echo "  • Mentorship pricing shows Early Bird offers"
    echo "  • Razorpay shows correct amounts (₹1,000 / ₹1,499)"
    echo "  • Early Bird popup appears after 2 seconds"
    echo "  • Testimonials loop infinitely"
    echo ""
    echo "📊 Rollback command (if needed):"
    echo "  pm2 stop all"
    echo "  cd /root"
    echo "  rm -rf Nextute-main"
    echo "  mv $BACKUP_DIR Nextute-main"
    echo "  cd Nextute-main"
    echo "  pm2 restart all"
    echo ""
ENDSSH

echo ""
echo "✅ Complete VPS update finished!"
echo ""
echo "🚨 IMPORTANT: Clear your browser cache NOW!"
echo "   Press: Ctrl+Shift+R (or Cmd+Shift+R on Mac)"
echo ""
echo "📊 Check these:"
echo "  1. Visit https://www.nextute.com"
echo "  2. Open DevTools (F12) → Console"
echo "  3. Should see NO CORS errors"
echo "  4. Go to Mentorship page"
echo "  5. Check pricing displays correctly"
echo "  6. Wait 2 seconds for Early Bird popup"
echo ""
