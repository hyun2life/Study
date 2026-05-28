@echo off
chcp 65001 > nul
title WSOP Telegram Bot
cd /d "%~dp0"

echo ===================================================
echo   WSOP Telegram AI Control Bot starting...
echo ===================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed or not in PATH.
  echo Please install Node.js LTS and try again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [INFO] node_modules not found. Installing dependencies...
  echo.
  cmd /c npm install
  if errorlevel 1 (
    echo [ERROR] Dependency installation failed.
    pause
    exit /b 1
  )
)

echo.
echo [INFO] Starting Telegram Bot via Node...
echo [INFO] Minimize this window to keep it running. Closing it stops the bot.
echo.

node index.js

if errorlevel 1 (
  echo.
  echo [ERROR] Bot terminated with an error.
  pause
)
