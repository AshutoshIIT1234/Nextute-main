@echo off
echo ========================================
echo Nextute Production Deployment Script
echo ========================================
echo.

echo Step 1: Building Frontend...
cd frontend
call npm install
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
echo Frontend build completed successfully!
echo.

echo Step 2: Preparing Backend...
cd ..\backend
call npm install
if errorlevel 1 (
    echo ERROR: Backend npm install failed!
    pause
    exit /b 1
)
echo Backend dependencies installed!
echo.

echo Step 3: Running Prisma migrations...
call npx prisma generate
call npx prisma migrate deploy
echo Prisma setup completed!
echo.

echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo Next steps for VPS deployment:
echo 1. Upload to VPS: scp -r Nextute-main root@72.60.218.219:/root/
echo 2. SSH to VPS: ssh root@72.60.218.219
echo 3. Restart backend: pm2 restart nextute-backend
echo 4. Copy frontend: sudo cp -r /root/Nextute-main/frontend/dist/* /var/www/nextute/
echo 5. Restart nginx: sudo systemctl restart nginx
echo.
pause
