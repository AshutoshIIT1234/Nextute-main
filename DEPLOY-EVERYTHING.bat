@echo off
echo =========================================
echo COMPLETE DEPLOYMENT - Backend + Frontend
echo =========================================
echo.
echo This will:
echo 1. Build frontend locally
echo 2. Upload backend fixes to VPS
echo 3. Upload frontend build to VPS
echo 4. Restart backend
echo 5. Update nginx files
echo.
pause

set VPS_IP=72.60.218.219
set VPS_USER=root
set VPS_PATH=/root/Nextute-main

echo.
echo =========================================
echo Step 1: Building Frontend
echo =========================================
cd Nextute-main\frontend
call npm install
call npm run build

if errorlevel 1 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)

echo Frontend build complete!
cd ..\..

echo.
echo =========================================
echo Step 2: Uploading Backend Files
echo =========================================
scp Nextute-main/backend/prisma/seed.js %VPS_USER%@%VPS_IP%:%VPS_PATH%/backend/prisma/
scp Nextute-main/backend/controllers/forgotAndResetPasswordController.js %VPS_USER%@%VPS_IP%:%VPS_PATH%/backend/controllers/

echo.
echo =========================================
echo Step 3: Uploading Frontend Build
echo =========================================
echo Compressing frontend build...
tar -czf frontend-dist.tar.gz -C Nextute-main/frontend/dist .

echo Uploading to VPS...
scp frontend-dist.tar.gz %VPS_USER%@%VPS_IP%:/tmp/

echo Extracting on VPS...
ssh %VPS_USER%@%VPS_IP% "sudo mkdir -p /var/www/nextute && sudo tar -xzf /tmp/frontend-dist.tar.gz -C /var/www/nextute && sudo chown -R www-data:www-data /var/www/nextute && rm /tmp/frontend-dist.tar.gz"

echo Cleaning up local archive...
del frontend-dist.tar.gz

echo.
echo =========================================
echo Step 4: Restarting Backend
echo =========================================
ssh %VPS_USER%@%VPS_IP% "cd %VPS_PATH%/backend && pm2 restart nextute-backend && pm2 save"

echo.
echo =========================================
echo Step 5: Restarting Nginx
echo =========================================
ssh %VPS_USER%@%VPS_IP% "sudo systemctl restart nginx"

echo.
echo =========================================
echo Step 6: Testing Deployment
echo =========================================
timeout /t 3 /nobreak > nul

echo Testing backend...
ssh %VPS_USER%@%VPS_IP% "curl -s http://localhost:8080/test"

echo.
echo =========================================
echo DEPLOYMENT COMPLETE!
echo =========================================
echo.
echo Your site is live at:
echo   https://www.nextute.com
echo.
echo Test backend API:
echo   https://www.nextute.com/api/institutes/all-institutes
echo.
echo Check backend logs:
echo   ssh %VPS_USER%@%VPS_IP%
echo   pm2 logs nextute-backend
echo.
pause
