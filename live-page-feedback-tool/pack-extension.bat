@echo off
cd /d "%~dp0"
title Agentation Extension Packager

echo [INFO] Starting extension packaging...

rem 1. Check content.js build
if not exist "extension\content.js" (
  echo [WARNING] content.js not found. Running build first...
  call npx vite build
  if %errorlevel% neq 0 (
    echo [ERROR] Build failed! Aborting packaging.
    pause
    exit /b 1
  )
)

rem 2. Remove old zip
if exist "live-page-feedback-dist.zip" (
  del /f /q "live-page-feedback-dist.zip" >nul 2>&1
)

echo [INFO] Compressing extension folder to live-page-feedback-dist.zip...
powershell -Command "Compress-Archive -Path '.\extension' -DestinationPath '.\live-page-feedback-dist.zip' -Force"

if %errorlevel% neq 0 (
  echo [ERROR] Compression failed!
  pause
  exit /b 1
)

echo [SUCCESS] Packaging completed!
echo Output file: %~dp0live-page-feedback-dist.zip
echo You can distribute this ZIP file to your team.
pause
