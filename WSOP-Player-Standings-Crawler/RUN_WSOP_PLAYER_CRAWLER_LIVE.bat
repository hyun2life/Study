@echo off
setlocal

cd /d "%~dp0"

if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"
if not exist "automation\output" mkdir "automation\output"
for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set "RUN_ID=%%I"
set "REPORT=automation\output\wsop-player-crawler-live-%RUN_ID%-report.html"
set "KOREAN_REPORT=automation\output\wsop-player-crawler-live-%RUN_ID%-report-ko.html"

rem Live QA controls. Lower these values only for quick smoke tests.
rem PLAYER_LIMIT: players per standings category.
rem RESULT_LIMIT: Result pages per player. 0 checks every Result.
rem RESULT_RANK_LIMIT: skip Result checks when rank is above this. 0 means no rank cap.
rem MAX_LOAD_MORE: profile ALL-tab Load more clicks.
rem RESULT_PAGE_LIMIT: Final Result pages to inspect per Result.
set "PLAYER_LIMIT=10"
set "RESULT_LIMIT=0"
set "RESULT_RANK_LIMIT=0"
set "MAX_LOAD_MORE=50"
set "RESULT_PAGE_LIMIT=30"

echo ============================================
echo WSOP LIVE Player Standings Crawler
echo ============================================
echo.
echo Target:
echo   https://www.wsop.com/player-standings/
echo.
echo First run may install Node.js, npm packages, and Playwright Chromium.
echo A browser will open. Keep it open until the report is generated.
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
  -Limit %PLAYER_LIMIT% ^
  -ResultLimit %RESULT_LIMIT% ^
  -ResultRankLimit %RESULT_RANK_LIMIT% ^
  -MaxLoadMore %MAX_LOAD_MORE% ^
  -ResultPageLimit %RESULT_PAGE_LIMIT%
set EXIT_CODE=%ERRORLEVEL%

echo.
if exist "%KOREAN_REPORT%" (
  echo Opening generated Korean live crawler report.
  start "" "%KOREAN_REPORT%"
) else if exist "%REPORT%" (
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
