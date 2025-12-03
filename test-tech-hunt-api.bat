@echo off
REM Tech Hunt API Testing Script for Windows
REM Test all endpoints with sample data

echo ========================================
echo   TECH HUNT API TESTING
echo ========================================
echo.

REM Configuration
set BASE_URL=http://localhost:8080
if "%1"=="prod" set BASE_URL=https://www.nextute.com

echo Testing: %BASE_URL%
echo.

REM Generate timestamp for unique test data
set TIMESTAMP=%date:~-4%%date:~3,2%%date:~0,2%%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%

echo ========================================
echo Test 1: GET /api/tech-hunt/stats
echo ========================================
echo.

curl -s %BASE_URL%/api/tech-hunt/stats
echo.
echo.

echo ========================================
echo Test 2: POST /api/tech-hunt/claim (New)
echo ========================================
echo.

echo Creating test participant...
curl -s -X POST %BASE_URL%/api/tech-hunt/claim ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User %TIMESTAMP%\",\"rollNumber\":\"TEST%TIMESTAMP%\",\"teamName\":\"Test Team\",\"email\":\"test%TIMESTAMP%@example.com\",\"phone\":\"+91 9876543210\",\"college\":\"Test College\"}"

echo.
echo.

echo ========================================
echo Test 3: POST /api/tech-hunt/claim (Duplicate)
echo ========================================
echo.

echo Submitting same data again (should fail)...
curl -s -X POST %BASE_URL%/api/tech-hunt/claim ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User %TIMESTAMP%\",\"rollNumber\":\"TEST%TIMESTAMP%\",\"teamName\":\"Test Team\"}"

echo.
echo.

echo ========================================
echo Test 4: POST /api/tech-hunt/claim (Invalid)
echo ========================================
echo.

echo Submitting invalid data (missing teamName)...
curl -s -X POST %BASE_URL%/api/tech-hunt/claim ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"rollNumber\":\"\"}"

echo.
echo.

echo ========================================
echo Test 5: GET /api/tech-hunt/participants
echo ========================================
echo.

curl -s %BASE_URL%/api/tech-hunt/participants
echo.
echo.

echo ========================================
echo   TEST SUMMARY
echo ========================================
echo.
echo All tests completed!
echo.
echo Next steps:
echo   1. Visit: %BASE_URL%/tech-hunt
echo   2. Test the UI manually
echo   3. Verify duplicate prevention
echo   4. Check mobile responsiveness
echo.
pause
