@echo off
setlocal

cd /d "%~dp0"

if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"
if not exist "automation\output" mkdir "automation\output"
for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set "RUN_ID=%%I"
set "REPORT=automation\output\wsop-player-crawler-live-%RUN_ID%-report.html"

echo ============================================
echo WSOP LIVE Player Standings Crawler
echo ============================================
echo.
echo Target:
echo   https://www.wsop.com/player-standings/
echo.

set "CRAWLER_SCRIPT=automation\run_player_standings_crawler.ps1"
set "PLAYERS_URL=https://www.wsop.com/player-standings/"
set "OUTPUT_TAG=wsop-player-crawler-live"

powershell -NoProfile -ExecutionPolicy Bypass -File "%CRAWLER_SCRIPT%" ^
  -PlayersUrl "%PLAYERS_URL%" ^
  -OutputTag "%OUTPUT_TAG%" ^
  -RunId "%RUN_ID%" ^
  -Headed ^
  -AuthWaitMs 300000 ^
  -Limit 10 ^
  -ResultLimit 0
set EXIT_CODE=%ERRORLEVEL%

echo.
if exist "%REPORT%" (
  echo Opening generated live crawler report.
  start "" "%REPORT%"
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
