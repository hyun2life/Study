@echo off
setlocal

cd /d C:\Users\LiveOps1\Desktop\discord_report

if not exist logs mkdir logs

set "PYTHON_EXE=C:\Users\LiveOps1\AppData\Local\Microsoft\WindowsApps\python3.11.exe"
set "LOG_FILE=logs\scheduler.log"

echo =============================================================== >> "%LOG_FILE%"
echo [%date% %time%] Scheduler run started >> "%LOG_FILE%"

if exist "%PYTHON_EXE%" (
    "%PYTHON_EXE%" "C:\Users\LiveOps1\Desktop\discord_report\discord_report.py" >> "%LOG_FILE%" 2>&1
) else (
    python "C:\Users\LiveOps1\Desktop\discord_report\discord_report.py" >> "%LOG_FILE%" 2>&1
)

echo [%date% %time%] Scheduler run finished with exit code %ERRORLEVEL% >> "%LOG_FILE%"

endlocal
