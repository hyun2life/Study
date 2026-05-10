@echo off
set RUN_ID=%1
if "%RUN_ID%"=="" set RUN_ID=RUN-2026-001

python automation\import_playwright_results.py --run-id %RUN_ID% --report automation\samples\playwright-report.sample.json --out automation\output\sheet_payload.json --build-version TBD --environment QA --device "Android TBD" --tester QA
if errorlevel 1 exit /b %errorlevel%

python automation\generate_qa_report.py --payload automation\output\sheet_payload.json --out-dir automation\output
