@echo off
setlocal

cd /d "%~dp0"

echo ============================================
echo WSOP LIVE Player Standings Consistency Check
echo ============================================
echo.
echo Target:
echo   https://www.wsop.com/player-standings/
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "automation\run_player_standings_check.ps1" -PlayersUrl "https://www.wsop.com/player-standings/" -Headed -AuthWaitMs 300000 -Limit 10 -ResultLimit 3 -Out "automation\output\wsop-player-standings-live-report.json" -HtmlReport "automation\output\wsop-player-standings-live-report.html" -SummaryReport "automation\output\wsop-player-standings-live-summary.json" -DefectReport "automation\output\wsop-player-standings-live-defects.csv"
set EXIT_CODE=%ERRORLEVEL%

echo.
if exist "automation\output\wsop-player-standings-live-report.html" (
  echo Opening generated live report.
  start "" "automation\output\wsop-player-standings-live-report.html"
) else (
  start "" "automation\output"
)

echo.
if "%EXIT_CODE%"=="0" (
  echo Live check completed.
) else (
  echo Live check found failures or could not complete. Review the report and message above.
)

echo.
pause
exit /b %EXIT_CODE%
