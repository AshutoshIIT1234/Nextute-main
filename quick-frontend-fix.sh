#!/bin/bash

# Quick Frontend Fix - Run this on VPS

echo "🚀 Quick Frontend Fix"
echo "===================="
echo ""

cd /root/Nextute-main/frontend || exit 1

echo "1. Cleaning..."
rm -rf dist node_modules/.vite

echo "2. Building..."
npm run build

echo "3. Copying to Nginx..."
sudo rm -rf /var/www/nextute/*
sudo cp -r dist/* /var/www/nextute/

echo "4. Setting permissions..."
sudo chown -R www-data:www-data /var/www/nextute
sudo chmod -R 755 /var/www/nextute

echo "5. Reloading Nginx..."
sudo systemctl reload nginx

echo ""
echo "✅ Done! Clear browser cache and refresh."
echo ""
