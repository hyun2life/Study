@echo off
cd /d "%~dp0"
echo [INFO] Building Agentation Chrome Extension...
call npx vite build
if %errorlevel% neq 0 (
  echo [ERROR] Build failed!
  pause
  exit /b 1
)
echo [SUCCESS] Extension built successfully in extension folder.
pause
