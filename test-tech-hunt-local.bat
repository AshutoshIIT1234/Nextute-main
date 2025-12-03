@echo off
REM Test Tech Hunt Feature Locally

echo ========================================
echo   TECH HUNT LOCAL TESTING
echo ========================================
echo.

echo [1/3] Updating database schema...
cd backend
call npx prisma db push
if errorlevel 1 (
    echo Failed to update database schema
    pause
    exit /b 1
)
echo Database schema updated!
echo.

echo [2/3] Starting backend...
start "Backend Server" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul
echo Backend started on http://localhost:8080
echo.

echo [3/3] Starting frontend...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul
echo Frontend started on http://localhost:5173
echo.

echo ========================================
echo   SERVERS RUNNING
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Test the Tech Hunt page:
echo http://localhost:5173/tech-hunt
echo.
echo API Endpoints:
echo - POST http://localhost:8080/api/tech-hunt/claim
echo - GET  http://localhost:8080/api/tech-hunt/stats
echo - GET  http://localhost:8080/api/tech-hunt/participants
echo.
echo Press any key to stop servers...
pause >nul

echo.
echo Stopping servers...
taskkill /FI "WindowTitle eq Backend Server*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Frontend Server*" /T /F >nul 2>&1
echo Servers stopped.
