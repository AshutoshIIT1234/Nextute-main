#!/bin/bash

# Quick update script for VPS - Email fix deployment
# This script updates only the email utilities and restarts the backend

set -e

echo "🔄 Quick Update: Email Fix Deployment"
echo "======================================"

# Commit changes locally
echo "📝 Committing email fix..."
git add backend/utils/emailSender.js backend/utils/sendUpdateEmail.js
git commit -m "Fix: Remove broken Cloudinary logo from emails (404 error fix)" || echo "No changes to commit"

# Push to repository
echo "⬆️  Pushing to repository..."
git push origin main

echo ""
echo "✅ Code pushed to repository!"
echo ""
echo "📋 Now run these commands on your VPS:"
echo "======================================"
echo ""
echo "ssh root@72.60.218.219"
echo ""
echo "cd /root/Nextute-main"
echo "git pull origin main"
echo "pm2 restart nextute-backend"
echo "pm2 logs nextute-backend --lines 50"
echo ""
echo "======================================"
echo "✅ Your email fix will be live after running the above commands!"
