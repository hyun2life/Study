@echo off
setlocal

cd /d "%~dp0"

echo ========================================
echo WSOP public smoke test (Headed Mode)
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed or is not available in PATH.
  echo Install Node.js, then run this file again.
  exit /b 1
)

if not exist "node_modules" (
  echo [INFO] node_modules not found. Running npm install...
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    exit /b 1
  )
)

echo [INFO] Ensuring Playwright Chromium is installed...
call npx playwright install chromium
if errorlevel 1 (
  echo [ERROR] Playwright Chromium install failed.
  exit /b 1
)

echo [INFO] Running desktop smoke tests in headed mode...
call npm run test:smoke:headed
set TEST_EXIT_CODE=%ERRORLEVEL%

if not "%TEST_EXIT_CODE%"=="0" (
  echo.
  echo [FAILED] WSOP smoke test failed.
  echo Korean final report: automation\output\wsop-public-smoke-latest-report-ko.html
  echo English final report: automation\output\wsop-public-smoke-latest-report.html
  echo Playwright report: playwright-report\index.html
  if exist "automation\output\wsop-public-smoke-latest-report-ko.html" start "" "automation\output\wsop-public-smoke-latest-report-ko.html"
  exit /b %TEST_EXIT_CODE%
)

echo.
echo [SUCCESS] WSOP smoke test passed.
echo Korean final report: automation\output\wsop-public-smoke-latest-report-ko.html
echo English final report: automation\output\wsop-public-smoke-latest-report.html
echo Playwright report: playwright-report\index.html
if exist "automation\output\wsop-public-smoke-latest-report-ko.html" start "" "automation\output\wsop-public-smoke-latest-report-ko.html"
exit /b 0
