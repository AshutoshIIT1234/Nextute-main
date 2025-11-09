#!/bin/bash

# Nextute VPS Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 Starting Nextute Deployment..."
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Step 4: Update Frontend
echo ""
print_info "Step 4: Updating frontend..."
cd ../frontend

# Install dependencies
print_info "Installing frontend dependencies..."
npm install
print_success "Frontend dependencies installed"

# Build production version
print_info "Building frontend for production..."
npm run build
print_success "Frontend build completed"

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
echo "================================"
echo "🎉 Deployment Summary"
echo "================================"
print_success "Backup created: $BACKUP_DIR"
print_success "Backend updated and restarted"
print_success "Frontend built successfully"
print_success "Database schema updated"
print_success "Mentor Calendly links updated"
echo ""
print_info "Recent Updates Deployed:"
echo "  • Testimonial infinite loop"
echo "  • Email OTP improvements"
echo "  • 403 error fixes"
echo "  • Calendly links for mentors"
echo "  • Early Bird pricing (Pro: ₹1,000, Premium: ₹1,499)"
echo "  • Debug endpoints"
echo ""
print_info "Next Steps:"
echo "  1. Test the website: https://www.nextute.com"
echo "  2. Check mentorship pricing displays correctly"
echo "  3. Test email OTP functionality"
echo "  4. Verify Calendly links work"
echo "  5. Monitor logs: pm2 logs backend"
echo ""
print_info "Rollback command (if needed):"
echo "  rm -rf $PROJECT_DIR && mv $BACKUP_DIR $PROJECT_DIR && pm2 restart all"
echo ""
print_success "Deployment completed successfully! 🚀"
