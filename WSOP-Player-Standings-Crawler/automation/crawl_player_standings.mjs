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
    maxLoadMore: 50,
    resultPageLimit: 30,
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
    else if (arg === "--max-load-more") args.maxLoadMore = Number(argv[++i]);
    else if (arg === "--result-page-limit") args.resultPageLimit = Number(argv[++i]);
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
  --max-load-more <n>       Max Load more clicks per player All tab. Default: 50
  --result-page-limit <n>   Max Final Result pages to inspect per result. Default: 30
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

function normalizeComparable(value) {
  return normalizeText(value).toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
    /(?:^|\s)(\d{1,5})\s*\/\s*\d{1,6}(?:\s|$)/,
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

function parseEntries(value) {
  const match = normalizeText(value).match(/(?:^|\s)\d{1,5}\s*\/\s*(\d{1,6})(?:\s|$)/);
  return match ? Number(match[1]) : null;
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
  const dateSource =
    valueByHeader(row, [/date/i]) ||
    row.cells.find((cell) => /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i.test(cell)) ||
    "";
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
    date: normalizeText(dateSource),
    rankText: normalizeText(rankSource),
    rank: parseRank(rankSource),
    entries: parseEntries(rankSource),
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
      expected: `Final Result row: No ${event.rank ?? "-"}, ${player.name}, ${formatValue("Total Earnings", event.earnings)}`,
      actual: result.error || (result.foundRow ? `Found No ${result.foundRow.no}, ${result.foundRow.player}, ${formatValue("Total Earnings", result.foundRow.earnings)}` : `Missing: ${result.missing.join(", ")}`),
      url: result.url || event.resultUrl || player.url,
      detail: result.error || JSON.stringify({ checks: result.checks, searchedPages: result.searchedPages, foundRow: result.foundRow })
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

function playerNameFromUrl(urlValue) {
  try {
    const url = new URL(urlValue);
    const parts = url.pathname.split("/").filter(Boolean);
    const slug = parts[1] || "";
    if (!slug || /^\d+$/.test(slug)) return "";
    return slug
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  } catch {
    return "";
  }
}

async function extractPlayerName(page) {
  const headings = await page.locator("h1, h2, [data-testid*=name i], [class*=name i]").evaluateAll((nodes) => nodes.map((node) => node.textContent || "")).catch(() => []);
  const title = await page.title().catch(() => "");
  const heading = headings.map(normalizeText).find((value) => value && !/^player profile$/i.test(value));
  return heading || playerNameFromUrl(page.url()) || normalizeText(title).replace(/\s*\|\s*WSOP\.com.*$/i, "") || page.url();
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

  return rawRows
    .map(normalizeEvent)
    .filter((event) => {
      const eventName = normalizeText(event.eventName);
      const hasEventShape = event.cells.length >= 3 && eventName && !/^series\s*\/?\s*events?$/i.test(eventName);
      return hasEventShape || event.rank !== null || event.earnings !== null || event.hasResultControl;
    });
}

async function selectProfileTab(page, tabLabel) {
  const selector = `button:has-text("${tabLabel}"), a:has-text("${tabLabel}"), [role=tab]:has-text("${tabLabel}")`;
  const controls = page.locator(selector);
  const count = await controls.count().catch(() => 0);
  const exactPattern = new RegExp(`^\\s*${escapeRegExp(tabLabel)}\\s*$`, "i");

  for (let i = 0; i < count; i += 1) {
    const control = controls.nth(i);
    const text = normalizeText(await control.innerText({ timeout: 1000 }).catch(() => ""));
    if (!exactPattern.test(text)) continue;
    if (!(await control.isVisible().catch(() => false))) continue;
    await control.click({ timeout: 5000 }).catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(500);
    return true;
  }

  return false;
}

async function expandAllEventRows(page, expectedCashes, maxLoadMore) {
  const expansion = {
    tab: "ALL",
    selectedAllTab: await selectProfileTab(page, "ALL"),
    loadMoreClicks: 0,
    expectedCashes,
    reachedExpectedCashes: false,
    stoppedReason: "not-started"
  };

  let events = await extractEventRows(page);
  const expected = Number.isFinite(expectedCashes) && expectedCashes > 0 ? expectedCashes : null;

  while (expansion.loadMoreClicks < maxLoadMore) {
    if (expected && events.length >= expected) {
      expansion.reachedExpectedCashes = true;
      expansion.stoppedReason = "expected-cashes-reached";
      break;
    }

    const loadMore = page
      .locator("button:has-text('Load more'), a:has-text('Load more'), [role=button]:has-text('Load more')")
      .last();
    if (!(await loadMore.count().catch(() => 0)) || !(await loadMore.isVisible().catch(() => false))) {
      expansion.stoppedReason = "load-more-not-found";
      break;
    }

    const beforeCount = events.length;
    await loadMore.click({ timeout: 10000 });
    expansion.loadMoreClicks += 1;
    await page.waitForFunction(
      (count) => document.querySelectorAll("table tbody tr, table tr").length > count,
      beforeCount,
      { timeout: 5000 }
    ).catch(() => {});
    await page.waitForTimeout(500);
    events = await extractEventRows(page);

    if (events.length <= beforeCount) {
      expansion.stoppedReason = "row-count-did-not-increase";
      break;
    }
  }

  if (expansion.stoppedReason === "not-started") {
    expansion.stoppedReason = expansion.loadMoreClicks >= maxLoadMore ? "max-load-more-reached" : "complete";
  }
  if (expected && events.length >= expected) expansion.reachedExpectedCashes = true;
  expansion.finalEventCount = events.length;
  return { events, expansion };
}

async function extractFinalResultRows(page) {
  return page.evaluate(() => {
    const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
    const parseNumber = (value) => {
      const match = normalize(value).match(/\d[\d,]*/);
      return match ? Number(match[0].replace(/,/g, "")) : null;
    };
    const parseMoney = (value) => {
      const match = normalize(value).match(/-?\d[\d,]*(?:\.\d+)?/);
      return match ? Math.round(Number(match[0].replace(/[,\s]/g, ""))) : null;
    };
    const rows = [];

    for (const table of Array.from(document.querySelectorAll("table"))) {
      const headerText = normalize(table.querySelector("thead")?.textContent || table.textContent || "");
      if (!/\bNo\b/i.test(headerText) || !/\bPlayer\b/i.test(headerText) || !/\bEarnings\b/i.test(headerText)) continue;

      for (const row of Array.from(table.querySelectorAll("tbody tr"))) {
        const cells = Array.from(row.querySelectorAll("td, th")).map((cell) => normalize(cell.textContent));
        if (cells.length < 3) continue;
        const no = parseNumber(cells[0]);
        const earnings = parseMoney(cells[cells.length - 1]);
        const player = cells[1] || "";
        const country = cells.length >= 4 ? cells[cells.length - 2] : "";
        if (no === null || !player) continue;
        rows.push({ no, player, country, earnings, cells, rowText: normalize(row.textContent) });
      }
    }

    return rows;
  });
}

async function clickResultPageNumber(page, pageNumber) {
  if (!pageNumber || pageNumber <= 1) return false;
  const pattern = new RegExp(`^\\s*${pageNumber}\\s*$`);
  const controls = page.locator("a, button, [role=button]").filter({ hasText: pattern });
  const count = await controls.count().catch(() => 0);
  for (let i = 0; i < count; i += 1) {
    const control = controls.nth(i);
    if (!(await control.isVisible().catch(() => false))) continue;
    await control.click({ timeout: 5000 }).catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 7000 }).catch(() => {});
    await page.waitForTimeout(700);
    return true;
  }
  return false;
}

async function clickNextResultPage(page) {
  const controls = page.locator("a, button, [role=button]").filter({ hasText: /^(next|>|›|»)\s*$/i });
  const count = await controls.count().catch(() => 0);
  for (let i = 0; i < count; i += 1) {
    const control = controls.nth(i);
    if (!(await control.isVisible().catch(() => false))) continue;
    const disabled = await control.evaluate((element) => Boolean(element.disabled) || element.getAttribute("aria-disabled") === "true" || /disabled/i.test(element.className || "")).catch(() => false);
    if (disabled) continue;
    await control.click({ timeout: 5000 }).catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 7000 }).catch(() => {});
    await page.waitForTimeout(700);
    return true;
  }
  return false;
}

async function extractResultPageData(page, player, event, resultPageLimit) {
  const targetName = normalizeComparable(player.name);
  const targetRank = event.rank;
  const targetEarnings = event.earnings;
  const visitedUrls = new Set();
  const searchedPages = [];
  let foundRow = null;
  let directPageClicked = false;
  let lastBody = "";

  if (targetRank && targetRank > 50) {
    directPageClicked = await clickResultPageNumber(page, Math.ceil(targetRank / 50));
  }

  for (let pageIndex = 1; pageIndex <= resultPageLimit; pageIndex += 1) {
    const url = page.url();
    if (visitedUrls.has(url) && pageIndex > 1) break;
    visitedUrls.add(url);

    const rows = await extractFinalResultRows(page);
    searchedPages.push({ pageIndex, url, rows: rows.length });
    const candidates = targetRank ? rows.filter((row) => row.no === targetRank) : rows;
    foundRow = candidates.find((row) => {
      const rowName = normalizeComparable(row.player);
      const nameMatches = targetName ? rowName.includes(targetName) || targetName.includes(rowName) : true;
      const earningsMatches = targetEarnings === null || targetEarnings === undefined || row.earnings === targetEarnings;
      return nameMatches && earningsMatches;
    }) || null;

    if (!foundRow) {
      lastBody = normalizeText(await page.locator("body").innerText({ timeout: 10000 }).catch(() => ""));
      const escapedName = escapeRegExp(normalizeText(player.name));
      const rankNameMatches = targetRank
        ? new RegExp(`(?:^|\\s)${targetRank}\\s+${escapedName}\\b`, "i").test(lastBody)
        : lastBody.toLowerCase().includes(normalizeText(player.name).toLowerCase());
      const nameIndex = lastBody.toLowerCase().indexOf(normalizeText(player.name).toLowerCase());
      const nearbyText = nameIndex >= 0 ? lastBody.slice(Math.max(0, nameIndex - 80), nameIndex + 260) : "";
      const earningsMatches = targetEarnings === null || targetEarnings === undefined || nearbyText.includes(targetEarnings.toLocaleString("en-US"));
      if (rankNameMatches && earningsMatches) {
        foundRow = {
          no: targetRank,
          player: player.name,
          country: "",
          earnings: targetEarnings,
          rowText: nearbyText,
          source: "final-result-text"
        };
      }
    }

    if (foundRow) break;
    if (!(await clickNextResultPage(page))) break;
  }

  const checks = {
    hasFinalResultRows: searchedPages.some((item) => item.rows > 0) || Boolean(foundRow),
    directPageClicked,
    rankMatches: !targetRank || Boolean(foundRow && foundRow.no === targetRank),
    playerMatches: Boolean(foundRow),
    earningsMatches: targetEarnings === null || targetEarnings === undefined || Boolean(foundRow && foundRow.earnings === targetEarnings)
  };
  const missing = Object.entries(checks)
    .filter(([key, ok]) => !ok && key !== "directPageClicked")
    .map(([key]) => key);
  const body = lastBody || normalizeText(await page.locator("body").innerText({ timeout: 10000 }).catch(() => ""));

  return {
    url: page.url(),
    title: await page.title().catch(() => ""),
    status: missing.length ? "fail" : "pass",
    checks,
    missing,
    expectedRow: {
      player: player.name,
      no: targetRank,
      earnings: targetEarnings
    },
    foundRow,
    searchedPages,
    extractedTextSample: body.slice(0, 1000)
  };
}

async function crawlResultByUrl(context, player, event, timeout, authWaitMs, resultPageLimit) {
  const page = await context.newPage();
  try {
    await page.goto(event.resultUrl, { waitUntil: "domcontentloaded", timeout });
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    await waitForAccessLogin(page, authWaitMs);
    return await extractResultPageData(page, player, event, resultPageLimit);
  } catch (error) {
    return { url: event.resultUrl, status: "fail", error: error.message, checks: {}, missing: ["pageError"] };
  } finally {
    await page.close().catch(() => {});
  }
}

async function crawlResultByClick(context, player, event, timeout, authWaitMs, resultPageLimit) {
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
      const result = await extractResultPageData(popup, player, event, resultPageLimit);
      await popup.close().catch(() => {});
      return result;
    }

    await navigationPromise;
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    return await extractResultPageData(page, player, event, resultPageLimit);
  } catch (error) {
    return { url: player.url, status: "fail", error: error.message, checks: {}, missing: ["clickError"] };
  } finally {
    await page.close().catch(() => {});
  }
}

async function crawlPlayer(context, url, timeout, resultLimit, authWaitMs, maxLoadMore, resultPageLimit) {
  const page = await context.newPage();
  const warnings = [];
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout });
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    await waitForAccessLogin(page, authWaitMs);

    const name = await extractPlayerName(page);
    const bodyText = await page.locator("body").innerText({ timeout });
    const summary = parseSummary(bodyText);
    const { events, expansion } = await expandAllEventRows(page, summary.cashes, maxLoadMore);

    if (!events.length) warnings.push("No structured event rows were crawled.");
    if (summary.cashes && events.length < summary.cashes) {
      warnings.push(`Only ${events.length} ALL-tab rows were crawled, but profile Cashes shows ${summary.cashes}. Stop reason: ${expansion.stoppedReason}.`);
    }

    const player = {
      name,
      url,
      summary,
      events,
      expansion,
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
        ? await crawlResultByUrl(context, player, event, timeout, authWaitMs, resultPageLimit)
        : await crawlResultByClick(context, player, event, timeout, authWaitMs, resultPageLimit);
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

function formatResultFinding(event) {
  const result = event.resultPage;
  if (!result) return "Not checked";
  if (result.error) return result.error;
  if (result.foundRow) {
    return `Found No ${result.foundRow.no}, ${result.foundRow.player}, ${formatValue("Total Earnings", result.foundRow.earnings)}`;
  }
  return `Missing: ${(result.missing || []).join(", ")}`;
}

function renderHtml(report) {
  const summary = summarize(report);
  const defects = flattenDefects(report);
  const rules = [
    ["Title", "Count ALL-tab events where Rank is 1."],
    ["Bracelets", "Count Rank 1 events classified as WSOP bracelet events."],
    ["Rings", "Count Rank 1 events classified as Circuit/Ring events."],
    ["Final Tables", "Count ALL-tab events where Rank is 1 through 9."],
    ["Cashes", "Count all rows in the ALL tab after Load more expansion."],
    ["Result", "Open Results and find the matching Final Result row by No, Player, and Earnings."]
  ];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>WSOP Player Standings Crawler Report</title>
  <style>
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #17212b; background: #f4f6f8; }
    main { max-width: 1440px; margin: 0 auto; padding: 28px; }
    h1 { margin: 0; font-size: 28px; }
    h2 { margin: 30px 0 8px; font-size: 20px; }
    h3 { margin: 0; font-size: 18px; }
    p { line-height: 1.45; }
    a { color: #0b5cad; text-decoration: none; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; background: white; }
    th, td { border-bottom: 1px solid #d9e0e7; padding: 9px; text-align: left; vertical-align: top; }
    th { background: #263847; color: white; position: sticky; top: 0; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-top: 18px; }
    .card, .player, .panel { background: white; border: 1px solid #d9e0e7; border-radius: 6px; padding: 14px; }
    .player { margin-top: 16px; }
    .label { color: #667789; font-size: 12px; }
    .value { font-size: 23px; font-weight: 700; margin-top: 5px; }
    .muted { color: #667789; }
    .pill { display: inline-block; min-width: 44px; padding: 3px 8px; border-radius: 999px; font-size: 12px; font-weight: 700; text-align: center; text-transform: uppercase; }
    .pass { background: #e3f7eb; color: #116b37; }
    .fail { background: #fde8e8; color: #b42318; }
    .warn { background: #fff4d6; color: #8a5a00; }
    .table-wrap { overflow-x: auto; }
    .small { font-size: 12px; }
    .nowrap { white-space: nowrap; }
  </style>
</head>
<body>
  <main>
    <h1>WSOP Player Standings Crawler Report <span class="pill ${summary.status}">${escapeHtml(summary.status)}</span></h1>
    <p class="muted">Generated: ${escapeHtml(new Date().toISOString())} | Source: <a href="${escapeHtml(report.playersUrl || "")}">${escapeHtml(report.playersUrl || "")}</a></p>
    <div class="summary">
      <div class="card"><div class="label">Players Checked</div><div class="value">${summary.checkedPlayers}</div></div>
      <div class="card"><div class="label">ALL Events Crawled</div><div class="value">${summary.crawledEvents}</div></div>
      <div class="card"><div class="label">Result Pages Checked</div><div class="value">${summary.crawledResultPages}</div></div>
      <div class="card"><div class="label">Defect Candidates</div><div class="value">${summary.defects}</div></div>
    </div>

    <h2>Validation Rules</h2>
    <div class="panel table-wrap">
      <table><thead><tr><th>Item</th><th>Rule</th></tr></thead><tbody>${rules.map(([item, rule]) => `<tr><td class="nowrap">${escapeHtml(item)}</td><td>${escapeHtml(rule)}</td></tr>`).join("")}</tbody></table>
    </div>

    <h2>Defect Candidates</h2>
    <div class="panel table-wrap">
      ${defects.length ? `<table><thead><tr><th>Type</th><th>Player</th><th>Item</th><th>Expected</th><th>Actual</th><th>Link</th></tr></thead><tbody>${defects.map((row) => `<tr><td>${escapeHtml(row.type)}</td><td>${escapeHtml(row.player)}</td><td>${escapeHtml(row.item)}</td><td>${escapeHtml(row.expected)}</td><td>${escapeHtml(row.actual)}</td><td>${row.url ? `<a href="${escapeHtml(row.url)}">Open</a>` : "-"}</td></tr>`).join("")}</tbody></table>` : "<p>No defect candidates.</p>"}
    </div>

    <h2>Players</h2>
    ${(report.players || []).map((player) => `<section class="player">
      <h3>${escapeHtml(player.name)} <span class="pill ${player.status}">${escapeHtml(player.status)}</span></h3>
      <p><a href="${escapeHtml(player.url)}">${escapeHtml(player.url)}</a></p>
      <p class="small muted">ALL tab rows crawled: ${escapeHtml(player.events?.length ?? 0)} / Cashes stat: ${escapeHtml(player.summary?.cashes ?? "-")} | Load more clicks: ${escapeHtml(player.expansion?.loadMoreClicks ?? 0)} | Stop reason: ${escapeHtml(player.expansion?.stoppedReason ?? "-")}</p>
      ${(player.warnings || []).map((warning) => `<p><span class="pill warn">warn</span> ${escapeHtml(warning)}</p>`).join("")}
      <div class="table-wrap">
        <table>
          <thead><tr><th>Stat</th><th>Profile Stat</th><th>Calculated From ALL Tab</th><th>Status</th></tr></thead>
          <tbody>${(player.comparisons || []).map((item) => `<tr><td>${escapeHtml(item.label)}</td><td>${escapeHtml(formatValue(item.label, item.top))}</td><td>${escapeHtml(formatValue(item.label, item.calculated))}</td><td><span class="pill ${item.status}">${escapeHtml(item.status)}</span></td></tr>`).join("")}</tbody>
        </table>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Series / Event</th><th>Date</th><th>Rank</th><th>Earnings</th><th>Result URL</th><th>Result Check</th><th>Final Result Finding</th></tr></thead>
          <tbody>${(player.events || []).slice(0, 100).map((event) => `<tr><td>${escapeHtml(event.eventName)}</td><td class="nowrap">${escapeHtml(event.date || "-")}</td><td class="nowrap">${escapeHtml(event.rankText || event.rank || "-")}</td><td class="nowrap">${escapeHtml(formatValue("Total Earnings", event.earnings))}</td><td>${event.resultPage?.url ? `<a href="${escapeHtml(event.resultPage.url)}">Open</a>` : event.resultUrl ? `<a href="${escapeHtml(event.resultUrl)}">Open</a>` : "-"}</td><td>${event.resultPage ? `<span class="pill ${event.resultPage.status}">${escapeHtml(event.resultPage.status)}</span>` : "-"}</td><td>${escapeHtml(formatResultFinding(event))}</td></tr>`).join("")}</tbody>
        </table>
      </div>
    </section>`).join("")}
  </main>
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
      players.push(await crawlPlayer(context, playerUrl, args.timeout, args.resultLimit, authWaitMs, args.maxLoadMore, args.resultPageLimit));
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
