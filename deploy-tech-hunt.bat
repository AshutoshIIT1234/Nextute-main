@echo off
REM Deploy Tech Hunt Feature to VPS (Windows)

echo ========================================
echo   DEPLOYING TECH HUNT FEATURE
echo ========================================
echo.

echo What will be deployed:
echo   - New database table: tech_hunt_participants
echo   - Backend API: /api/tech-hunt/claim
echo   - Frontend page: /tech-hunt
echo   - Reward claim form
echo.

set /p confirm="Continue with deployment? (y/n): "
if /i not "%confirm%"=="y" (
    echo Deployment cancelled.
    exit /b
)

echo.
echo Connecting to VPS...
echo.

REM Run the bash script via SSH
bash deploy-tech-hunt.sh

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE
echo ========================================
echo.
echo Visit: https://www.nextute.com/tech-hunt
echo.
pause
