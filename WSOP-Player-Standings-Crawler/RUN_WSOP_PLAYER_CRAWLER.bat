@echo off
setlocal

cd /d "%~dp0"

if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"
if not exist "automation\output" mkdir "automation\output"
for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set "RUN_ID=%%I"
set "REPORT=automation\output\wsop-player-crawler-stage-%RUN_ID%-report.html"

echo ============================================
echo WSOP Player Standings Crawler
echo ============================================
echo.
echo Chrome will open. Log in to the stage site if needed.
echo The crawler will collect profile and Result page data.
echo.

set "CRAWLER_SCRIPT=automation\run_player_standings_crawler.ps1"
set "OUTPUT_TAG=wsop-player-crawler-stage"

powershell -NoProfile -ExecutionPolicy Bypass -File "%CRAWLER_SCRIPT%" ^
  -OutputTag "%OUTPUT_TAG%" ^
  -RunId "%RUN_ID%" ^
  -Headed ^
  -AuthWaitMs 300000 ^
  -Limit 10 ^
  -ResultLimit 0
set EXIT_CODE=%ERRORLEVEL%

echo.
if exist "%REPORT%" (
  echo Opening generated crawler report.
  start "" "%REPORT%"
) else (
  start "" "automation\output"
)

echo.
if "%EXIT_CODE%"=="0" (
  echo Crawl completed.
) else (
  echo Crawl found failures or could not complete. Review the report and message above.
)

echo.
pause
exit /b %EXIT_CODE%
