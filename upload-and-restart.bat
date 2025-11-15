@echo off
echo ========================================
echo Uploading Fixed Backend and Restarting
echo ========================================
echo.

echo Uploading instituteAuthController.js...
scp backend/controllers/instituteAuthController.js root@72.60.218.219:/root/Nextute-main/backend/controllers/

if errorlevel 1 (
    echo ERROR: Failed to upload file
    pause
    exit /b 1
)

echo.
echo Restarting backend on VPS...
ssh root@72.60.218.219 "cd /root/Nextute-main/backend && pm2 restart nextute-backend && sleep 3 && pm2 logs nextute-backend --lines 20 --nostream"

echo.
echo ========================================
echo Done!
echo ========================================
pause
