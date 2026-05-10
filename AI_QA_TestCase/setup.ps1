# =============================================================================
# Game QA Testcase — Setup Script (Windows PowerShell)
# =============================================================================

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Preflight = Join-Path $RepoRoot "scripts\preflight\preflight.ps1"

if (-not (Test-Path $Preflight)) {
    Write-Host "[ERROR] preflight.ps1를 찾을 수 없습니다: $Preflight" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================"
Write-Host "  Game QA Testcase - Setup"
Write-Host "========================================"
Write-Host ""
Write-Host "setup.ps1는 이제 preflight를 호출합니다."
Write-Host "Node/npm 확인, .env 생성, npm install, Claude asset 설치를 순서대로 수행합니다."
Write-Host ""

& powershell -ExecutionPolicy Bypass -File $Preflight
