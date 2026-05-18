import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const DEFAULT_PLAYERS_URL = "https://wsop-stage.ggnweb.com/players";

const STAT_DEFS = [
  { key: "titles", label: "Title", type: "number" },
  { key: "bracelets", label: "Bracelets", type: "number" },
  { key: "rings", label: "Rings", type: "number" },
  { key: "finalTables", label: "Final Tables", type: "number" },
  { key: "cashes", label: "Cashes", type: "number" },
  { key: "totalEarnings", label: "Total Earnings", type: "money" }
];

function parseArgs(argv) {
  const args = {
    playersUrl: DEFAULT_PLAYERS_URL,
    playerUrls: [],
    limit: 10,
    resultLimit: 3,
    timeout: 45000,
    browserChannel: process.platform === "win32" ? "chrome" : null,
    userDataDir: "automation/.auth/wsop-player-crawler",
    authWaitMs: null,
    headed: false,
    out: "automation/output/wsop-player-crawler-data.json",
    html: "automation/output/wsop-player-crawler-report.html",
    defects: "automation/output/wsop-player-crawler-defects.csv",
    selfTest: false,
    help: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg === "--players-url") args.playersUrl = argv[++i];
    else if (arg === "--player-url") args.playerUrls.push(argv[++i]);
    else if (arg === "--limit") args.limit = Number(argv[++i]);
    else if (arg === "--result-limit") args.resultLimit = Number(argv[++i]);
    else if (arg === "--timeout") args.timeout = Number(argv[++i]);
    else if (arg === "--browser-channel") {
      const value = argv[++i];
      args.browserChannel = value === "none" ? null : value;
    }
    else if (arg === "--user-data-dir") {
      const value = argv[++i];
      args.userDataDir = value === "none" ? null : value;
    }
    else if (arg === "--auth-wait-ms") args.authWaitMs = Number(argv[++i]);
    else if (arg === "--headed") args.headed = true;
    else if (arg === "--out") args.out = argv[++i];
    else if (arg === "--html") args.html = argv[++i];
    else if (arg === "--defects") args.defects = argv[++i];
    else if (arg === "--self-test") args.selfTest = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function printHelp() {
  console.log(`WSOP player standings crawler

Usage:
  node automation/crawl_player_standings.mjs [options]

Options:
  --players-url <url>       Players list URL. Default: ${DEFAULT_PLAYERS_URL}
  --player-url <url>        Crawl a specific player URL. Can be repeated.
  --limit <n>               Number of players to collect from players page. Default: 10
  --result-limit <n>        Result pages to crawl per player. Default: 3
  --timeout <ms>            Page timeout. Default: 45000
  --browser-channel <name>  Installed browser channel, for example chrome. Use none for Playwright Chromium.
  --user-data-dir <path>    Reusable browser profile. Use none for a temporary profile.
  --auth-wait-ms <ms>       Wait for manual Cloudflare Access login when needed.
  --headed                  Show browser while running.
  --out <path>              Structured JSON output path.
  --html <path>             HTML report path.
  --defects <path>          Defect candidate CSV path.
  --self-test               Run local data-model checks without opening a browser.
`);
}

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
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

function parseNumber(value) {
  const match = normalizeText(value).match(/-?\d[\d,]*/);
  return match ? Number(match[0].replace(/,/g, "")) : null;
}

function parseMoney(value) {
  const text = normalizeText(value);
  const match = text.match(/\$?\s*-?\d[\d,]*(?:\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0].replace(/[$,\s]/g, ""));
  return Number.isFinite(parsed) ? Math.round(parsed) : null;
}

function parseRank(value) {
  const text = normalizeText(value);
  const patterns = [
    /(?:^|\s)#\s*(\d{1,5})(?:st|nd|rd|th)?(?:\s|$)/i,
    /(?:^|\s)(\d{1,5})(?:st|nd|rd|th)(?:\s|$)/i,
    /(?:place|rank|finish|result)\D{0,12}(\d{1,5})/i,
    /^(\d{1,5})$/
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return Number(match[1]);
  }

  return null;
}

function parseSummary(bodyText) {
  const compact = normalizeText(bodyText);
  const summary = {};

  for (const stat of STAT_DEFS) {
    const escapedLabel = stat.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const valuePattern = stat.type === "money" ? "(\\$\\s*[\\d,]+(?:\\.\\d+)?)" : "([\\d,]+)";
    const match = compact.match(new RegExp(`${escapedLabel}\\s+${valuePattern}`, "i"));
    summary[stat.key] = match
      ? stat.type === "money"
        ? parseMoney(match[1])
        : parseNumber(match[1])
      : null;
  }

  return summary;
}

function classifyAward(textValue) {
  const text = textValue.toLowerCase();
  if (/\b(ring|circuit|wsopc|wsop-c|circuit event)\b/i.test(text)) return "ring";
  if (/\b(bracelet|wsop|world series of poker|online bracelet)\b/i.test(text)) return "bracelet";
  return "bracelet";
}

function valueByHeader(row, patterns) {
  for (let i = 0; i < row.headers.length; i += 1) {
    const header = normalizeText(row.headers[i]);
    if (patterns.some((pattern) => pattern.test(header))) return row.cells[i] || "";
  }
  return "";
}

function normalizeEvent(row) {
  const rankSource =
    valueByHeader(row, [/rank/i, /place/i, /finish/i, /result/i]) ||
    row.cells.find((cell) => parseRank(cell) !== null) ||
    row.text;
  const earningSource =
    valueByHeader(row, [/earning/i, /prize/i, /winnings/i, /cash/i]) ||
    row.cells.find((cell) => /\$/.test(cell)) ||
    "";
  const eventSource =
    valueByHeader(row, [/event/i, /tournament/i, /series/i]) ||
    row.cells.find((cell) => !/\$/.test(cell) && parseRank(cell) === null && !/^result$/i.test(cell)) ||
    row.text;

  return {
    rowIndex: row.rowIndex,
    eventName: normalizeText(eventSource),
    rank: parseRank(rankSource),
    earnings: parseMoney(earningSource),
    resultUrl: row.resultUrl,
    hasResultControl: row.hasResultControl,
    rowText: row.text,
    cells: row.cells,
    resultPage: null
  };
}

function calculateFromEvents(events) {
  const winningEvents = events.filter((event) => event.rank === 1);
  return {
    titles: winningEvents.length,
    bracelets: winningEvents.filter((event) => classifyAward(`${event.eventName} ${event.rowText}`) === "bracelet").length,
    rings: winningEvents.filter((event) => classifyAward(`${event.eventName} ${event.rowText}`) === "ring").length,
    finalTables: events.filter((event) => event.rank !== null && event.rank >= 1 && event.rank <= 9).length,
    cashes: events.length,
    totalEarnings: events.reduce((sum, event) => sum + (event.earnings || 0), 0)
  };
}

function compareSummary(summary, calculated) {
  return STAT_DEFS.map((stat) => {
    const top = summary[stat.key];
    const calculatedValue = calculated[stat.key];
    const comparable = top !== null && top !== undefined && calculatedValue !== null && calculatedValue !== undefined;
    return {
      key: stat.key,
      label: stat.label,
      top,
      calculated: calculatedValue,
      status: comparable && top === calculatedValue ? "pass" : "fail"
    };
  });
}

function formatValue(label, value) {
  if (value === null || value === undefined || value === "") return "-";
  if (/earning/i.test(label)) return `$${Number(value).toLocaleString("en-US")}`;
  return typeof value === "number" ? value.toLocaleString("en-US") : String(value);
}

function buildDefects(player) {
  const defects = [];

  for (const comparison of player.comparisons || []) {
    if (comparison.status === "pass") continue;
    defects.push({
      type: "Profile summary mismatch",
      player: player.name,
      item: comparison.label,
      expected: formatValue(comparison.label, comparison.top),
      actual: formatValue(comparison.label, comparison.calculated),
      url: player.url,
      detail: `${comparison.label}: top=${formatValue(comparison.label, comparison.top)}, calculated=${formatValue(comparison.label, comparison.calculated)}`
    });
  }

  for (const event of player.events || []) {
    const result = event.resultPage;
    if (!result) continue;
    if (result.status === "pass") continue;
    defects.push({
      type: "Result page mismatch",
      player: player.name,
      item: event.eventName,
      expected: "player/event/rank/earnings visible",
      actual: result.error || result.missing.join(", "),
      url: result.url || event.resultUrl || player.url,
      detail: result.error || JSON.stringify(result.checks)
    });
  }

  for (const warning of player.warnings || []) {
    defects.push({
      type: "Crawler warning",
      player: player.name,
      item: "warning",
      expected: "No warning",
      actual: warning,
      url: player.url,
      detail: warning
    });
  }

  if (player.error) {
    defects.push({
      type: "Crawler error",
      player: player.name,
      item: "player crawl",
      expected: "Crawl completed",
      actual: player.error,
      url: player.url,
      detail: player.error
    });
  }

  return defects;
}

async function waitForAccessLogin(page, authWaitMs) {
  const bodyText = normalizeText(await page.locator("body").innerText({ timeout: 10000 }).catch(() => ""));
  const title = normalizeText(await page.title().catch(() => ""));
  const isAccessPage = /cloudflare access|sign in with|send login code/i.test(`${title} ${bodyText}`);

  if (!isAccessPage) return;
  if (!authWaitMs || authWaitMs <= 0) {
    throw new Error("Cloudflare Access login is required. Run headed with --auth-wait-ms 300000.");
  }

  console.log(`Cloudflare Access login detected. Complete login within ${authWaitMs}ms.`);
  await page.waitForFunction(
    () => !/cloudflare access|sign in with|send login code/i.test(`${document.title} ${document.body?.innerText || ""}`),
    null,
    { timeout: authWaitMs }
  );
  await page.waitForLoadState("networkidle").catch(() => {});
}

async function collectPlayerUrls(page, playersUrl, limit, authWaitMs) {
  if (limit <= 0) return [];
  await page.goto(playersUrl, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle").catch(() => {});
  await waitForAccessLogin(page, authWaitMs);

  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("a[href]"))
      .map((anchor) => ({ href: anchor.href, text: anchor.textContent || "" }))
      .filter((item) => {
        try {
          const url = new URL(item.href);
          const parts = url.pathname.split("/").filter(Boolean);
          return parts[0] === "players" && parts.length >= 2;
        } catch {
          return false;
        }
      });
  });

  const seen = new Set();
  const urls = [];
  for (const link of links) {
    const cleanUrl = link.href.split("#")[0];
    if (seen.has(cleanUrl)) continue;
    seen.add(cleanUrl);
    urls.push(cleanUrl);
    if (urls.length >= limit) break;
  }
  return urls;
}

async function extractPlayerName(page) {
  const heading = await page.locator("h1, h2, [data-testid*=name i], [class*=name i]").first().innerText({ timeout: 3000 }).catch(() => "");
  const title = await page.title().catch(() => "");
  return normalizeText(heading) || normalizeText(title) || page.url();
}

async function extractEventRows(page) {
  const rawRows = await page.evaluate(() => {
    const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
    const rows = [];
    let rowIndex = 0;

    function headersForTable(table) {
      for (const row of Array.from(table.querySelectorAll("thead tr, tr")).slice(0, 2)) {
        const cells = Array.from(row.querySelectorAll("th"));
        if (cells.length) return cells.map((cell) => normalize(cell.textContent));
      }
      return [];
    }

    function looksLikeEventRow(text) {
      return /\$[\d,]+/.test(text) || /\b(result|place|rank|finish|event|bracelet|ring|circuit|wsop)\b/i.test(text);
    }

    for (const table of Array.from(document.querySelectorAll("table"))) {
      const headers = headersForTable(table);
      const tableRows = Array.from(table.querySelectorAll("tbody tr")).length
        ? Array.from(table.querySelectorAll("tbody tr"))
        : Array.from(table.querySelectorAll("tr")).slice(headers.length ? 1 : 0);

      for (const row of tableRows) {
        const cells = Array.from(row.querySelectorAll("td, th")).map((cell) => normalize(cell.textContent));
        const text = normalize(row.textContent);
        if (!cells.length || !looksLikeEventRow(text)) continue;

        row.setAttribute("data-wsop-crawler-row", String(rowIndex));
        const links = Array.from(row.querySelectorAll("a[href]")).map((anchor) => ({
          href: anchor.href,
          text: normalize(anchor.textContent)
        }));
        const resultLink = links.find((link) => /result/i.test(`${link.text} ${link.href}`));
        const resultControl = row.querySelector("a[href], button");

        rows.push({
          rowIndex,
          text,
          cells,
          headers,
          resultUrl: resultLink?.href || null,
          hasResultControl: Boolean(resultLink || Array.from(row.querySelectorAll("button, a")).some((element) => /result/i.test(normalize(element.textContent))))
            || Boolean(resultControl && /result/i.test(normalize(resultControl.textContent)))
        });
        rowIndex += 1;
      }
    }

    return rows;
  });

  return rawRows.map(normalizeEvent).filter((event) => event.rank !== null || event.earnings !== null || event.hasResultControl);
}

async function extractResultPageData(page, player, event) {
  const body = normalizeText(await page.locator("body").innerText({ timeout: 10000 }));
  const playerToken = player.name.split(/\s+/).find((token) => token.length >= 3) || player.name;
  const eventTokens = event.eventName.split(/\s+/).filter((token) => token.length >= 4).slice(0, 3);
  const checks = {
    hasPlayer: playerToken ? body.toLowerCase().includes(playerToken.toLowerCase()) : true,
    hasEvent: eventTokens.length === 0 || eventTokens.some((token) => body.toLowerCase().includes(token.toLowerCase())),
    hasRank: event.rank === null || new RegExp(`(?:#\\s*)?${event.rank}(?:st|nd|rd|th)?\\b`, "i").test(body),
    hasEarnings: event.earnings === null || body.includes(String(event.earnings)) || body.includes(`$${event.earnings.toLocaleString("en-US")}`)
  };
  const missing = Object.entries(checks).filter(([, ok]) => !ok).map(([key]) => key);

  return {
    url: page.url(),
    title: await page.title().catch(() => ""),
    status: missing.length ? "fail" : "pass",
    checks,
    missing,
    extractedTextSample: body.slice(0, 1000)
  };
}

async function crawlResultByUrl(context, player, event, timeout, authWaitMs) {
  const page = await context.newPage();
  try {
    await page.goto(event.resultUrl, { waitUntil: "domcontentloaded", timeout });
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    await waitForAccessLogin(page, authWaitMs);
    return await extractResultPageData(page, player, event);
  } catch (error) {
    return { url: event.resultUrl, status: "fail", error: error.message, checks: {}, missing: ["pageError"] };
  } finally {
    await page.close().catch(() => {});
  }
}

async function crawlResultByClick(context, player, event, timeout, authWaitMs) {
  const page = await context.newPage();
  try {
    await page.goto(player.url, { waitUntil: "domcontentloaded", timeout });
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    await waitForAccessLogin(page, authWaitMs);
    await extractEventRows(page);

    const row = page.locator(`[data-wsop-crawler-row="${event.rowIndex}"]`);
    const control = row.locator("a:has-text('Result'), button:has-text('Result')").first();
    if (!(await control.count())) {
      throw new Error(`Result control not found for row ${event.rowIndex}`);
    }

    const popupPromise = page.waitForEvent("popup", { timeout: 5000 }).catch(() => null);
    const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => null);
    await control.click({ timeout: 10000 });
    const popup = await popupPromise;

    if (popup) {
      await popup.waitForLoadState("domcontentloaded", { timeout: 10000 }).catch(() => {});
      await popup.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
      await waitForAccessLogin(popup, authWaitMs);
      const result = await extractResultPageData(popup, player, event);
      await popup.close().catch(() => {});
      return result;
    }

    await navigationPromise;
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    return await extractResultPageData(page, player, event);
  } catch (error) {
    return { url: player.url, status: "fail", error: error.message, checks: {}, missing: ["clickError"] };
  } finally {
    await page.close().catch(() => {});
  }
}

async function crawlPlayer(context, url, timeout, resultLimit, authWaitMs) {
  const page = await context.newPage();
  const warnings = [];
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout });
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    await waitForAccessLogin(page, authWaitMs);

    const name = await extractPlayerName(page);
    const bodyText = await page.locator("body").innerText({ timeout });
    const summary = parseSummary(bodyText);
    const events = await extractEventRows(page);

    if (!events.length) warnings.push("No structured event rows were crawled.");

    const player = {
      name,
      url,
      summary,
      events,
      calculated: calculateFromEvents(events),
      comparisons: [],
      warnings,
      defects: [],
      status: "fail"
    };

    player.comparisons = compareSummary(player.summary, player.calculated);

    const resultEvents = events.filter((event) => event.resultUrl || event.hasResultControl).slice(0, resultLimit);
    for (const event of resultEvents) {
      event.resultPage = event.resultUrl
        ? await crawlResultByUrl(context, player, event, timeout, authWaitMs)
        : await crawlResultByClick(context, player, event, timeout, authWaitMs);
    }

    if (events.some((event) => event.hasResultControl && !event.resultUrl)) {
      warnings.push("Some Result controls are click-only buttons; crawler attempted click navigation for sampled rows.");
    }

    player.defects = buildDefects(player);
    player.status = player.defects.length ? "fail" : "pass";
    return player;
  } catch (error) {
    return {
      name: url,
      url,
      summary: {},
      events: [],
      calculated: {},
      comparisons: [],
      warnings,
      defects: [],
      status: "fail",
      error: error.message
    };
  } finally {
    await page.close().catch(() => {});
  }
}

function flattenDefects(report) {
  return (report.players || []).flatMap((player) => player.defects?.length ? player.defects : buildDefects(player));
}

function summarize(report) {
  const players = report.players || [];
  const defects = flattenDefects(report);
  const events = players.flatMap((player) => player.events || []);
  const resultPages = events.filter((event) => event.resultPage);
  return {
    status: defects.length ? "fail" : "pass",
    checkedPlayers: players.length,
    passedPlayers: players.filter((player) => player.status === "pass").length,
    failedPlayers: players.filter((player) => player.status !== "pass").length,
    crawledEvents: events.length,
    crawledResultPages: resultPages.length,
    failedResultPages: resultPages.filter((event) => event.resultPage.status !== "pass").length,
    defects: defects.length
  };
}

function renderHtml(report) {
  const summary = summarize(report);
  const defects = flattenDefects(report);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>WSOP Player Standings Crawler Report</title>
  <style>
    body { margin: 28px; font-family: Arial, Helvetica, sans-serif; color: #17212b; background: #f7f8fa; }
    h1 { margin: 0; font-size: 28px; }
    h2 { margin-top: 28px; font-size: 20px; }
    h3 { margin: 0; font-size: 17px; }
    a { color: #0b5cad; text-decoration: none; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; background: white; }
    th, td { border-bottom: 1px solid #d9e0e7; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #263847; color: white; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-top: 18px; }
    .card, .player { background: white; border: 1px solid #d9e0e7; border-radius: 6px; padding: 12px; }
    .player { margin-top: 14px; }
    .label { color: #667789; font-size: 12px; }
    .value { font-size: 23px; font-weight: 700; margin-top: 5px; }
    .pill { display: inline-block; min-width: 44px; padding: 3px 8px; border-radius: 999px; font-size: 12px; font-weight: 700; text-align: center; text-transform: uppercase; }
    .pass { background: #e3f7eb; color: #116b37; }
    .fail { background: #fde8e8; color: #b42318; }
  </style>
</head>
<body>
  <h1>WSOP Player Standings Crawler Report</h1>
  <p>Generated: ${escapeHtml(new Date().toISOString())}</p>
  <p>Source: ${escapeHtml(report.playersUrl || "")}</p>
  <span class="pill ${summary.status}">${escapeHtml(summary.status)}</span>
  <div class="summary">
    <div class="card"><div class="label">Players</div><div class="value">${summary.checkedPlayers}</div></div>
    <div class="card"><div class="label">Events</div><div class="value">${summary.crawledEvents}</div></div>
    <div class="card"><div class="label">Result Pages</div><div class="value">${summary.crawledResultPages}</div></div>
    <div class="card"><div class="label">Defects</div><div class="value">${summary.defects}</div></div>
  </div>
  <h2>Defect Candidates</h2>
  ${defects.length ? `<table><thead><tr><th>Type</th><th>Player</th><th>Item</th><th>Expected</th><th>Actual</th><th>Link</th></tr></thead><tbody>${defects.map((row) => `<tr><td>${escapeHtml(row.type)}</td><td>${escapeHtml(row.player)}</td><td>${escapeHtml(row.item)}</td><td>${escapeHtml(row.expected)}</td><td>${escapeHtml(row.actual)}</td><td>${row.url ? `<a href="${escapeHtml(row.url)}">Open</a>` : "-"}</td></tr>`).join("")}</tbody></table>` : "<p>No defect candidates.</p>"}
  <h2>Players</h2>
  ${(report.players || []).map((player) => `<section class="player">
    <h3>${escapeHtml(player.name)} <span class="pill ${player.status}">${escapeHtml(player.status)}</span></h3>
    <p><a href="${escapeHtml(player.url)}">${escapeHtml(player.url)}</a></p>
    <table>
      <thead><tr><th>Item</th><th>Top</th><th>Crawled Calculation</th><th>Status</th></tr></thead>
      <tbody>${(player.comparisons || []).map((item) => `<tr><td>${escapeHtml(item.label)}</td><td>${escapeHtml(formatValue(item.label, item.top))}</td><td>${escapeHtml(formatValue(item.label, item.calculated))}</td><td><span class="pill ${item.status}">${escapeHtml(item.status)}</span></td></tr>`).join("")}</tbody>
    </table>
    <table>
      <thead><tr><th>Event</th><th>Rank</th><th>Earnings</th><th>Result URL</th><th>Result Status</th></tr></thead>
      <tbody>${(player.events || []).slice(0, 50).map((event) => `<tr><td>${escapeHtml(event.eventName)}</td><td>${escapeHtml(event.rank ?? "-")}</td><td>${escapeHtml(formatValue("Total Earnings", event.earnings))}</td><td>${event.resultPage?.url ? `<a href="${escapeHtml(event.resultPage.url)}">Open</a>` : event.resultUrl ? `<a href="${escapeHtml(event.resultUrl)}">Open</a>` : "-"}</td><td>${event.resultPage ? `<span class="pill ${event.resultPage.status}">${escapeHtml(event.resultPage.status)}</span>` : "-"}</td></tr>`).join("")}</tbody>
    </table>
  </section>`).join("")}
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
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, [headers, ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].map((line) => Array.isArray(line) ? line.join(",") : line).join("\n") + "\n", "utf8");
}

function runSelfTest() {
  const summary = parseSummary("Title 2 Bracelets 1 Rings 1 Final Tables 3 Cashes 4 Total Earnings $165,000");
  const events = [
    normalizeEvent({ rowIndex: 0, text: "WSOP Bracelet #1 $100,000 Result", cells: ["WSOP Bracelet", "#1", "$100,000"], headers: ["Event", "Rank", "Earnings"], resultUrl: "https://example.test/1", hasResultControl: true }),
    normalizeEvent({ rowIndex: 1, text: "WSOP Circuit Ring #1 $50,000 Result", cells: ["WSOP Circuit Ring", "#1", "$50,000"], headers: ["Event", "Rank", "Earnings"], resultUrl: "https://example.test/2", hasResultControl: true }),
    normalizeEvent({ rowIndex: 2, text: "WSOP #9 $10,000 Result", cells: ["WSOP", "#9", "$10,000"], headers: ["Event", "Rank", "Earnings"], resultUrl: "https://example.test/3", hasResultControl: true }),
    normalizeEvent({ rowIndex: 3, text: "WSOP #10 $5,000 Result", cells: ["WSOP", "#10", "$5,000"], headers: ["Event", "Rank", "Earnings"], resultUrl: "https://example.test/4", hasResultControl: true })
  ];
  const calculated = calculateFromEvents(events);
  const comparisons = compareSummary(summary, calculated);
  if (comparisons.some((item) => item.status !== "pass")) {
    throw new Error(`Self-test comparison failed: ${JSON.stringify(comparisons)}`);
  }
  const html = renderHtml({ playersUrl: DEFAULT_PLAYERS_URL, players: [{ name: "Sample", url: "https://example.test/player", summary, events, calculated, comparisons, defects: [], warnings: [], status: "pass" }] });
  if (!html.includes("WSOP Player Standings Crawler Report")) throw new Error("HTML render failed");
  console.log("Crawler self-test passed.");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  if (args.selfTest) {
    runSelfTest();
    return;
  }

  const { chromium } = await import("playwright");
  const launchOptions = { headless: !args.headed };
  if (args.browserChannel) launchOptions.channel = args.browserChannel;

  const authWaitMs = args.authWaitMs ?? (args.headed ? 300000 : 0);
  let browser = null;
  let context = null;

  if (args.userDataDir) {
    fs.mkdirSync(args.userDataDir, { recursive: true });
    context = await chromium.launchPersistentContext(args.userDataDir, launchOptions);
    browser = context.browser();
  } else {
    browser = await chromium.launch(launchOptions);
    context = await browser.newContext();
  }

  try {
    const startedAt = new Date().toISOString();
    let playerUrls = args.playerUrls;
    if (!playerUrls.length) {
      const listPage = await context.newPage();
      playerUrls = await collectPlayerUrls(listPage, args.playersUrl, args.limit, authWaitMs);
      await listPage.close().catch(() => {});
    }

    if (!playerUrls.length) throw new Error(`No player links found at ${args.playersUrl}`);

    const players = [];
    for (const [index, playerUrl] of playerUrls.entries()) {
      console.log(`[${index + 1}/${playerUrls.length}] Crawling ${playerUrl}`);
      players.push(await crawlPlayer(context, playerUrl, args.timeout, args.resultLimit, authWaitMs));
    }

    const report = {
      mode: "crawler",
      startedAt,
      finishedAt: new Date().toISOString(),
      playersUrl: args.playersUrl,
      players
    };
    report.summary = summarize(report);

    writeJson(args.out, report);
    fs.mkdirSync(path.dirname(args.html), { recursive: true });
    fs.writeFileSync(args.html, renderHtml(report), "utf8");
    writeCsv(args.defects, flattenDefects(report));

    console.log(`Crawler JSON: ${args.out}`);
    console.log(`Crawler HTML: ${args.html}`);
    console.log(`Defect CSV: ${args.defects}`);
    console.log(`Overall: ${report.summary.status}`);
    if (report.summary.status !== "pass") process.exitCode = 1;
  } finally {
    if (context) await context.close().catch(() => {});
    else if (browser) await browser.close().catch(() => {});
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
