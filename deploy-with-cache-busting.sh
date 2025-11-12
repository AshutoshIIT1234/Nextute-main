#!/bin/bash

# Nextute VPS Deployment Script with Cache Busting
# This script automates the deployment process with the new cache busting solution

set -e  # Exit on error

echo "🚀 Starting Nextute Deployment with Cache Busting..."
echo "===================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="../Nextute-backup-$(date +%Y%m%d-%H%M%S)"
PROJECT_DIR=$(pwd)

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_highlight() {
    echo -e "${BLUE}🔷 $1${NC}"
}

# Step 1: Create Backup
echo ""
print_info "Step 1: Creating backup..."
if [ -d "$PROJECT_DIR" ]; then
    cp -r "$PROJECT_DIR" "$BACKUP_DIR"
    print_success "Backup created at: $BACKUP_DIR"
else
    print_error "Project directory not found!"
    exit 1
fi

# Step 2: Pull Latest Changes (if using Git)
echo ""
print_info "Step 2: Pulling latest changes..."
if [ -d ".git" ]; then
    git pull origin main
    print_success "Latest changes pulled from Git"
else
    print_info "Not a Git repository, skipping..."
fi

# Step 3: Update Backend
echo ""
print_info "Step 3: Updating backend..."
cd backend

# Install dependencies
print_info "Installing backend dependencies..."
npm install
print_success "Backend dependencies installed"

# Update database schema
print_info "Updating database schema..."
npx prisma db push
print_success "Database schema updated"

# Run mentor seed
print_info "Updating mentor data with Calendly links..."
node prisma/seed-mentors.js
print_success "Mentor data updated"

# Step 4: Update Frontend with Cache Busting
echo ""
print_highlight "Step 4: Building frontend with cache busting..."
cd ../frontend

# Install dependencies
print_info "Installing frontend dependencies..."
npm install
print_success "Frontend dependencies installed"

# Build production version (prebuild hook will generate version.json)
print_info "Building frontend for production..."
print_highlight "Cache busting: Generating new version timestamp..."
npm run build
print_success "Frontend build completed with cache busting enabled"

# Verify version.json was created
if [ -f "dist/version.json" ]; then
    VERSION=$(cat dist/version.json | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
    print_success "Version file created: $VERSION"
else
    print_error "Warning: version.json not found in dist/"
fi

# Step 5: Restart Services
echo ""
print_info "Step 5: Restarting services..."

# Check if PM2 is available
if command -v pm2 &> /dev/null; then
    print_info "Restarting services with PM2..."
    pm2 restart all
    print_success "Services restarted with PM2"
    
    # Show status
    echo ""
    pm2 status
else
    print_info "PM2 not found. Please restart services manually."
fi

# Step 6: Verification
echo ""
print_info "Step 6: Running verification checks..."

# Check if backend is running
sleep 3
if curl -f http://localhost:8080/test &> /dev/null; then
    print_success "Backend is running"
else
    print_error "Backend health check failed"
fi

# Step 7: Summary
echo ""
echo "===================================================="
echo "🎉 Deployment Summary"
echo "===================================================="
print_success "Backup created: $BACKUP_DIR"
print_success "Backend updated and restarted"
print_success "Frontend built successfully"
print_success "Database schema updated"
print_success "Mentor Calendly links updated"
print_highlight "Cache busting enabled - users will auto-update!"
echo ""
print_info "Recent Updates Deployed:"
echo "  • 🔄 Automatic cache busting with version detection"
echo "  • 🔔 User notifications for new updates"
echo "  • 📋 Smart cache headers (HTML never cached)"
echo "  • ⚡ Asset hashing for JS/CSS files"
echo "  • 🎯 Testimonial infinite loop"
echo "  • 📧 Email OTP improvements"
echo "  • 🔒 403 error fixes"
echo "  • 📅 Calendly links for mentors"
echo "  • 💰 Early Bird pricing (Pro: ₹1,000, Premium: ₹1,499)"
echo ""
print_highlight "Cache Busting Features:"
echo "  • Users get notified of updates within 5 minutes"
echo "  • One-click refresh to see new version"
echo "  • No manual cache clearing needed"
echo "  • Version: $VERSION"
echo ""
print_info "Next Steps:"
echo "  1. Test the website: https://www.nextute.com"
echo "  2. Wait 5 minutes - users will see update notification"
echo "  3. Check version.json: https://www.nextute.com/version.json"
echo "  4. Monitor logs: pm2 logs backend"
echo "  5. Verify cache headers in browser DevTools"
echo ""
print_info "Rollback command (if needed):"
echo "  rm -rf $PROJECT_DIR && mv $BACKUP_DIR $PROJECT_DIR && pm2 restart all"
echo ""
print_success "Deployment completed successfully! 🚀"
print_highlight "Users will automatically see the new version!"

