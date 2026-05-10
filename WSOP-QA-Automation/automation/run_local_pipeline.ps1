param(
  [string]$RunId = "RUN-2026-001",
  [string]$Report = "automation\samples\playwright-report.sample.json",
  [string]$BuildVersion = "TBD",
  [string]$Environment = "QA",
  [string]$Device = "Android TBD",
  [string]$Tester = "QA"
)

$ErrorActionPreference = "Stop"

python automation\import_playwright_results.py `
  --run-id $RunId `
  --report $Report `
  --out automation\output\sheet_payload.json `
  --build-version $BuildVersion `
  --environment $Environment `
  --device $Device `
  --tester $Tester

python automation\generate_qa_report.py `
  --payload automation\output\sheet_payload.json `
  --out-dir automation\output
