@echo off
echo ========================================
echo Fix Backend Dependencies and CORS on VPS
echo ========================================
echo.

echo This will:
echo 1. Install missing bcrypt package
echo 2. Fix backend dependencies
echo 3. Rebuild and deploy frontend
echo 4. Fix CORS configuration
echo 5. Restart all services
echo.
pause

echo.
echo Step 1: Uploading fix script to VPS...
echo ========================================
scp fix-backend-and-cors.sh root@72.60.218.219:/root/Nextute-main/
if errorlevel 1 (
    echo ERROR: Failed to upload script to VPS
    echo Make sure you have SSH access to the VPS.
    pause
    exit /b 1
)
echo Script uploaded successfully!

echo.
echo Step 2: Running fix on VPS...
echo ========================================
ssh root@72.60.218.219 "cd /root/Nextute-main && chmod +x fix-backend-and-cors.sh && ./fix-backend-and-cors.sh"

echo.
echo ========================================
echo Fix Complete!
echo ========================================
echo.
echo Your website should now work at:
echo   https://nextute.com
echo   https://www.nextute.com
echo.
echo To verify:
echo 1. Open https://nextute.com in browser
echo 2. Check browser console (F12) for errors
echo 3. Try logging in or browsing institutes
echo.
echo To check backend logs:
echo   ssh root@72.60.218.219
echo   pm2 logs nextute-backend --lines 50
echo.
pause
