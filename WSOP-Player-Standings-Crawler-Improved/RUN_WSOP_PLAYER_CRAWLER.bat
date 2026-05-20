@echo off
setlocal

cd /d "%~dp0"

if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"
if not exist "automation\output" mkdir "automation\output"
for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set "RUN_ID=%%I"
set "REPORT=automation\output\wsop-player-crawler-stage-%RUN_ID%-report.html"
set "KOREAN_REPORT=automation\output\wsop-player-crawler-stage-%RUN_ID%-report-ko.html"

rem Sample controls. Change these values for faster test runs.
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
set "CONCURRENCY=10"

echo ============================================
echo WSOP Player Standings Crawler
echo ============================================
echo.
echo First run may install Node.js, npm packages, and Playwright Chromium.
echo A browser will open. Log in to the stage site if needed.
echo The crawler will collect profile and Result page data.
echo.

set "CRAWLER_SCRIPT=automation\run_player_standings_crawler.ps1"
set "OUTPUT_TAG=wsop-player-crawler-stage"

powershell -NoProfile -ExecutionPolicy Bypass -File "%CRAWLER_SCRIPT%" ^
  -OutputTag "%OUTPUT_TAG%" ^
  -RunId "%RUN_ID%" ^
  -Headed ^
  -AuthWaitMs 300000 ^
  -Limit %PLAYER_LIMIT% ^
  -ResultLimit %RESULT_LIMIT% ^
  -ResultRankLimit %RESULT_RANK_LIMIT% ^
  -MaxLoadMore %MAX_LOAD_MORE% ^
  -ResultPageLimit %RESULT_PAGE_LIMIT% ^
  -Concurrency %CONCURRENCY%
set EXIT_CODE=%ERRORLEVEL%

echo.
if exist "%KOREAN_REPORT%" (
  echo Opening generated Korean crawler report.
  start "" "%KOREAN_REPORT%"
) else if exist "%REPORT%" (
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
