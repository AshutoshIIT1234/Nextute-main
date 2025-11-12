#!/bin/bash

# Fix CORS Issue on Nextute VPS
# This script updates nginx configuration to properly handle CORS

set -e

echo "🔧 Fixing CORS Issue..."
echo "======================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Backup current nginx config
echo ""
print_info "Step 1: Backing up current nginx configuration..."
if [ -f "/etc/nginx/sites-available/nextute" ]; then
    sudo cp /etc/nginx/sites-available/nextute /etc/nginx/sites-available/nextute.backup.$(date +%Y%m%d-%H%M%S)
    print_success "Backup created"
else
    print_info "No existing config found, will create new one"
fi

# Step 2: Copy new nginx config
echo ""
print_info "Step 2: Installing new nginx configuration..."
sudo cp nginx-production.conf /etc/nginx/sites-available/nextute
print_success "New configuration installed"

# Step 3: Test nginx configuration
echo ""
print_info "Step 3: Testing nginx configuration..."
if sudo nginx -t; then
    print_success "Nginx configuration is valid"
else
    print_error "Nginx configuration test failed!"
    print_info "Restoring backup..."
    if [ -f "/etc/nginx/sites-available/nextute.backup.*" ]; then
        sudo cp /etc/nginx/sites-available/nextute.backup.* /etc/nginx/sites-available/nextute
        print_success "Backup restored"
    fi
    exit 1
fi

# Step 4: Enable site (if not already enabled)
echo ""
print_info "Step 4: Enabling site..."
if [ ! -L "/etc/nginx/sites-enabled/nextute" ]; then
    sudo ln -s /etc/nginx/sites-available/nextute /etc/nginx/sites-enabled/nextute
    print_success "Site enabled"
else
    print_info "Site already enabled"
fi

# Step 5: Reload nginx
echo ""
print_info "Step 5: Reloading nginx..."
sudo systemctl reload nginx
print_success "Nginx reloaded"

# Step 6: Verify
echo ""
print_info "Step 6: Verifying fix..."
sleep 2

# Test CORS headers
echo ""
print_info "Testing CORS headers..."
CORS_TEST=$(curl -s -I -H "Origin: https://nextute.com" https://www.nextute.com/api/test | grep -i "access-control-allow-origin" || echo "")

if [ -n "$CORS_TEST" ]; then
    print_success "CORS headers are present!"
    echo "$CORS_TEST"
else
    print_error "CORS headers not found in response"
    print_info "Check nginx error logs: sudo tail -f /var/log/nginx/nextute_error.log"
fi

# Summary
echo ""
echo "======================="
echo "🎉 CORS Fix Complete!"
echo "======================="
print_success "Nginx configuration updated"
print_success "CORS headers configured for both nextute.com and www.nextute.com"
echo ""
print_info "What was fixed:"
echo "  • Added CORS headers to nginx"
echo "  • Handles OPTIONS preflight requests"
echo "  • Allows both nextute.com and www.nextute.com"
echo "  • Passes Origin header to backend"
echo ""
print_info "Test your site:"
echo "  1. Open https://nextute.com"
echo "  2. Open https://www.nextute.com"
echo "  3. Both should work without CORS errors"
echo ""
print_info "Check logs if issues persist:"
echo "  sudo tail -f /var/log/nginx/nextute_error.log"
echo "  pm2 logs backend --lines 50"
echo ""
print_success "Done! 🚀"
