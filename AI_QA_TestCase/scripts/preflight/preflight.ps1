$ErrorActionPreference = "Stop"

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$EnvPath = Join-Path $RepoRoot ".env"
$CredPath = Join-Path $RepoRoot "credentials\client_secret.json"
$NodeExe = "C:\Program Files\nodejs\node.exe"
$NpmCmd = "C:\Program Files\nodejs\npm.cmd"
$ClaudeCmd = Join-Path $env:APPDATA "npm\claude.cmd"

Write-Host "[preflight] repo: $RepoRoot"

if (-not (Test-Path $NodeExe)) {
    $nodeCommand = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeCommand) { $NodeExe = $nodeCommand.Source }
}
if (-not (Test-Path $NodeExe)) {
    Write-Host "[ERROR] Node.js를 찾을 수 없습니다." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $NpmCmd)) {
    $npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
    if ($npmCommand) { $NpmCmd = $npmCommand.Source }
}
if (-not (Test-Path $NpmCmd)) {
    Write-Host "[ERROR] npm을 찾을 수 없습니다." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $ClaudeCmd)) {
    $claudeCommand = Get-Command claude.cmd -ErrorAction SilentlyContinue
    if ($claudeCommand) { $ClaudeCmd = $claudeCommand.Source }
}
if (-not (Test-Path $ClaudeCmd)) {
    Write-Host "[WARN] claude CLI를 찾지 못했습니다. 설치 후 다시 실행하세요." -ForegroundColor Yellow
}

if (-not (Test-Path $EnvPath)) {
    $envContent = Get-Content (Join-Path $RepoRoot ".env.example") -Raw -Encoding UTF8
    $envContent = $envContent `
        -replace 'C:/Users/YourName/Documents/Game_QA_Testcase', (($RepoRoot.Path) -replace '\\','/') `
        -replace 'C:/Users/YourName/.claude', (($env:USERPROFILE + '\.claude') -replace '\\','/')
    $envContent += "`nNODE_PATH=$($NodeExe -replace '\\','/')`n"
    if (Test-Path $ClaudeCmd) {
        $cliJs = Join-Path $env:APPDATA "npm\node_modules\@anthropic-ai\claude-code\cli.js"
        $envContent += "CLI_JS=$($cliJs -replace '\\','/')`n"
    }
    [System.IO.File]::WriteAllText($EnvPath, $envContent, [System.Text.Encoding]::UTF8)
    Write-Host "[INFO] .env를 생성했습니다. OAuth/Spreadsheet/Drive 값은 실제 값으로 교체해야 합니다." -ForegroundColor Yellow
}

Push-Location $RepoRoot
try {
    & $NpmCmd install
    if ($LASTEXITCODE -ne 0) { throw "npm install failed with exit code $LASTEXITCODE" }
    if (-not (Test-Path $CredPath)) {
        Write-Host "[WARN] credentials/client_secret.json 이 없습니다. Google OAuth 인증 전까지 Sheets/Drive 기능은 실행되지 않습니다." -ForegroundColor Yellow
    }
    & $NodeExe install.mjs
    if ($LASTEXITCODE -ne 0) { throw "install.mjs failed with exit code $LASTEXITCODE" }
}
finally {
    Pop-Location
}

Write-Host "[preflight] 완료"
