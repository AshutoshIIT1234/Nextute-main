#!/bin/bash

# Force update script - Use when normal deployment doesn't work

set -e

echo "🔥 FORCE UPDATE - Nextute VPS"
echo "=============================="
echo ""
echo "⚠️  WARNING: This will force rebuild everything"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Step 1: Stop all services
echo ""
print_info "Step 1: Stopping all PM2 processes..."
pm2 stop all || true
pm2 delete all || true
print_success "Services stopped"

# Step 2: Clean node_modules and builds
echo ""
print_info "Step 2: Cleaning old builds..."
rm -rf backend/node_modules
rm -rf frontend/node_modules
rm -rf frontend/dist
print_success "Old builds cleaned"

# Step 3: Pull latest code
echo ""
print_info "Step 3: Pulling latest code..."
if [ -d ".git" ]; then
    git fetch origin
    git reset --hard origin/main
    print_success "Code updated from Git"
else
    print_info "Not a git repo, skipping..."
fi

# Step 4: Install backend
echo ""
print_info "Step 4: Installing backend dependencies..."
cd backend
npm install --force
print_success "Backend dependencies installed"

# Step 5: Update database
echo ""
print_info "Step 5: Updating database schema..."
npx prisma generate
npx prisma db push --accept-data-loss
print_success "Database schema updated"

# Step 6: Seed mentors
echo ""
print_info "Step 6: Updating mentor data..."
node prisma/seed-mentors.js
print_success "Mentor data updated"

# Step 7: Install frontend
echo ""
print_info "Step 7: Installing frontend dependencies..."
cd ../frontend
npm install --force
print_success "Frontend dependencies installed"

# Step 8: Build frontend
echo ""
print_info "Step 8: Building frontend..."
npm run build
print_success "Frontend built"

# Step 9: Start services
echo ""
print_info "Step 9: Starting services..."
cd ..

# Check if ecosystem.config.js exists
if [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js
else
    # Manual start
    cd backend
    pm2 start server.js --name backend
    cd ..
fi

pm2 save
print_success "Services started"

# Step 10: Verify
echo ""
print_info "Step 10: Verifying deployment..."
sleep 5

pm2 status

echo ""
print_info "Testing backend..."
if curl -f http://localhost:8080/test &> /dev/null; then
    print_success "Backend is responding!"
    curl http://localhost:8080/test
else
    echo "❌ Backend not responding. Check logs:"
    echo "   pm2 logs backend"
fi

echo ""
echo "=============================="
echo "🎉 Force Update Complete!"
echo "=============================="
echo ""
echo "Next steps:"
echo "1. Check logs: pm2 logs backend"
echo "2. Monitor: pm2 monit"
echo "3. Test website: https://www.nextute.com"
echo ""
echo "If issues persist:"
echo "1. Check .env file has correct values"
echo "2. Verify DATABASE_URL is correct"
echo "3. Check firewall/port settings"
echo "4. Review nginx configuration (if applicable)"
echo ""
