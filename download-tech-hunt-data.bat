@echo off
REM Download Tech Hunt Participant Data

echo ========================================
echo   DOWNLOADING TECH HUNT DATA
echo ========================================
echo.

set TIMESTAMP=%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set FILENAME=tech_hunt_participants_%TIMESTAMP%.json

echo Downloading participant data...
echo.

curl -s https://www.nextute.com/api/tech-hunt/participants > %FILENAME%

if exist %FILENAME% (
    echo ✅ Data downloaded successfully!
    echo.
    echo File: %FILENAME%
    echo Location: %cd%\%FILENAME%
    echo.
    
    REM Count participants
    for /f %%A in ('type %FILENAME% ^| find /c "id"') do set COUNT=%%A
    echo Total participants: %COUNT%
) else (
    echo ❌ Download failed!
)

echo.
pause
