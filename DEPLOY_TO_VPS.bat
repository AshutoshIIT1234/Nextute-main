@echo off
echo ========================================
echo Nextute - Deploy to VPS (Complete)
echo ========================================
echo.

echo This script will:
echo 1. Build frontend locally
echo 2. Upload everything to VPS
echo 3. Deploy on VPS automatically
echo.
pause

echo.
echo Step 1: Building Frontend...
echo ========================================
cd frontend
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
echo Frontend built successfully!
cd ..

echo.
echo Step 2: Uploading to VPS...
echo ========================================
echo Uploading files to root@72.60.218.219:/root/Nextute-main/
echo.

scp -r . root@72.60.218.219:/root/Nextute-main/
if errorlevel 1 (
    echo.
    echo ERROR: Upload failed!
    echo.
    echo Make sure:
    echo 1. You have SSH access to the VPS
    echo 2. SCP is installed (comes with Git for Windows)
    echo 3. You can connect: ssh root@72.60.218.219
    echo.
    pause
    exit /b 1
)

echo Upload completed successfully!

echo.
echo Step 3: Deploying on VPS...
echo ========================================
echo Running deployment script on VPS...
echo.

ssh root@72.60.218.219 "cd /root/Nextute-main && chmod +x fix-production-issues.sh && ./fix-production-issues.sh"
if errorlevel 1 (
    echo.
    echo WARNING: Deployment script had issues.
    echo Please SSH to VPS and check logs:
    echo   ssh root@72.60.218.219
    echo   pm2 logs nextute-backend
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Your website should now be live at:
echo https://nextute.com
echo.
echo To verify:
echo 1. Open https://nextute.com in browser
echo 2. Check backend: ssh root@72.60.218.219 "pm2 logs nextute-backend"
echo.
echo If issues persist:
echo   ssh root@72.60.218.219
echo   cd /root/Nextute-main
echo   ./diagnose-production.sh
echo.
pause
