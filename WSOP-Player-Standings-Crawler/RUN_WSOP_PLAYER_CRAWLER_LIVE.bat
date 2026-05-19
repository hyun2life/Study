@echo off
setlocal

cd /d "%~dp0"

if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"
if not exist "automation\output" mkdir "automation\output"

echo ============================================
echo WSOP LIVE Player Standings Crawler
echo ============================================
echo.
echo Target:
echo   https://www.wsop.com/player-standings/
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "automation\run_player_standings_crawler.ps1" -PlayersUrl "https://www.wsop.com/player-standings/" -Headed -AuthWaitMs 300000 -Limit 10 -ResultLimit 3 -Out "automation\output\wsop-player-crawler-live-data.json" -HtmlReport "automation\output\wsop-player-crawler-live-report.html" -DefectReport "automation\output\wsop-player-crawler-live-defects.csv"
set EXIT_CODE=%ERRORLEVEL%

echo.
if exist "automation\output\wsop-player-crawler-live-report.html" (
  echo Opening generated live crawler report.
  start "" "automation\output\wsop-player-crawler-live-report.html"
) else (
  start "" "automation\output"
)

echo.
if "%EXIT_CODE%"=="0" (
  echo Live crawl completed.
) else (
  echo Live crawl found failures or could not complete. Review the report and message above.
)

echo.
pause
exit /b %EXIT_CODE%
