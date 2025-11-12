@echo off
echo ========================================
echo    Starting Nextute with Docker
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo ERROR: .env file not found!
    echo.
    echo Please create .env file from .env.example:
    echo   copy .env.example .env
    echo.
    echo Then edit .env with your configuration.
    pause
    exit /b 1
)

echo Step 1: Building Docker images...
docker-compose build

echo.
echo Step 2: Starting services...
docker-compose up -d

echo.
echo Step 3: Waiting for services to be ready...
timeout /t 10 /nobreak

echo.
echo Step 4: Checking service status...
docker-compose ps

echo.
echo ========================================
echo    Nextute is now running!
echo ========================================
echo.
echo Frontend: http://localhost
echo Backend:  http://localhost:8080
echo.
echo Useful commands:
echo   docker-compose logs -f          - View logs
echo   docker-compose ps               - Check status
echo   docker-compose down             - Stop services
echo   docker-compose restart          - Restart services
echo.
pause
