#!/bin/bash

# Simple script to start backend on VPS
echo "========================================="
echo "Starting Backend on VPS"
echo "========================================="

# Find backend directory
if [ -d "/root/Nextute-main/backend" ]; then
    BACKEND_DIR="/root/Nextute-main/backend"
elif [ -d "/root/nextute/backend" ]; then
    BACKEND_DIR="/root/nextute/backend"
elif [ -d "backend" ]; then
    BACKEND_DIR="backend"
else
    echo "ERROR: Cannot find backend directory!"
    echo "Please run this from the project root or specify the path"
    exit 1
fi

echo "Backend directory: $BACKEND_DIR"
cd "$BACKEND_DIR" || exit 1

# Kill any existing processes on port 8080
echo ""
echo "Checking for processes on port 8080..."
lsof -ti:8080 | xargs kill -9 2>/dev/null || true

# Stop any PM2 processes
echo "Stopping any existing PM2 processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "ERROR: .env file not found in $BACKEND_DIR"
    exit 1
fi

echo ""
echo "Environment check:"
echo "PORT: $(grep PORT .env | cut -d '=' -f2)"
echo "NODE_ENV: $(grep NODE_ENV .env | cut -d '=' -f2)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo ""
    echo "Installing dependencies..."
    npm install
fi

# Start with PM2
echo ""
echo "Starting backend with PM2..."
pm2 start server.js --name nextute-backend --node-args="--max-old-space-size=512"
pm2 save

echo ""
echo "Waiting 3 seconds for backend to start..."
sleep 3

echo ""
echo "PM2 Status:"
pm2 list

echo ""
echo "Testing backend..."
TEST_RESPONSE=$(curl -s http://localhost:8080/test)
echo "Response: $TEST_RESPONSE"

if echo "$TEST_RESPONSE" | grep -q "running"; then
    echo ""
    echo "✓ Backend is running successfully!"
    echo ""
    echo "Test these URLs:"
    echo "  curl http://localhost:8080/api/institutes/all-institutes"
    echo "  https://www.nextute.com/api/institutes/all-institutes"
else
    echo ""
    echo "✗ Backend may not be responding correctly"
    echo ""
    echo "Check logs with:"
    echo "  pm2 logs nextute-backend"
fi

echo ""
echo "========================================="
echo "Done!"
echo "========================================="
