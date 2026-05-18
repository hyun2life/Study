@echo off
setlocal

cd /d "%~dp0"

echo ============================================
echo WSOP Player Standings Consistency Check
echo ============================================
echo.
echo Chrome will open. Log in to the stage site if needed.
echo After login, the checker will continue automatically.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "automation\run_player_standings_check.ps1" -Headed -AuthWaitMs 300000 -Limit 10 -ResultLimit 3
set EXIT_CODE=%ERRORLEVEL%

echo.
if "%EXIT_CODE%"=="0" (
  echo Check completed.
  echo Output:
  echo   automation\output\wsop-player-standings-report.json
  echo   automation\output\wsop-player-standings-report.csv
  echo   automation\output\wsop-player-standings-report.html
  start "" "automation\output"
) else (
  echo Check found failures or could not complete. Review the message above.
  if exist "automation\output\wsop-player-standings-report.html" (
    echo Opening generated report.
    start "" "automation\output\wsop-player-standings-report.html"
  )
)

echo.
pause
exit /b %EXIT_CODE%
