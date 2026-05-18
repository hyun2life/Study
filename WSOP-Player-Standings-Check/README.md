# WSOP Player Standings Check

Standalone web checker for WSOP player profile data consistency.

Double-click:

```text
RUN_WSOP_PLAYER_CHECK.bat
```

The checker opens the stage players page, waits for manual login if needed, compares top player profile stats with lower event rows, verifies sampled Result links, and generates JSON/CSV/HTML reports under `automation/output`.

This tool is separate from `WSOP-QA-Automation`, which is for the broader app QA automation pipeline.
