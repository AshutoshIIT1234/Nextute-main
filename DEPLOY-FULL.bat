@echo off
echo =========================================
echo FULL DEPLOYMENT TO VPS
echo =========================================
echo.
echo This will deploy EVERYTHING:
echo - Backend fixes (bcrypt)
echo - Frontend rebuild
echo - Restart all services
echo.
echo Make sure you have committed your changes!
echo.
pause

set VPS_IP=72.60.218.219
set VPS_USER=root
set VPS_PATH=/root/Nextute-main

echo.
echo Step 1: Uploading deployment script...
echo =========================================
scp deploy-full-update.sh %VPS_USER%@%VPS_IP%:%VPS_PATH%/

echo.
echo Step 2: Uploading backend fixes...
echo =========================================
scp backend/prisma/seed.js %VPS_USER%@%VPS_IP%:%VPS_PATH%/backend/prisma/
scp backend/controllers/forgotAndResetPasswordController.js %VPS_USER%@%VPS_IP%:%VPS_PATH%/backend/controllers/

echo.
echo Step 3: Running full deployment on VPS...
echo =========================================
echo This will take a few minutes...
echo.
ssh %VPS_USER%@%VPS_IP% "cd %VPS_PATH% && chmod +x deploy-full-update.sh && bash deploy-full-update.sh"

echo.
echo =========================================
echo DEPLOYMENT COMPLETE!
echo =========================================
echo.
echo Your site: https://www.nextute.com
echo Backend API: https://www.nextute.com/api/institutes/all-institutes
echo.
pause
