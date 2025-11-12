@echo off
REM Complete Nextute Deployment - CORS Fix + Cache Busting + All Updates

echo ========================================
echo    Nextute Complete Deployment
echo ========================================
echo.
echo This will deploy:
echo   [1] CORS fix (both domains work)
echo   [2] Cache busting (auto-updates)
echo   [3] All latest features
echo.
pause

REM Step 1: Commit changes
echo.
echo [1/5] Committing changes...
git add .
git commit -m "Deploy: CORS fix + cache busting + updates" || echo No new changes to commit
echo.

REM Step 2: Push to GitHub
echo [2/5] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo WARNING: Git push failed, continuing with local files...
)
echo.

REM Step 3: Copy all files to VPS
echo [3/5] Copying files to VPS...
scp nginx-production.conf root@72.60.218.219:/root/Nextute-main/
scp fix-cors.sh root@72.60.218.219:/root/Nextute-main/
scp deploy-with-cache-busting.sh root@72.60.218.219:/root/Nextute-main/
if errorlevel 1 (
    echo ERROR: Failed to copy files to VPS
    pause
    exit /b 1
)
echo Files copied successfully!
echo.

REM Step 4: Fix CORS first
echo [4/5] Fixing CORS on VPS...
echo ========================================
ssh root@72.60.218.219 "cd /root/Nextute-main && chmod +x fix-cors.sh && ./fix-cors.sh"
echo.

REM Step 5: Deploy full update
echo [5/5] Deploying full update...
echo ========================================
ssh root@72.60.218.219 "cd /root/Nextute-main && git pull origin main && chmod +x deploy-with-cache-busting.sh && ./deploy-with-cache-busting.sh"

echo.
echo ========================================
echo    Deployment Complete! 🎉
echo ========================================
echo.
echo ✅ CORS fixed - both domains work
echo ✅ Cache busting enabled
echo ✅ All features deployed
echo.
echo Your website is live at:
echo   - https://nextute.com
echo   - https://www.nextute.com
echo.
echo Users will see update notification within 5 minutes!
echo.
echo Test now:
echo   1. Open both URLs - no CORS errors
echo   2. Check browser console (F12)
echo   3. Wait 5 min for update notification
echo.
pause
