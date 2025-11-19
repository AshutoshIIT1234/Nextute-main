@echo off
echo =========================================
echo Upload and Start Backend on VPS
echo =========================================
echo.

set VPS_IP=72.60.218.219
set VPS_USER=root
set VPS_PATH=/root/Nextute-main

echo Step 1: Uploading start script to VPS...
scp start-backend-now.sh %VPS_USER%@%VPS_IP%:%VPS_PATH%/

echo.
echo Step 2: Making script executable and running it...
ssh %VPS_USER%@%VPS_IP% "cd %VPS_PATH% && chmod +x start-backend-now.sh && bash start-backend-now.sh"

echo.
echo =========================================
echo Done!
echo =========================================
echo.
echo Your backend should now be running at:
echo https://www.nextute.com/api/institutes/all-institutes
echo.
pause
