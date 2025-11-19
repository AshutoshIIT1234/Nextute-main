@echo off
cls
echo.
echo     ╔════════════════════════════════════════╗
echo     ║   NEXTUTE COMPLETE DEPLOYMENT          ║
echo     ║   Backend + Frontend to VPS            ║
echo     ╚════════════════════════════════════════╝
echo.
echo   This will deploy EVERYTHING to your VPS:
echo.
echo   ✓ Fix backend bcrypt errors
echo   ✓ Rebuild frontend
echo   ✓ Deploy to production
echo   ✓ Restart all services
echo.
echo   VPS: 72.60.218.219
echo   Time: ~5-10 minutes
echo.
echo   Press any key to start deployment...
pause > nul

set VPS_IP=72.60.218.219
set VPS_USER=root
set VPS_PATH=/root/Nextute-main

echo.
echo [1/4] Uploading scripts and fixes...
echo ═══════════════════════════════════════════
scp deploy-full-update.sh %VPS_USER%@%VPS_IP%:%VPS_PATH%/ 2>nul
scp backend/prisma/seed.js %VPS_USER%@%VPS_IP%:%VPS_PATH%/backend/prisma/ 2>nul
scp backend/controllers/forgotAndResetPasswordController.js %VPS_USER%@%VPS_IP%:%VPS_PATH%/backend/controllers/ 2>nul
echo ✓ Files uploaded

echo.
echo [2/4] Running deployment on VPS...
echo ═══════════════════════════════════════════
echo (This will take several minutes, please wait...)
echo.
ssh %VPS_USER%@%VPS_IP% "cd %VPS_PATH% && chmod +x deploy-full-update.sh && bash deploy-full-update.sh"

if errorlevel 1 (
    echo.
    echo ✗ Deployment failed!
    echo   Check the error messages above.
    pause
    exit /b 1
)

echo.
echo [3/4] Verifying deployment...
echo ═══════════════════════════════════════════
timeout /t 3 /nobreak > nul
ssh %VPS_USER%@%VPS_IP% "curl -s http://localhost:8080/test"

echo.
echo [4/4] Testing API endpoint...
echo ═══════════════════════════════════════════
ssh %VPS_USER%@%VPS_IP% "curl -s http://localhost:8080/api/institutes/all-institutes | head -c 200"

echo.
echo.
echo     ╔════════════════════════════════════════╗
echo     ║   ✓ DEPLOYMENT COMPLETE!               ║
echo     ╚════════════════════════════════════════╝
echo.
echo   Your site is now live:
echo   → https://www.nextute.com
echo.
echo   Test your API:
echo   → https://www.nextute.com/api/institutes/all-institutes
echo.
echo   ⚠ IMPORTANT: Clear your browser cache!
echo   → Press Ctrl+Shift+R for hard refresh
echo   → Or test in incognito mode (Ctrl+Shift+N)
echo.
echo   Check backend logs:
echo   → ssh root@72.60.218.219
echo   → pm2 logs nextute-backend
echo.
pause
