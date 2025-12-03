@echo off
REM Make Tech Hunt Live - Deploy to VPS

echo ========================================
echo   MAKING TECH HUNT LIVE!
echo ========================================
echo.

echo This will deploy Tech Hunt to your VPS
echo and make it live immediately.
echo.

set /p confirm="Continue? (y/n): "
if /i not "%confirm%"=="y" (
    echo Cancelled.
    exit /b
)

echo.
echo Connecting to VPS and deploying...
echo.

REM Run the deployment script on VPS via SSH
ssh root@72.60.218.219 "cd /root/Nextute-main && chmod +x make-tech-hunt-live.sh && ./make-tech-hunt-live.sh"

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Visit: https://www.nextute.com/tech-hunt
echo.
echo The form is now LIVE and accepting claims!
echo.
pause
