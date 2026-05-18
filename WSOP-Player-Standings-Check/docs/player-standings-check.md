# Player Standings Consistency Check

This is a standalone web check for WSOP player profile data. It opens the WSOP players page, visits player profiles, compares the top profile stats against the lower event table, and writes JSON/CSV/HTML evidence.

This folder is intentionally separate from `WSOP-QA-Automation`, which is for the broader app/Playwright QA automation pipeline.

## Run

For one-click execution, double-click this file:

```text
RUN_WSOP_PLAYER_CHECK.bat
```

Before using the stage site, you can verify the calculation rules locally:

```powershell
npm run check:players:self-test
```

```powershell
powershell -ExecutionPolicy Bypass -File automation\run_player_standings_check.ps1 -Limit 10 -ResultLimit 3
```

Specific player URLs can be checked directly:

```powershell
powershell -ExecutionPolicy Bypass -File automation\run_player_standings_check.ps1 `
  -PlayerUrl "https://wsop-stage.ggnweb.com/players/example" `
  -Limit 0
```

Use `-Headed` when you want to watch the browser.
The runner uses the installed Chrome browser by default. Use `-BrowserChannel none` if you want Playwright's bundled Chromium instead.

If the stage site shows Cloudflare Access, run this once and complete login in the opened browser:

```powershell
powershell -ExecutionPolicy Bypass -File automation\run_player_standings_check.ps1 -Headed -AuthWaitMs 300000 -Limit 1
```

The login profile is kept under `automation/.auth/wsop-player-check`, so later headless runs can reuse the session.

## Output

- `automation/output/wsop-player-standings-report.json`
- `automation/output/wsop-player-standings-report.csv`
- `automation/output/wsop-player-standings-report.html`
- `automation/output/wsop-player-standings-summary.json`
- `automation/output/wsop-player-standings-defects.csv`

The HTML report includes the overall status, defect candidates, top-vs-lower comparisons per player, Result page checks, and sample lower event rows.

## Validation Rules

- `Title`: lower event rows where player rank is `1`.
- `Bracelets`: rank `1` rows classified as bracelet events.
- `Rings`: rank `1` rows classified as circuit/ring events.
- `Final Tables`: lower event rows where rank is `1` through `9`.
- `Cashes`: lower event row count.
- `Total Earnings`: sum of lower event row earnings.
- Badge counts: detected bracelet/ring badge counts must match top `Bracelets` and `Rings`.
- Result page: sampled `Result` links must show the player/event/rank/earnings data.

If the site's DOM labels differ, adjust the extraction heuristics in `automation/check_players_standings.mjs`.
