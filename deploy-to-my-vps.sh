#!/bin/bash

# Nextute VPS Deployment Script
# VPS IP: 72.60.218.219

echo "🚀 Deploying to VPS: 72.60.218.219"
echo "===================================="
echo ""

# Configuration
VPS_IP="72.60.218.219"
VPS_USER="root"  # Change if different
PROJECT_PATH="/root/Nextute-main"  # Change to your actual path

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if we can connect
print_info "Testing SSH connection..."
if ssh -o ConnectTimeout=5 $VPS_USER@$VPS_IP "echo 'Connected'" &> /dev/null; then
    print_success "SSH connection successful"
else
    print_error "Cannot connect to VPS. Please check:"
    echo "  1. VPS IP is correct: $VPS_IP"
    echo "  2. SSH key is configured"
    echo "  3. VPS is running"
    exit 1
fi

# Deploy
print_info "Starting deployment..."
echo ""

ssh $VPS_USER@$VPS_IP << 'ENDSSH'
    set -e
    
    echo "📍 Current location:"
    pwd
    
    echo ""
    echo "🔍 Finding Nextute project..."
    
    # Try common locations
    if [ -d "/root/Nextute-main" ]; then
        cd /root/Nextute-main
    elif [ -d "/home/*/Nextute-main" ]; then
        cd /home/*/Nextute-main
    elif [ -d "/var/www/Nextute-main" ]; then
        cd /var/www/Nextute-main
    else
        echo "❌ Cannot find Nextute-main directory"
        echo "Please specify the correct path"
        exit 1
    fi
    
    echo "✅ Found project at: $(pwd)"
    echo ""
    
    # Create backup
    echo "💾 Creating backup..."
    cp -r . ../Nextute-backup-$(date +%Y%m%d-%H%M%S)
    echo "✅ Backup created"
    echo ""
    
    # Pull latest code
    echo "📥 Pulling latest code..."
    if [ -d ".git" ]; then
        git fetch origin
        git pull origin main
        echo "✅ Code updated"
    else
        echo "⚠️  Not a git repository, skipping..."
    fi
    echo ""
    
    # Update backend
    echo "🔧 Updating backend..."
    cd backend
    npm install
    echo "✅ Backend dependencies installed"
    
    echo "🗄️  Updating database..."
    npx prisma db push
    echo "✅ Database schema updated"
    
    echo "👥 Updating mentors..."
    node prisma/seed-mentors.js
    echo "✅ Mentors updated with Calendly links"
    echo ""
    
    # Update frontend
    echo "🎨 Updating frontend..."
    cd ../frontend
    npm install
    echo "✅ Frontend dependencies installed"
    
    echo "🏗️  Building frontend..."
    npm run build
    echo "✅ Frontend built"
    echo ""
    
    # Restart services
    echo "🔄 Restarting services..."
    cd ..
    
    if command -v pm2 &> /dev/null; then
        pm2 restart all
        echo "✅ PM2 services restarted"
        echo ""
        echo "📊 PM2 Status:"
        pm2 status
    else
        echo "⚠️  PM2 not found, please restart services manually"
    fi
    echo ""
    
    # Verify
    echo "🧪 Testing backend..."
    sleep 3
    if curl -f http://localhost:8080/test &> /dev/null; then
        echo "✅ Backend is responding"
        curl http://localhost:8080/test
    else
        echo "❌ Backend not responding"
        echo "Check logs with: pm2 logs backend"
    fi
    echo ""
    
    # Check mentors API
    echo "🧪 Testing mentors API..."
    if curl -f http://localhost:8080/api/mentorship/mentors &> /dev/null; then
        echo "✅ Mentors API is working"
    else
        echo "❌ Mentors API not responding"
    fi
    echo ""
    
    echo "===================================="
    echo "🎉 Deployment Complete!"
    echo "===================================="
    echo ""
    echo "📋 What was deployed:"
    echo "  ✅ Testimonial infinite loop"
    echo "  ✅ Email OTP improvements"
    echo "  ✅ 403 error fixes"
    echo "  ✅ Calendly links for mentors"
    echo "  ✅ Early Bird pricing (Pro: ₹1,000, Premium: ₹1,499)"
    echo "  ✅ Debug endpoints"
    echo ""
    echo "🌐 Test your website:"
    echo "  https://www.nextute.com"
    echo ""
    echo "📊 Monitor logs:"
    echo "  pm2 logs backend"
    echo ""
ENDSSH

print_success "Deployment script completed!"
echo ""
print_info "Next steps:"
echo "  1. Visit: https://www.nextute.com"
echo "  2. Check mentorship pricing"
echo "  3. Test testimonials loop"
echo "  4. Test signup/login"
echo ""
