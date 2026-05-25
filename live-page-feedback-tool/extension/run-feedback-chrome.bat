@echo off
cd /d "%~dp0"
title Live Feedback Chrome Launcher

echo ===================================================
echo   Live Page Feedback - Chrome Auto Launcher
echo ===================================================
echo.
echo This script launches Chrome with the feedback extension loaded.
echo.

rem 1. Get Target URL
set DEFAULT_URL=http://localhost:3000
set /p TARGET_URL="Enter the web page URL to review (Default: %DEFAULT_URL%): "

if "%TARGET_URL%"=="" (
  set TARGET_URL=%DEFAULT_URL%
)

echo.
echo [INFO] Launching Chrome to '%TARGET_URL%'...
echo [INFO] Developer mode warning may appear in Chrome, which is normal.
echo.

rem 2. Start Chrome
start chrome --load-extension="%~dp0" --user-data-dir="%temp%\live-page-feedback-chrome-profile" "%TARGET_URL%"

if %errorlevel% neq 0 (
  echo [WARNING] Failed to launch via 'start chrome'.
  echo Trying default Chrome installation paths...
  
  if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --load-extension="%~dp0" --user-data-dir="%temp%\live-page-feedback-chrome-profile" "%TARGET_URL%"
  ) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --load-extension="%~dp0" --user-data-dir="%temp%\live-page-feedback-chrome-profile" "%TARGET_URL%"
  ) else (
    echo [ERROR] Chrome browser application not found.
    echo Please make sure Google Chrome is installed on this PC.
    pause
    exit /b 1
  )
)

echo [SUCCESS] Chrome launched successfully!
timeout /t 3 >nul
exit /b 0
