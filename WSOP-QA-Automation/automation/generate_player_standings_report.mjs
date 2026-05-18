import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const DEFAULT_INPUT = "automation/output/wsop-player-standings-report.json";
const DEFAULT_HTML = "automation/output/wsop-player-standings-report.html";
const DEFAULT_SUMMARY = "automation/output/wsop-player-standings-summary.json";
const DEFAULT_DEFECTS = "automation/output/wsop-player-standings-defects.csv";

function parseArgs(argv) {
  const args = {
    input: DEFAULT_INPUT,
    html: DEFAULT_HTML,
    summary: DEFAULT_SUMMARY,
    defects: DEFAULT_DEFECTS,
    selfTest: false,
    help: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg === "--input") args.input = argv[++i];
    else if (arg === "--html") args.html = argv[++i];
    else if (arg === "--summary") args.summary = argv[++i];
    else if (arg === "--defects") args.defects = argv[++i];
    else if (arg === "--self-test") args.selfTest = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function printHelp() {
  console.log(`WSOP player standings HTML report generator

Usage:
  node automation/generate_player_standings_report.mjs [options]

Options:
  --input <path>    Input JSON from check_players_standings.mjs.
  --html <path>     HTML report path.
  --summary <path>  Summary JSON path.
  --defects <path>  Defect candidate CSV path.
  --self-test       Run local report rendering checks.
`);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function statusClass(status) {
  return String(status).toLowerCase() === "pass" ? "pass" : "fail";
}

function formatNumber(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "number" && Number.isFinite(value)) return value.toLocaleString("en-US");
  return String(value);
}

function formatMoney(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "number" && Number.isFinite(value)) return `$${value.toLocaleString("en-US")}`;
  return String(value);
}

function formatStat(label, value) {
  return /earning/i.test(label) ? formatMoney(value) : formatNumber(value);
}

function loadReport(inputPath) {
  return JSON.parse(fs.readFileSync(inputPath, "utf8"));
}

function summarize(report) {
  const players = report.players || [];
  const failedPlayers = players.filter((player) => player.status !== "pass");
  const comparisons = players.flatMap((player) => player.comparisons || []);
  const resultChecks = players.flatMap((player) => player.resultChecks || []);
  const failedComparisons = comparisons.filter((item) => item.status !== "pass");
  const failedResultChecks = resultChecks.filter((item) => item.status !== "pass");
  const warnings = players.reduce((sum, player) => sum + (player.warnings || []).length, 0);
  const totalComparisons = comparisons.length;
  const passedComparisons = comparisons.filter((item) => item.status === "pass").length;
  const comparisonPassRate = totalComparisons ? Math.round((passedComparisons / totalComparisons) * 1000) / 10 : 0;

  return {
    status: report.status || (failedPlayers.length ? "fail" : "pass"),
    startedAt: report.startedAt,
    finishedAt: report.finishedAt,
    playersUrl: report.playersUrl,
    checkedPlayers: players.length,
    passedPlayers: players.length - failedPlayers.length,
    failedPlayers: failedPlayers.length,
    totalComparisons,
    passedComparisons,
    failedComparisons: failedComparisons.length,
    comparisonPassRate,
    resultChecks: resultChecks.length,
    failedResultChecks: failedResultChecks.length,
    warnings,
    defectCandidates: buildDefectRows(report).length
  };
}

function buildDefectRows(report) {
  const rows = [];

  for (const player of report.players || []) {
    for (const comparison of player.comparisons || []) {
      if (comparison.status === "pass") continue;
      rows.push({
        player: player.name,
        url: player.url,
        type: "Data mismatch",
        item: comparison.label,
        expected: formatStat(comparison.label, comparison.top),
        actual: formatStat(comparison.label, comparison.calculated),
        detail: `${comparison.label}: top=${formatStat(comparison.label, comparison.top)}, lower=${formatStat(comparison.label, comparison.calculated)}`
      });
    }

    for (const check of player.resultChecks || []) {
      if (check.status === "pass") continue;
      rows.push({
        player: player.name,
        url: check.url || player.url,
        type: "Result page mismatch",
        item: check.eventName || "Result page",
        expected: "Player/event/rank/earnings visible",
        actual: check.error || [
          check.hasPlayer === false ? "player missing" : "",
          check.hasEvent === false ? "event missing" : "",
          check.hasRank === false ? "rank missing" : "",
          check.hasEarnings === false ? "earnings missing" : ""
        ].filter(Boolean).join(", "),
        detail: check.error || JSON.stringify({
          hasPlayer: check.hasPlayer,
          hasEvent: check.hasEvent,
          hasRank: check.hasRank,
          hasEarnings: check.hasEarnings
        })
      });
    }

    for (const warning of player.warnings || []) {
      rows.push({
        player: player.name,
        url: player.url,
        type: "Warning",
        item: "Extraction warning",
        expected: "No warning",
        actual: warning,
        detail: warning
      });
    }

    if (player.error) {
      rows.push({
        player: player.name,
        url: player.url,
        type: "Player check error",
        item: "Profile access/extraction",
        expected: "Profile checked",
        actual: player.error,
        detail: player.error
      });
    }
  }

  return rows;
}

function renderDefectsTable(defects) {
  if (!defects.length) {
    return `<p class="empty">No defect candidates found.</p>`;
  }

  return `<table>
    <thead>
      <tr><th>Type</th><th>Player</th><th>Item</th><th>Expected</th><th>Actual</th><th>Link</th></tr>
    </thead>
    <tbody>
      ${defects.map((row) => `<tr>
        <td>${escapeHtml(row.type)}</td>
        <td>${escapeHtml(row.player)}</td>
        <td>${escapeHtml(row.item)}</td>
        <td>${escapeHtml(row.expected)}</td>
        <td>${escapeHtml(row.actual)}</td>
        <td>${row.url ? `<a href="${escapeHtml(row.url)}">Open</a>` : "-"}</td>
      </tr>`).join("")}
    </tbody>
  </table>`;
}

function renderPlayer(player) {
  const comparisons = player.comparisons || [];
  const resultChecks = player.resultChecks || [];
  const eventRows = player.sampleEventRows || [];

  return `<section class="player">
    <div class="player-head">
      <div>
        <h3>${escapeHtml(player.name)}</h3>
        <a href="${escapeHtml(player.url)}">${escapeHtml(player.url)}</a>
      </div>
      <span class="pill ${statusClass(player.status)}">${escapeHtml(player.status || "unknown")}</span>
    </div>

    <h4>Top vs Lower Data</h4>
    <table>
      <thead><tr><th>Item</th><th>Top</th><th>Lower calculated</th><th>Status</th></tr></thead>
      <tbody>
        ${comparisons.map((item) => `<tr>
          <td>${escapeHtml(item.label)}</td>
          <td>${escapeHtml(formatStat(item.label, item.top))}</td>
          <td>${escapeHtml(formatStat(item.label, item.calculated))}</td>
          <td><span class="pill ${statusClass(item.status)}">${escapeHtml(item.status)}</span></td>
        </tr>`).join("")}
      </tbody>
    </table>

    <h4>Result Page Checks</h4>
    ${resultChecks.length ? `<table>
      <thead><tr><th>Event</th><th>Rank</th><th>Earnings</th><th>Status</th><th>Link</th></tr></thead>
      <tbody>
        ${resultChecks.map((item) => `<tr>
          <td>${escapeHtml(item.eventName)}</td>
          <td>${escapeHtml(formatNumber(item.rank))}</td>
          <td>${escapeHtml(formatMoney(item.earnings))}</td>
          <td><span class="pill ${statusClass(item.status)}">${escapeHtml(item.status)}</span></td>
          <td>${item.url ? `<a href="${escapeHtml(item.url)}">Open</a>` : "-"}</td>
        </tr>`).join("")}
      </tbody>
    </table>` : `<p class="empty">No Result links checked.</p>`}

    <h4>Sample Event Rows</h4>
    ${eventRows.length ? `<table>
      <thead><tr><th>Event</th><th>Rank</th><th>Earnings</th><th>Result</th></tr></thead>
      <tbody>
        ${eventRows.map((row) => `<tr>
          <td>${escapeHtml(row.eventName)}</td>
          <td>${escapeHtml(formatNumber(row.rank))}</td>
          <td>${escapeHtml(formatMoney(row.earnings))}</td>
          <td>${row.resultHref ? `<a href="${escapeHtml(row.resultHref)}">Open</a>` : "-"}</td>
        </tr>`).join("")}
      </tbody>
    </table>` : `<p class="empty">No sample event rows captured.</p>`}
  </section>`;
}

function renderHtml(report, summary, defects) {
  const generatedAt = new Date().toISOString();
  const players = report.players || [];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>WSOP Player Standings QA Report</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 28px; font-family: Arial, Helvetica, sans-serif; color: #17212b; background: #f7f8fa; }
    h1, h2, h3, h4 { margin: 0; }
    h1 { font-size: 28px; }
    h2 { font-size: 20px; margin-top: 28px; }
    h3 { font-size: 17px; }
    h4 { font-size: 14px; margin-top: 18px; }
    a { color: #0b5cad; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .meta { margin-top: 8px; color: #5c6b7a; font-size: 13px; line-height: 1.5; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-top: 18px; }
    .card { background: white; border: 1px solid #d9e0e7; border-radius: 6px; padding: 12px; }
    .label { color: #667789; font-size: 12px; }
    .value { font-size: 24px; font-weight: 700; margin-top: 5px; }
    .player { background: white; border: 1px solid #d9e0e7; border-radius: 6px; padding: 16px; margin-top: 14px; }
    .player-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
    .pill { display: inline-block; min-width: 44px; padding: 3px 8px; border-radius: 999px; font-size: 12px; font-weight: 700; text-align: center; text-transform: uppercase; }
    .pill.pass { background: #e3f7eb; color: #116b37; }
    .pill.fail { background: #fde8e8; color: #b42318; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; background: white; }
    th, td { border-bottom: 1px solid #d9e0e7; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #263847; color: white; font-weight: 700; }
    .empty { color: #667789; font-size: 13px; margin: 8px 0 0; }
    .decision { display: inline-flex; align-items: center; gap: 8px; margin-top: 14px; }
    @media print {
      body { background: white; margin: 16px; }
      .player, .card { break-inside: avoid; }
      a { color: #17212b; }
    }
  </style>
</head>
<body>
  <h1>WSOP Player Standings QA Report</h1>
  <div class="meta">
    Generated: ${escapeHtml(generatedAt)}<br>
    Source: ${escapeHtml(summary.playersUrl || "")}<br>
    Run: ${escapeHtml(summary.startedAt || "")} - ${escapeHtml(summary.finishedAt || "")}
  </div>
  <div class="decision">
    <strong>Overall</strong>
    <span class="pill ${statusClass(summary.status)}">${escapeHtml(summary.status)}</span>
  </div>

  <div class="summary">
    <div class="card"><div class="label">Checked Players</div><div class="value">${summary.checkedPlayers}</div></div>
    <div class="card"><div class="label">Passed Players</div><div class="value">${summary.passedPlayers}</div></div>
    <div class="card"><div class="label">Failed Players</div><div class="value">${summary.failedPlayers}</div></div>
    <div class="card"><div class="label">Comparison Pass Rate</div><div class="value">${summary.comparisonPassRate}%</div></div>
    <div class="card"><div class="label">Failed Comparisons</div><div class="value">${summary.failedComparisons}</div></div>
    <div class="card"><div class="label">Result Link Failures</div><div class="value">${summary.failedResultChecks}</div></div>
    <div class="card"><div class="label">Warnings</div><div class="value">${summary.warnings}</div></div>
    <div class="card"><div class="label">Defect Candidates</div><div class="value">${summary.defectCandidates}</div></div>
  </div>

  <h2>Defect Candidates</h2>
  ${renderDefectsTable(defects)}

  <h2>Player Details</h2>
  ${players.map(renderPlayer).join("") || `<p class="empty">No player results available.</p>`}
</body>
</html>
`;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function writeCsv(filePath, rows) {
  const headers = ["type", "player", "item", "expected", "actual", "url", "detail"];
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
  ];
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function sampleReport() {
  return {
    startedAt: "2026-05-19T00:00:00.000Z",
    finishedAt: "2026-05-19T00:05:00.000Z",
    playersUrl: "https://wsop-stage.ggnweb.com/players",
    status: "fail",
    players: [
      {
        status: "fail",
        name: "Sample Player",
        url: "https://wsop-stage.ggnweb.com/players/sample",
        comparisons: [
          { label: "Title", top: 3, calculated: 3, status: "pass" },
          { label: "Bracelets", top: 3, calculated: 2, status: "fail" },
          { label: "Rings", top: 0, calculated: 0, status: "pass" },
          { label: "Final Tables", top: 5, calculated: 5, status: "pass" },
          { label: "Cashes", top: 108, calculated: 108, status: "pass" },
          { label: "Total Earnings", top: 3041039, calculated: 3041039, status: "pass" }
        ],
        resultChecks: [
          {
            url: "https://wsop-stage.ggnweb.com/result/sample",
            eventName: "Sample Event",
            rank: 1,
            earnings: 100000,
            status: "pass"
          }
        ],
        sampleEventRows: [
          {
            eventName: "Sample Event",
            rank: 1,
            earnings: 100000,
            resultHref: "https://wsop-stage.ggnweb.com/result/sample"
          }
        ],
        warnings: []
      }
    ]
  };
}

function runSelfTest() {
  const report = sampleReport();
  const summary = summarize(report);
  const defects = buildDefectRows(report);
  const html = renderHtml(report, summary, defects);

  if (summary.checkedPlayers !== 1) throw new Error("checkedPlayers summary failed");
  if (summary.failedComparisons !== 1) throw new Error("failedComparisons summary failed");
  if (defects.length !== 1) throw new Error("defect candidate generation failed");
  if (!html.includes("WSOP Player Standings QA Report")) throw new Error("HTML title missing");
  if (!html.includes("Sample Player")) throw new Error("HTML player section missing");

  console.log("Report self-test passed.");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  if (args.selfTest) {
    runSelfTest();
    return;
  }

  const report = loadReport(args.input);
  const summary = summarize(report);
  const defects = buildDefectRows(report);
  const html = renderHtml(report, summary, defects);

  fs.mkdirSync(path.dirname(args.html), { recursive: true });
  fs.writeFileSync(args.html, html, "utf8");
  writeJson(args.summary, summary);
  writeCsv(args.defects, defects);

  console.log(`HTML report: ${args.html}`);
  console.log(`Summary: ${args.summary}`);
  console.log(`Defect CSV: ${args.defects}`);
  console.log(`Overall: ${summary.status}`);
}

main();
