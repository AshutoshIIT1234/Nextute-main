#!/bin/bash

echo "=== Backend Diagnostics for VPS ==="
echo ""

# Check if backend process is running
echo "1. Checking if backend is running on port 8080..."
if command -v lsof &> /dev/null; then
    lsof -i :8080
elif command -v netstat &> /dev/null; then
    netstat -tulpn | grep :8080
else
    echo "Neither lsof nor netstat available, checking with ss..."
    ss -tulpn | grep :8080
fi

echo ""
echo "2. Checking PM2 processes..."
pm2 list

echo ""
echo "3. Testing backend health endpoint..."
curl -v http://localhost:8080/test

echo ""
echo "4. Testing all-institutes endpoint..."
curl -v http://localhost:8080/api/institutes/all-institutes

echo ""
echo "5. Checking backend logs (last 50 lines)..."
pm2 logs backend --lines 50 --nostream

echo ""
echo "6. Checking nginx status..."
systemctl status nginx

echo ""
echo "7. Testing nginx proxy..."
curl -v http://localhost/api/institutes/all-institutes

echo ""
echo "=== Diagnostics Complete ==="
