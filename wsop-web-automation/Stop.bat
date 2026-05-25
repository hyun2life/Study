@echo off
setlocal
cd /d "%~dp0"

echo Stopping WSOP Web Runner Dashboard Server...

:: Check if PORT environment variable is set, default to 3000
set "TARGET_PORT=%PORT%"
if "%TARGET_PORT%"=="" set "TARGET_PORT=3000"

:: Find PID using the target port and kill it
set "PID="
for /f "tokens=5" %%a in ('netstat -aon ^| findstr /r /c:":%TARGET_PORT% *LISTENING"') do (
  set "PID=%%a"
)

if not "%PID%"=="" (
  taskkill /f /pid %PID% >nul 2>nul
  echo Dashboard server on port %TARGET_PORT% (PID: %PID%) has been stopped successfully.
) else (
  echo No active dashboard server found running on port %TARGET_PORT%.
)

echo.
timeout /t 3 >nul
exit /b 0
