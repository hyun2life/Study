param(
  [string]$PlayersUrl = "https://wsop-stage.ggnweb.com/players",
  [string[]]$PlayerUrl = @(),
  [int]$Limit = 10,
  [int]$ResultLimit = 3,
  [int]$MaxLoadMore = 50,
  [int]$ResultPageLimit = 30,
  [string]$OutputTag = "wsop-player-crawler",
  [string]$RunId = (Get-Date -Format "yyyyMMdd-HHmmss"),
  [string]$BrowserChannel = "chrome",
  [string]$UserDataDir = "automation\.auth\wsop-player-crawler",
  [int]$AuthWaitMs = 0,
  [string]$Out = "",
  [string]$HtmlReport = "",
  [string]$DefectReport = "",
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
  $safeOutputTag = ($OutputTag -replace '[^A-Za-z0-9._-]', '-').Trim('-')
  $safeRunId = ($RunId -replace '[^A-Za-z0-9._-]', '-').Trim('-')
  if (-not $safeOutputTag) {
    $safeOutputTag = "wsop-player-crawler"
  }
  if (-not $safeRunId) {
    $safeRunId = Get-Date -Format "yyyyMMdd-HHmmss"
  }

  if ([string]::IsNullOrWhiteSpace($Out)) {
    $Out = "automation\output\$safeOutputTag-$safeRunId-data.json"
  }
  if ([string]::IsNullOrWhiteSpace($HtmlReport)) {
    $HtmlReport = "automation\output\$safeOutputTag-$safeRunId-report.html"
  }
  if ([string]::IsNullOrWhiteSpace($DefectReport)) {
    $DefectReport = "automation\output\$safeOutputTag-$safeRunId-defects.csv"
  }

  Write-Host "Output JSON: $Out"
  Write-Host "HTML report: $HtmlReport"
  Write-Host "Defect CSV: $DefectReport"
  Write-Host ""

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
