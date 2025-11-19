@echo off
echo =========================================
echo COMPLETE BACKEND FIX
echo =========================================
echo.
echo This will:
echo 1. Upload fixed backend files to VPS
echo 2. Fix bcrypt import issues
echo 3. Restart backend
echo 4. Test endpoints
echo.
pause

set VPS_IP=72.60.218.219
set VPS_USER=root
set VPS_PATH=/root/Nextute-main

echo.
echo Step 1: Uploading fixed files...
echo =========================================
scp backend/prisma/seed.js %VPS_USER%@%VPS_IP%:%VPS_PATH%/backend/prisma/seed.js
scp backend/controllers/forgotAndResetPasswordController.js %VPS_USER%@%VPS_IP%:%VPS_PATH%/backend/controllers/forgotAndResetPasswordController.js
scp fix-backend-complete.sh %VPS_USER%@%VPS_IP%:%VPS_PATH%/

echo.
echo Step 2: Running fix script on VPS...
echo =========================================
ssh %VPS_USER%@%VPS_IP% "cd %VPS_PATH% && chmod +x fix-backend-complete.sh && bash fix-backend-complete.sh"

echo.
echo =========================================
echo DONE!
echo =========================================
echo.
echo Your backend should now be working!
echo.
echo Test it at: https://www.nextute.com/api/institutes/all-institutes
echo.
pause
