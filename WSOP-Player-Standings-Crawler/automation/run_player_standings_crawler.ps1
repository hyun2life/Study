param(
  [string]$PlayersUrl = "https://wsop-stage.ggnweb.com/players",
  [string[]]$PlayerUrl = @(),
  [int]$Limit = 10,
  [int]$ResultLimit = 3,
  [int]$MaxLoadMore = 50,
  [int]$ResultPageLimit = 30,
  [string]$BrowserChannel = "chrome",
  [string]$UserDataDir = "automation\.auth\wsop-player-crawler",
  [int]$AuthWaitMs = 0,
  [string]$Out = "automation\output\wsop-player-crawler-data.json",
  [string]$HtmlReport = "automation\output\wsop-player-crawler-report.html",
  [string]$DefectReport = "automation\output\wsop-player-crawler-defects.csv",
  [switch]$Headed
)

$ErrorActionPreference = "Stop"

function Resolve-RequiredCommand {
  param(
    [string[]]$Names,
    [string]$InstallHint
  )

  foreach ($name in $Names) {
    $command = Get-Command $name -ErrorAction SilentlyContinue
    if ($command) {
      return $command.Source
    }
  }

  foreach ($nodeDir in @("$env:ProgramFiles\nodejs", "$env:LOCALAPPDATA\Programs\nodejs")) {
    foreach ($name in $Names) {
      $candidate = Join-Path $nodeDir $name
      if (Test-Path $candidate) {
        return $candidate
      }
    }
  }

  Write-Host ""
  Write-Host "ERROR: $InstallHint"
  Write-Host ""
  Write-Host "Install option:"
  Write-Host "  winget install --id OpenJS.NodeJS.LTS --source winget"
  Write-Host ""
  Write-Host "After installation, close this window and run the crawler again."
  exit 1
}

Push-Location (Join-Path $PSScriptRoot "..")
try {
  foreach ($filePath in @($Out, $HtmlReport, $DefectReport)) {
    $parentPath = Split-Path -Parent $filePath
    if ($parentPath -and -not (Test-Path $parentPath)) {
      New-Item -ItemType Directory -Path $parentPath -Force | Out-Null
    }
  }

  $nodeCmd = Resolve-RequiredCommand @("node.exe", "node") "Node.js was not found. Install Node.js LTS, then close and reopen this terminal before running the crawler again."
  $npmCmd = Resolve-RequiredCommand @("npm.cmd", "npm") "npm was not found. Install Node.js LTS, then close and reopen this terminal before running the crawler again."
  $nodeDir = Split-Path -Parent $nodeCmd
  if ($nodeDir -and ($env:Path -notlike "*$nodeDir*")) {
    $env:Path = "$nodeDir;$env:Path"
  }

  if (-not (Test-Path "node_modules\playwright")) {
    & $npmCmd install
  }

  if ($Headed -and $AuthWaitMs -eq 0) {
    $AuthWaitMs = 300000
  }

  $scriptArgs = @(
    "automation\crawl_player_standings.mjs",
    "--players-url", $PlayersUrl,
    "--limit", $Limit,
    "--result-limit", $ResultLimit,
    "--max-load-more", $MaxLoadMore,
    "--result-page-limit", $ResultPageLimit,
    "--browser-channel", $BrowserChannel,
    "--user-data-dir", $UserDataDir,
    "--auth-wait-ms", $AuthWaitMs,
    "--out", $Out,
    "--html", $HtmlReport,
    "--defects", $DefectReport
  )

  foreach ($url in $PlayerUrl) {
    $scriptArgs += @("--player-url", $url)
  }

  if ($Headed) {
    $scriptArgs += "--headed"
  }

  & $nodeCmd @scriptArgs
  exit $LASTEXITCODE
}
finally {
  Pop-Location
}
