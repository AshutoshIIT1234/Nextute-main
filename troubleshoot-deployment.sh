#!/bin/bash

# Troubleshooting script for VPS deployment issues

echo "🔍 Nextute VPS Deployment Troubleshooting"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check 1: Git status
echo "1. Checking Git status..."
if [ -d ".git" ]; then
    print_info "Current branch:"
    git branch --show-current
    
    print_info "Latest commit:"
    git log -1 --oneline
    
    print_info "Uncommitted changes:"
    git status --short
    
    print_info "Remote status:"
    git fetch origin
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})
    
    if [ $LOCAL = $REMOTE ]; then
        print_success "Local is up to date with remote"
    else
        print_error "Local is behind remote. Run: git pull origin main"
    fi
else
    print_error "Not a git repository"
fi

echo ""
echo "2. Checking PM2 processes..."
if command -v pm2 &> /dev/null; then
    pm2 list
    echo ""
    print_info "Backend logs (last 20 lines):"
    pm2 logs backend --lines 20 --nostream
else
    print_error "PM2 not found"
fi

echo ""
echo "3. Checking backend build..."
if [ -d "backend/node_modules" ]; then
    print_success "Backend node_modules exists"
else
    print_error "Backend node_modules missing. Run: cd backend && npm install"
fi

echo ""
echo "4. Checking frontend build..."
if [ -d "frontend/dist" ]; then
    print_success "Frontend dist folder exists"
    print_info "Build date:"
    ls -la frontend/dist/index.html | awk '{print $6, $7, $8}'
else
    print_error "Frontend dist missing. Run: cd frontend && npm run build"
fi

echo ""
echo "5. Checking database connection..."
cd backend
if npx prisma db pull --force &> /dev/null; then
    print_success "Database connection working"
else
    print_error "Database connection failed. Check DATABASE_URL in .env"
fi

echo ""
echo "6. Checking for calendly_link column..."
if npx prisma db execute --stdin <<< "SELECT calendly_link FROM mentors LIMIT 1;" &> /dev/null; then
    print_success "calendly_link column exists"
else
    print_error "calendly_link column missing. Run: npx prisma db push"
fi

echo ""
echo "7. Checking environment variables..."
if [ -f ".env" ]; then
    print_success ".env file exists"
    print_info "Checking required variables:"
    
    if grep -q "DATABASE_URL" .env; then
        print_success "DATABASE_URL present"
    else
        print_error "DATABASE_URL missing"
    fi
    
    if grep -q "EMAIL_USER" .env; then
        print_success "EMAIL_USER present"
    else
        print_error "EMAIL_USER missing"
    fi
    
    if grep -q "TOKEN_KEY" .env; then
        print_success "TOKEN_KEY present"
    else
        print_error "TOKEN_KEY missing"
    fi
else
    print_error ".env file missing"
fi

cd ..

echo ""
echo "8. Checking ports..."
print_info "Port 8080 status:"
if lsof -i :8080 &> /dev/null; then
    print_success "Port 8080 is in use (backend running)"
    lsof -i :8080
else
    print_error "Port 8080 is not in use (backend not running)"
fi

echo ""
echo "9. Testing backend health..."
if curl -f http://localhost:8080/test &> /dev/null; then
    print_success "Backend is responding"
    curl http://localhost:8080/test
else
    print_error "Backend is not responding"
fi

echo ""
echo "=========================================="
echo "🔧 Recommended Actions:"
echo "=========================================="
echo ""

# Provide recommendations based on checks
if [ ! -d "frontend/dist" ]; then
    echo "1. Rebuild frontend:"
    echo "   cd frontend && npm install && npm run build"
    echo ""
fi

if ! pm2 list | grep -q "online"; then
    echo "2. Restart PM2 services:"
    echo "   pm2 restart all"
    echo ""
fi

echo "3. Force update everything:"
echo "   cd backend && npm install && npx prisma db push && node prisma/seed-mentors.js"
echo "   cd ../frontend && npm install && npm run build"
echo "   pm2 restart all"
echo ""

echo "4. Check logs for errors:"
echo "   pm2 logs backend --lines 50"
echo ""

echo "5. Clear cache and restart:"
echo "   pm2 delete all"
echo "   pm2 start ecosystem.config.js"
echo ""

echo "=========================================="
