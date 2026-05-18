param(
  [string]$PlayersUrl = "https://wsop-stage.ggnweb.com/players",
  [string[]]$PlayerUrl = @(),
  [int]$Limit = 10,
  [int]$ResultLimit = 3,
  [string]$BrowserChannel = "chrome",
  [string]$UserDataDir = "automation\.auth\wsop-player-check",
  [int]$AuthWaitMs = 0,
  [string]$Out = "automation\output\wsop-player-standings-report.json",
  [string]$HtmlReport = "automation\output\wsop-player-standings-report.html",
  [string]$SummaryReport = "automation\output\wsop-player-standings-summary.json",
  [string]$DefectReport = "automation\output\wsop-player-standings-defects.csv",
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
    "automation\check_players_standings.mjs",
    "--players-url", $PlayersUrl,
    "--limit", $Limit,
    "--result-limit", $ResultLimit,
    "--browser-channel", $BrowserChannel,
    "--user-data-dir", $UserDataDir,
    "--auth-wait-ms", $AuthWaitMs,
    "--out", $Out
  )

  foreach ($url in $PlayerUrl) {
    $scriptArgs += @("--player-url", $url)
  }

  if ($Headed) {
    $scriptArgs += "--headed"
  }

  node @scriptArgs
  $checkExitCode = $LASTEXITCODE

  if (Test-Path $Out) {
    node automation\generate_player_standings_report.mjs `
      --input $Out `
      --html $HtmlReport `
      --summary $SummaryReport `
      --defects $DefectReport

    if ($LASTEXITCODE -ne 0) {
      exit $LASTEXITCODE
    }
  }

  exit $checkExitCode
}
finally {
  Pop-Location
}
