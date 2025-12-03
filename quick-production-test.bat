@echo off
REM Quick Production Health Check for Windows
REM Run this immediately after deployment

echo ========================================
echo   QUICK PRODUCTION HEALTH CHECK
echo ========================================
echo.

set BACKEND_URL=https://api.nextute.com
set FRONTEND_URL=https://www.nextute.com

echo [1/6] Testing Backend Health...
curl -s -o nul -w "Status: %%{http_code} | Time: %%{time_total}s\n" %BACKEND_URL%/test
echo.

echo [2/6] Testing Frontend...
curl -s -o nul -w "Status: %%{http_code} | Time: %%{time_total}s\n" %FRONTEND_URL%
echo.

echo [3/6] Testing Mentors API...
curl -s -o nul -w "Status: %%{http_code}\n" %BACKEND_URL%/api/mentorship/mentors
echo.

echo [4/6] Checking Debug Routes (should be 404)...
curl -s -o nul -w "Status: %%{http_code}\n" %BACKEND_URL%/api/debug/auth-status
echo.

echo [5/6] Testing Protected Endpoint (should be 401)...
curl -s -o nul -w "Status: %%{http_code}\n" %BACKEND_URL%/api/students/profile
echo.

echo [6/6] Testing CORS...
curl -s -I -H "Origin: https://www.nextute.com" %BACKEND_URL%/test | findstr "access-control"
echo.

echo ========================================
echo   HEALTH CHECK COMPLETE
echo ========================================
echo.
echo Next Steps:
echo 1. Review SECURITY_AUDIT.md for security issues
echo 2. Set up monitoring (see MONITORING_SETUP.md)
echo 3. Enable user feedback (see USER_FEEDBACK_FORM.md)
echo 4. Test user flows manually
echo.
pause
