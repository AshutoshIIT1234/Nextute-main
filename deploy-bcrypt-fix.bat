@echo off
echo =========================================
echo Deploying bcrypt Fix to VPS
echo =========================================
echo.

set VPS_IP=72.60.218.219
set VPS_USER=root
set VPS_PATH=/root/Nextute-main

echo Step 1: Uploading fixed files...
scp backend/prisma/seed.js %VPS_USER%@%VPS_IP%:%VPS_PATH%/backend/prisma/
scp backend/controllers/forgotAndResetPasswordController.js %VPS_USER%@%VPS_IP%:%VPS_PATH%/backend/controllers/

echo.
echo Step 2: Restarting backend on VPS...
ssh %VPS_USER%@%VPS_IP% "cd %VPS_PATH%/backend && pm2 stop nextute-backend && pm2 start server.js --name nextute-backend && pm2 save"

echo.
echo Step 3: Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Step 4: Testing backend...
ssh %VPS_USER%@%VPS_IP% "curl -s http://localhost:8080/test"

echo.
echo =========================================
echo Done!
echo =========================================
echo.
echo Test your API at:
echo https://www.nextute.com/api/institutes/all-institutes
echo.
pause
