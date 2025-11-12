@echo off
REM Nextute VPS Deployment from Windows
REM This script pushes changes and deploys to VPS

echo ========================================
echo    Nextute VPS Deployment
echo ========================================
echo.

REM Step 1: Commit and push changes
echo [1/4] Committing changes...
git add .
git commit -m "Deploy: Update with cache busting and latest changes" || echo No changes to commit
echo.

echo [2/4] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo ERROR: Failed to push to GitHub
    echo Please check your Git credentials
    pause
    exit /b 1
)
echo.

REM Step 2: Copy deployment script to VPS
echo [3/4] Copying deployment script to VPS...
scp deploy-with-cache-busting.sh root@72.60.218.219:/root/Nextute-main/
if errorlevel 1 (
    echo ERROR: Failed to copy script to VPS
    echo Please check your SSH connection
    pause
    exit /b 1
)
echo.

REM Step 3: Execute deployment on VPS
echo [4/4] Executing deployment on VPS...
echo ========================================
echo.
ssh root@72.60.218.219 "cd /root/Nextute-main && git pull origin main && chmod +x deploy-with-cache-busting.sh && ./deploy-with-cache-busting.sh"

echo.
echo ========================================
echo    Deployment Complete!
echo ========================================
echo.
echo Your website is now updated at: https://www.nextute.com
echo.
echo Cache busting is active - users will see update notification within 5 minutes!
echo.
pause
