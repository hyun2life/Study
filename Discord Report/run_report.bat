@echo off
setlocal

cd /d "%~dp0"

if not exist logs mkdir logs
if not exist reports mkdir reports
if not exist reports\daily mkdir reports\daily
if not exist reports\weekly mkdir reports\weekly

set "LOG_FILE=logs\scheduler.log"

echo =============================================================== >> "%LOG_FILE%"
echo [%date% %time%] Scheduler run started >> "%LOG_FILE%"

python discord_report.py >> "%LOG_FILE%" 2>&1

echo [%date% %time%] Scheduler run finished with exit code %ERRORLEVEL% >> "%LOG_FILE%"

endlocal
