@echo off
echo ========================================
echo    Stopping Nextute Docker Services
echo ========================================
echo.

docker-compose down

echo.
echo ========================================
echo    All services stopped!
echo ========================================
echo.
pause
