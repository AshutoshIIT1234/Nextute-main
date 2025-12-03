@echo off
REM Fix 500 Error on VPS

echo ========================================
echo   FIXING 500 ERROR
echo ========================================
echo.

echo Connecting to VPS...
echo.

ssh root@72.60.218.219 "cd /root/Nextute-main/backend && npx prisma generate && npx prisma db push --accept-data-loss && pm2 restart backend && sleep 3 && curl http://localhost:8080/api/tech-hunt/stats"

echo.
echo ========================================
echo   FIX COMPLETE!
echo ========================================
echo.
echo Try accessing the page again:
echo https://www.nextute.com/tech-hunt
echo.
pause
