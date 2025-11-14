@echo off
echo ========================================
echo Fix CORS and Deploy to Production
echo ========================================
echo.

echo This will:
echo 1. Rebuild frontend with correct production URLs
echo 2. Upload to VPS
echo 3. Fix CORS issues automatically
echo.
pause

echo.
echo Step 1: Rebuilding Frontend...
echo ========================================
cd frontend

echo Creating production .env file...
(
echo VITE_API_URL=https://nextute.com/api
echo VITE_BACKEND_URL=https://nextute.com/api
echo VITE_BACKEND_BASE_URL=https://nextute.com
) > .env

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
scp -r . root@72.60.218.219:/root/Nextute-main/
if errorlevel 1 (
    echo ERROR: Upload failed!
    echo Make sure you have SSH access to the VPS.
    pause
    exit /b 1
)

echo.
echo Step 3: Fixing CORS on VPS...
echo ========================================
ssh root@72.60.218.219 "cd /root/Nextute-main && chmod +x fix-cors-production.sh && ./fix-cors-production.sh"

echo.
echo ========================================
echo CORS Fix Complete!
echo ========================================
echo.
echo Your website should now work at:
echo   https://nextute.com
echo   https://www.nextute.com
echo.
echo Both URLs should work without CORS errors.
echo.
echo To verify:
echo 1. Open https://nextute.com in browser
echo 2. Check browser console (F12) for errors
echo 3. Try logging in or browsing institutes
echo.
pause
