@echo off
echo Testing Nextute Backend Connection
echo ======================================
echo.

echo 1. Testing if backend is running...
curl -s -o nul -w "%%{http_code}" http://localhost:8080/test > temp.txt 2>nul
set /p response=<temp.txt
del temp.txt

if "%response%"=="200" (
    echo [OK] Backend is running on port 8080
) else (
    echo [ERROR] Backend is NOT running on port 8080
    echo    Please start it with: cd backend ^&^& npm run dev
    exit /b 1
)

echo.
echo 2. Testing chatbot endpoint...
curl -X POST http://localhost:8080/api/chat/query -H "Content-Type: application/json" -d "{\"query\":\"Hello\",\"conversationHistory\":[],\"useSemanticSearch\":false}"

echo.
echo ======================================
echo Backend test complete!
echo.
echo If you see errors above:
echo 1. Make sure backend is running: cd backend ^&^& npm run dev
echo 2. Check backend/.env has PORT=8080
echo 3. Check frontend/.env has VITE_BACKEND_BASE_URL=http://localhost:8080
pause
