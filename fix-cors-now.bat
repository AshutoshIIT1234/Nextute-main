@echo off
REM Fix CORS Issue on VPS - Quick Deploy

echo ========================================
echo    Fix CORS Issue on Nextute VPS
echo ========================================
echo.

echo This will fix the CORS error:
echo "Access to XMLHttpRequest has been blocked by CORS policy"
echo.
echo The fix allows both:
echo   - https://nextute.com
echo   - https://www.nextute.com
echo.
pause

REM Step 1: Copy files to VPS
echo.
echo [1/2] Copying fix files to VPS...
scp nginx-production.conf root@72.60.218.219:/root/Nextute-main/
scp fix-cors.sh root@72.60.218.219:/root/Nextute-main/
if errorlevel 1 (
    echo ERROR: Failed to copy files to VPS
    pause
    exit /b 1
)
echo Files copied successfully!

REM Step 2: Execute fix on VPS
echo.
echo [2/2] Executing CORS fix on VPS...
echo ========================================
ssh root@72.60.218.219 "cd /root/Nextute-main && chmod +x fix-cors.sh && ./fix-cors.sh"

echo.
echo ========================================
echo    CORS Fix Complete!
echo ========================================
echo.
echo Your website should now work on both:
echo   - https://nextute.com
echo   - https://www.nextute.com
echo.
echo Test it now in your browser!
echo.
pause
