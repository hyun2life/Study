@echo off
setlocal

cd /d "%~dp0"

if not exist logs mkdir logs
if not exist reports mkdir reports
if not exist reports\daily mkdir reports\daily
if not exist reports\weekly mkdir reports\weekly

set "LOG_FILE=logs\manual_run.log"

echo =============================================================== >> "%LOG_FILE%"
echo [%date% %time%] Manual rebuild run started >> "%LOG_FILE%"

python discord_report.py --rebuild-daily --force-send-daily >> "%LOG_FILE%" 2>&1

echo [%date% %time%] Manual rebuild run finished with exit code %ERRORLEVEL% >> "%LOG_FILE%"

endlocal
