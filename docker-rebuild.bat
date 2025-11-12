@echo off
echo ========================================
echo    Rebuilding Nextute Docker Images
echo ========================================
echo.

echo Step 1: Stopping services...
docker-compose down

echo.
echo Step 2: Removing old images...
docker-compose rm -f

echo.
echo Step 3: Building fresh images...
docker-compose build --no-cache

echo.
echo Step 4: Starting services...
docker-compose up -d

echo.
echo Step 5: Checking status...
docker-compose ps

echo.
echo ========================================
echo    Rebuild complete!
echo ========================================
echo.
pause
