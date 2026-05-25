@echo off
cd /d "%~dp0"
echo Starting WSOP Automation Web Server Dashboard...
node scripts/web-runner-server.js
pause
