param(
  [string]$PlayersUrl = "https://wsop-stage.ggnweb.com/players",
  [string[]]$PlayerUrl = @(),
  [int]$Limit = 10,
  [int]$ResultLimit = 3,
  [string]$BrowserChannel = "chrome",
  [string]$UserDataDir = "automation\.auth\wsop-player-crawler",
  [int]$AuthWaitMs = 0,
  [string]$Out = "automation\output\wsop-player-crawler-data.json",
  [string]$HtmlReport = "automation\output\wsop-player-crawler-report.html",
  [string]$DefectReport = "automation\output\wsop-player-crawler-defects.csv",
  [switch]$Headed
)

$ErrorActionPreference = "Stop"

Push-Location (Join-Path $PSScriptRoot "..")
try {
  if (-not (Test-Path "node_modules\playwright")) {
    npm.cmd install
  }

  if ($Headed -and $AuthWaitMs -eq 0) {
    $AuthWaitMs = 300000
  }

  $scriptArgs = @(
    "automation\crawl_player_standings.mjs",
    "--players-url", $PlayersUrl,
    "--limit", $Limit,
    "--result-limit", $ResultLimit,
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

  node @scriptArgs
  exit $LASTEXITCODE
}
finally {
  Pop-Location
}
