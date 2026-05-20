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

const STANDINGS_CATEGORIES = [
  { label: "2026 Standings", path: "2026-standings" },
  { label: "All-Time Earnings - Men", path: "all-time-earnings-men" },
  { label: "All-Time Earnings - Women", path: "all-time-earnings-women" },
  { label: "All-Time Bracelets", path: "all-time-bracelets" },
  { label: "All-Time Rings", path: "all-time-rings" }
];

const PROFILE_TAB_CHECKS = [
  { key: "titles", label: "Title", summaryKey: "titles", tabLabels: ["TITLES", "TITLE"] },
  { key: "bracelets", label: "Bracelets", summaryKey: "bracelets", tabLabels: ["BRACELETS", "BRACELET"] },
  { key: "rings", label: "Rings", summaryKey: "rings", tabLabels: ["RINGS", "RING"] },
  { key: "finalTables", label: "Final Tables", summaryKey: "finalTables", tabLabels: ["FINAL TABLES", "FINAL TABLE"] }
];

const DEFAULT_CONCURRENCY = 5;
const MAX_CONCURRENCY = 10;
const DEFAULT_RESULT_PAGE_LIMIT = 0;

// 결과 페이지 캐시 (url -> cachedPages 배열)
// cachedPages: Array<{ pageIndex, url, title, rows, bodyText }>
const resultPageRowsCache = new Map();

// 지수 백오프 기반 재시도 유틸리티
async function retryWithBackoff(fn, retries = 3, delayMs = 1500) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.warn(`    [경고] 작업 실패 (시도 ${i + 1}/${retries}): ${error.message}. ${delayMs}ms 후 재시도...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      delayMs *= 2;
    }
  }
}

function parseArgs(argv) {
  const args = {
    playersUrl: DEFAULT_PLAYERS_URL,
    playerUrls: [],
    limit: 10,
    resultLimit: 0,
    resultRankLimit: 0,
    maxLoadMore: 50,
    resultPageLimit: DEFAULT_RESULT_PAGE_LIMIT,
    timeout: 45000,
    browserChannel: null,
    userDataDir: "automation/.auth/wsop-player-crawler-chromium",
    authWaitMs: null,
    headed: false,
    out: "automation/output/wsop-player-crawler-data.json",
    html: "automation/output/wsop-player-crawler-report.html",
    defects: "automation/output/wsop-player-crawler-defects.csv",
    selfTest: false,
    concurrency: DEFAULT_CONCURRENCY,
    help: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg === "--players-url") args.playersUrl = argv[++i];
    else if (arg === "--player-url") args.playerUrls.push(argv[++i]);
    else if (arg === "--limit") args.limit = Number(argv[++i]);
    else if (arg === "--result-limit") args.resultLimit = Number(argv[++i]);
    else if (arg === "--result-rank-limit") args.resultRankLimit = Number(argv[++i]);
    else if (arg === "--max-load-more") args.maxLoadMore = Number(argv[++i]);
    else if (arg === "--result-page-limit") args.resultPageLimit = Number(argv[++i]);
    else if (arg === "--timeout") args.timeout = Number(argv[++i]);
    else if (arg === "--concurrency") args.concurrency = Number(argv[++i]);
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
  --limit <n>               Number of players to collect per standings category. Default: 10
  --result-limit <n>        Result pages to crawl per player. Use 0 for every Result. Default: 0
  --result-rank-limit <n>   Skip Result checks when player rank is above this value. Use 0 for no rank cap. Default: 0
  --max-load-more <n>       Max Load more clicks per player All tab. Default: 50
  --result-page-limit <n>   Max Final Result pages to inspect per result. Use 0 for every page. Default: ${DEFAULT_RESULT_PAGE_LIMIT}
  --timeout <ms>            Page timeout. Default: 45000
  --concurrency <n>         Max concurrent player crawls. Default: ${DEFAULT_CONCURRENCY}, max: ${MAX_CONCURRENCY}
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

function normalizeConcurrency(value) {
  if (!Number.isFinite(value) || value < 1) {
    throw new Error(`--concurrency must be a positive number. Recommended range: 1-${MAX_CONCURRENCY}.`);
  }

  return Math.min(Math.floor(value), MAX_CONCURRENCY);
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

function formatLabel(label) {
  return {
    Title: "타이틀",
    Bracelets: "브레이슬릿",
    Rings: "링",
    "Final Tables": "파이널 테이블",
    Cashes: "입상 수",
    "Total Earnings": "총 상금"
  }[label] || label;
}

function formatStatus(status) {
  return {
    pass: "통과",
    fail: "실패",
    warn: "주의"
  }[status] || status || "-";
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

  for (const tabCheck of player.tabChecks || []) {
    if (tabCheck.status !== "fail") continue;
    defects.push({
      type: "Profile tab count mismatch",
      player: player.name,
      item: tabCheck.label,
      expected: formatValue(tabCheck.label, tabCheck.expected),
      actual: tabCheck.selectedTab ? formatValue(tabCheck.label, tabCheck.actual) : "Tab not found",
      url: player.url,
      detail: tabCheck.detail
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
      actual: result.error || (result.foundRow ? `Found No ${result.foundRow.no}, ${result.foundRow.player}, ${formatValue("Total Earnings", result.foundRow.earnings)}` : `Missing: ${(result.missing || []).join(", ")}`),
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
  const entries = await collectPlayerEntries(page, playersUrl, limit, authWaitMs);
  return entries.map((entry) => entry.url);
}

async function clickExactTextControl(page, label) {
  const selector = `button:has-text("${label}"), a:has-text("${label}"), [role=tab]:has-text("${label}"), [role=button]:has-text("${label}")`;
  const controls = page.locator(selector);
  const count = await controls.count().catch(() => 0);
  const exactPattern = new RegExp(`^\\s*${escapeRegExp(label)}\\s*$`, "i");

  for (let i = 0; i < count; i += 1) {
    const control = controls.nth(i);
    const text = normalizeText(await control.innerText({ timeout: 1000 }).catch(() => ""));
    if (!exactPattern.test(text)) continue;
    if (!(await control.isVisible().catch(() => false))) continue;
    await control.click({ timeout: 5000 }).catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 7000 }).catch(() => {});
    await page.waitForTimeout(800);
    return true;
  }

  return false;
}

async function extractStandingPlayerLinks(page, limit) {
  const links = await page.evaluate(() => {
    const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
    return Array.from(document.querySelectorAll("a[href]"))
      .map((anchor) => {
        const row = anchor.closest('tr, li, [class*="row" i], [class*="item" i], [class*="card" i]');
        return {
          href: anchor.href,
          text: normalize(anchor.textContent),
          rowText: normalize(row?.textContent || anchor.textContent)
        };
      })
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
  const rows = [];
  for (const link of links) {
    const cleanUrl = link.href.split("#")[0];
    if (seen.has(cleanUrl)) continue;
    seen.add(cleanUrl);
    rows.push({
      url: cleanUrl,
      name: cleanPlayerName(link.text, cleanUrl),
      rowText: link.rowText,
      rank: rows.length + 1
    });
    if (limit > 0 && rows.length >= limit) break;
  }
  return rows;
}

function categoryUrlFor(playersUrl, category) {
  try {
    const url = new URL(playersUrl);
    return new URL(`/player-standings/${category.path}/`, url.origin).href;
  } catch {
    return null;
  }
}

async function collectPlayerEntries(page, playersUrl, limit, authWaitMs) {
  if (limit <= 0) return [];
  
  await retryWithBackoff(async () => {
    await page.goto(playersUrl, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => {});
    await waitForAccessLogin(page, authWaitMs);
  }, 2, 2000);

  const byUrl = new Map();
  let selectedAnyCategory = false;

  for (const category of STANDINGS_CATEGORIES) {
    const categoryUrl = categoryUrlFor(playersUrl, category);
    let selected = false;
    if (categoryUrl) {
      try {
        await retryWithBackoff(async () => {
          await page.goto(categoryUrl, { waitUntil: "domcontentloaded" });
          await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
          await waitForAccessLogin(page, authWaitMs);
        }, 2, 1500);
        selected = true;
      } catch {
        selected = false;
      }
    } else {
      selected = await clickExactTextControl(page, category.label);
    }
    if (!selected) continue;
    const rows = await extractStandingPlayerLinks(page, limit);
    if (!rows.length) continue;
    selectedAnyCategory = true;

    for (const row of rows) {
      if (!byUrl.has(row.url)) {
        byUrl.set(row.url, { url: row.url, standingsSources: [] });
      }
      byUrl.get(row.url).standingsSources.push({
        category: category.label,
        rank: row.rank,
        name: row.name,
        rowText: row.rowText,
        sourceUrl: page.url()
      });
    }
  }

  if (!selectedAnyCategory) {
    const rows = await extractStandingPlayerLinks(page, limit);
    for (const row of rows) {
      byUrl.set(row.url, {
        url: row.url,
        standingsSources: [{ category: "Default standings view", rank: row.rank, name: row.name, rowText: row.rowText, selected: false }]
      });
    }
  }

  return Array.from(byUrl.values());
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

function cleanPlayerName(nameValue, urlValue) {
  let name = normalizeText(nameValue).replace(/\bPlayer Profile\b/gi, "").trim();
  const slugName = playerNameFromUrl(urlValue);
  const normalizedName = normalizeComparable(name);
  const normalizedSlug = normalizeComparable(slugName);

  if (slugName && normalizedSlug) {
    if (normalizedName === normalizedSlug.repeat(2) || (normalizedName.includes(normalizedSlug) && normalizedName !== normalizedSlug)) {
      return slugName;
    }
  }

  if (name.length % 2 === 0) {
    const half = name.length / 2;
    const first = name.slice(0, half);
    const second = name.slice(half);
    if (normalizeComparable(first) === normalizeComparable(second)) {
      return normalizeText(first);
    }
  }

  return name || slugName || urlValue;
}

async function extractPlayerName(page) {
  const headings = await page.locator("h1, h2, [data-testid*=name i], [class*=name i]").evaluateAll((nodes) => nodes.map((node) => node.textContent || "")).catch(() => []);
  const title = await page.title().catch(() => "");
  const heading = headings.map(normalizeText).find((value) => value && !/^player profile$/i.test(value));
  return cleanPlayerName(heading || normalizeText(title).replace(/\s*\|\s*WSOP\.com.*$/i, ""), page.url());
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

async function collectProfileTabChecks(page, summary) {
  const checks = [];

  for (const tabCheck of PROFILE_TAB_CHECKS) {
    const expected = summary?.[tabCheck.summaryKey];
    const check = {
      key: tabCheck.key,
      label: tabCheck.label,
      expected,
      actual: null,
      selectedTab: null,
      status: "warn",
      detail: ""
    };

    for (const tabLabel of tabCheck.tabLabels) {
      if (await selectProfileTab(page, tabLabel)) {
        check.selectedTab = tabLabel;
        break;
      }
    }

    if (!check.selectedTab) {
      check.status = Number.isFinite(expected) && expected > 0 ? "fail" : "warn";
      check.detail = `Profile tab not found. Tried: ${tabCheck.tabLabels.join(", ")}.`;
      checks.push(check);
      continue;
    }

    const tabEvents = await extractEventRows(page);
    check.actual = tabEvents.length;
    check.status = Number.isFinite(expected) && expected === check.actual ? "pass" : "fail";
    check.detail = `${check.selectedTab} tab rows=${check.actual}, profile ${tabCheck.label}=${expected ?? "-"}.`;
    checks.push(check);
  }

  await selectProfileTab(page, "ALL").catch(() => {});
  return checks;
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

function rankRangeForRows(rows) {
  const ranks = rows
    .map((row) => row.no)
    .filter((rank) => Number.isFinite(rank));
  if (!ranks.length) return null;
  return {
    min: Math.min(...ranks),
    max: Math.max(...ranks)
  };
}

function resultPageInspectionLimit(resultPageLimit) {
  if (resultPageLimit === 0) return Number.MAX_SAFE_INTEGER;
  if (!Number.isFinite(resultPageLimit) || resultPageLimit < 0) {
    throw new Error("--result-page-limit must be 0 or a positive number.");
  }
  return Math.floor(resultPageLimit);
}

function resultPageSignature(url, rows, bodyText) {
  const range = rankRangeForRows(rows || []);
  const rangeKey = range ? `${range.min}-${range.max}` : "no-ranks";
  const rowKey = (rows || [])
    .slice(0, 5)
    .map((row) => `${row.no}:${normalizeComparable(row.player)}:${row.earnings ?? ""}`)
    .join("|");
  return `${url || "unknown-url"}::${rangeKey}::${rowKey || bodyText.slice(0, 500)}`;
}

function cachedPagesCoverEvent(cachedPages, event) {
  const targetRank = event.rank;
  if (!targetRank) return false;

  return cachedPages.some((cachedPage) => {
    const range = rankRangeForRows(cachedPage.rows || []);
    if (!range) return false;
    return targetRank >= range.min && targetRank <= range.max;
  });
}

function mergeCachedResultPages(existingPages = [], incomingPages = []) {
  const merged = new Map();
  for (const page of [...existingPages, ...incomingPages]) {
    const range = rankRangeForRows(page.rows || []);
    const rangeKey = range ? `${range.min}-${range.max}` : "no-ranks";
    const key = `${page.url || "unknown-url"}::${page.resultPageNumber || page.pageIndex || "unknown-page"}::${rangeKey}`;
    merged.set(key, page);
  }
  return Array.from(merged.values()).sort((a, b) => {
    const aRank = rankRangeForRows(a.rows || [])?.min ?? Number.MAX_SAFE_INTEGER;
    const bRank = rankRangeForRows(b.rows || [])?.min ?? Number.MAX_SAFE_INTEGER;
    return aRank - bRank;
  });
}

function storeResultPageCache(urlKey, cachedPages) {
  if (!urlKey || !cachedPages?.length) return;
  const existingPages = resultPageRowsCache.get(urlKey) || [];
  resultPageRowsCache.set(urlKey, mergeCachedResultPages(existingPages, cachedPages));
}

// 캐시된 결과 페이지 데이터를 가지고 로컬에서 검증을 수행하는 유틸리티
function evaluateResultFromCachedPages(cachedPages, player, event, urlKey) {
  const targetName = normalizeComparable(player.name);
  const targetRank = event.rank;
  const targetEarnings = event.earnings;
  const searchedPages = [];
  let foundRow = null;

  for (const cachedPage of cachedPages) {
    searchedPages.push({ pageIndex: cachedPage.pageIndex, url: cachedPage.url, rows: cachedPage.rows.length });
    const candidates = targetRank ? cachedPage.rows.filter((row) => row.no === targetRank) : cachedPage.rows;
    foundRow = candidates.find((row) => {
      const rowName = normalizeComparable(row.player);
      const nameMatches = targetName ? rowName.includes(targetName) || targetName.includes(rowName) : true;
      const earningsMatches = targetEarnings === null || targetEarnings === undefined || row.earnings === targetEarnings;
      return nameMatches && earningsMatches;
    }) || null;

    if (foundRow) break;
  }

  if (!foundRow) {
    for (const cachedPage of cachedPages) {
      const lastBody = cachedPage.bodyText || "";
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
        break;
      }
    }
  }

  const checks = {
    hasFinalResultRows: searchedPages.some((item) => item.rows > 0) || Boolean(foundRow),
    directPageClicked: false,
    rankMatches: !targetRank || Boolean(foundRow && foundRow.no === targetRank),
    playerMatches: Boolean(foundRow),
    earningsMatches: targetEarnings === null || targetEarnings === undefined || Boolean(foundRow && foundRow.earnings === targetEarnings)
  };
  const missing = Object.entries(checks)
    .filter(([key, ok]) => !ok && key !== "directPageClicked")
    .map(([key]) => key);
  const cacheCoversTarget = cachedPagesCoverEvent(cachedPages, event);

  if (missing.length && !cacheCoversTarget) {
    return null;
  }

  return {
    url: urlKey,
    title: cachedPages[0]?.title || "",
    status: missing.length ? "fail" : "pass",
    checks,
    missing,
    cacheHit: true,
    cacheCoversTarget,
    expectedRow: {
      player: player.name,
      no: targetRank,
      earnings: targetEarnings
    },
    foundRow,
    searchedPages,
    extractedTextSample: cachedPages[cachedPages.length - 1]?.bodyText?.slice(0, 1000) || ""
  };
}

async function extractResultPageData(page, player, event, resultPageLimit) {
  const targetName = normalizeComparable(player.name);
  const targetRank = event.rank;
  const targetEarnings = event.earnings;
  const pageInspectionLimit = resultPageInspectionLimit(resultPageLimit);
  const visitedPageSignatures = new Set();
  const searchedPages = [];
  const cachedPages = [];
  let foundRow = null;
  let directPageClicked = false;
  let lastBody = "";
  let resultPageNumber = 1;

  if (targetRank && targetRank > 50) {
    resultPageNumber = Math.ceil(targetRank / 50);
    directPageClicked = await clickResultPageNumber(page, resultPageNumber);
  }

  for (let pageIndex = 1; pageIndex <= pageInspectionLimit; pageIndex += 1) {
    const url = page.url();

    const rows = await extractFinalResultRows(page);
    const title = await page.title().catch(() => "");
    const bodyText = normalizeText(await page.locator("body").innerText({ timeout: 10000 }).catch(() => ""));
    const pageSignature = resultPageSignature(url, rows, bodyText);
    if (visitedPageSignatures.has(pageSignature)) break;
    visitedPageSignatures.add(pageSignature);

    cachedPages.push({ pageIndex, resultPageNumber, url, title, rows, bodyText });
    searchedPages.push({ pageIndex, url, rows: rows.length });
    const candidates = targetRank ? rows.filter((row) => row.no === targetRank) : rows;
    foundRow = candidates.find((row) => {
      const rowName = normalizeComparable(row.player);
      const nameMatches = targetName ? rowName.includes(targetName) || targetName.includes(rowName) : true;
      const earningsMatches = targetEarnings === null || targetEarnings === undefined || row.earnings === targetEarnings;
      return nameMatches && earningsMatches;
    }) || null;

    if (!foundRow) {
      lastBody = bodyText;
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
    resultPageNumber += 1;
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
    cachedPages,
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
  const urlKey = event.resultUrl;
  
  // 캐시 확인
  if (resultPageRowsCache.has(urlKey)) {
    const cachedResult = evaluateResultFromCachedPages(resultPageRowsCache.get(urlKey), player, event, urlKey);
    if (cachedResult) {
      console.log(`    [Cache Hit] 결과 페이지 캐시 데이터 사용 (${player.name}): ${urlKey}`);
      return cachedResult;
    }
    console.log(`    [Cache Miss] 캐시 범위 밖 Result입니다. 실제 페이지를 확인합니다 (${player.name}): ${urlKey}`);
  }

  const page = await context.newPage();
  try {
    // 백오프 재시도를 페이지 로드에 반영
    await retryWithBackoff(async () => {
      await page.goto(event.resultUrl, { waitUntil: "domcontentloaded", timeout });
      await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
      await waitForAccessLogin(page, authWaitMs);
    }, 2, 2000);

    // 크롤링하면서 데이터를 누적하여 캐시 데이터 수집
    const cachedPages = [];
    const targetName = normalizeComparable(player.name);
    const targetRank = event.rank;
    const targetEarnings = event.earnings;
    const pageInspectionLimit = resultPageInspectionLimit(resultPageLimit);
    const visitedPageSignatures = new Set();
    const searchedPages = [];
    let foundRow = null;
    let directPageClicked = false;
    let lastBody = "";
    let resultPageNumber = 1;

    if (targetRank && targetRank > 50) {
      resultPageNumber = Math.ceil(targetRank / 50);
      directPageClicked = await clickResultPageNumber(page, resultPageNumber);
    }

    for (let pageIndex = 1; pageIndex <= pageInspectionLimit; pageIndex += 1) {
      const url = page.url();

      const rows = await extractFinalResultRows(page);
      const title = await page.title().catch(() => "");
      const bodyText = normalizeText(await page.locator("body").innerText({ timeout: 10000 }).catch(() => ""));
      const pageSignature = resultPageSignature(url, rows, bodyText);
      if (visitedPageSignatures.has(pageSignature)) break;
      visitedPageSignatures.add(pageSignature);

      // 캐시 페이지 적재
      cachedPages.push({ pageIndex, resultPageNumber, url, title, rows, bodyText });

      searchedPages.push({ pageIndex, url, rows: rows.length });
      const candidates = targetRank ? rows.filter((row) => row.no === targetRank) : rows;
      foundRow = candidates.find((row) => {
        const rowName = normalizeComparable(row.player);
        const nameMatches = targetName ? rowName.includes(targetName) || targetName.includes(rowName) : true;
        const earningsMatches = targetEarnings === null || targetEarnings === undefined || row.earnings === targetEarnings;
        return nameMatches && earningsMatches;
      }) || null;

      if (!foundRow) {
        lastBody = bodyText;
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
      resultPageNumber += 1;
    }

    // 전역 캐시에 저장
    storeResultPageCache(urlKey, cachedPages);

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
  } catch (error) {
    return { url: event.resultUrl, status: "fail", error: error.message, checks: {}, missing: ["pageError"] };
  } finally {
    await page.close().catch(() => {});
  }
}

async function crawlResultByClick(context, player, event, timeout, authWaitMs, resultPageLimit) {
  const page = await context.newPage();
  try {
    await retryWithBackoff(async () => {
      await page.goto(player.url, { waitUntil: "domcontentloaded", timeout });
      await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
      await waitForAccessLogin(page, authWaitMs);
    }, 2, 2000);
    
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
      const finalUrl = popup.url();
      
      // 만약 팝업 URL이 캐시에 있으면 바로 처리하고 팝업 닫기
      if (resultPageRowsCache.has(finalUrl)) {
        const cachedResult = evaluateResultFromCachedPages(resultPageRowsCache.get(finalUrl), player, event, finalUrl);
        if (cachedResult) {
          console.log(`    [Cache Hit via Popup] 결과 페이지 캐시 데이터 사용 (${player.name}): ${finalUrl}`);
          await popup.close().catch(() => {});
          return cachedResult;
        }
        console.log(`    [Cache Miss via Popup] 캐시 범위 밖 Result입니다. 실제 페이지를 확인합니다 (${player.name}): ${finalUrl}`);
      }

      await popup.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
      await waitForAccessLogin(popup, authWaitMs);
      
      // 팝업 페이지 크롤링 및 결과 캐시 적재
      const result = await extractResultPageData(popup, player, event, resultPageLimit);
      storeResultPageCache(finalUrl, result.cachedPages);
      delete result.cachedPages;

      await popup.close().catch(() => {});
      return result;
    }

    await navigationPromise;
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    const finalUrl = page.url();

    if (resultPageRowsCache.has(finalUrl)) {
      const cachedResult = evaluateResultFromCachedPages(resultPageRowsCache.get(finalUrl), player, event, finalUrl);
      if (cachedResult) {
        console.log(`    [Cache Hit via Navigation] 결과 페이지 캐시 데이터 사용 (${player.name}): ${finalUrl}`);
        return cachedResult;
      }
      console.log(`    [Cache Miss via Navigation] 캐시 범위 밖 Result입니다. 실제 페이지를 확인합니다 (${player.name}): ${finalUrl}`);
    }

    const result = await extractResultPageData(page, player, event, resultPageLimit);
    storeResultPageCache(finalUrl, result.cachedPages);
    delete result.cachedPages;

    return result;
  } catch (error) {
    return { url: player.url, status: "fail", error: error.message, checks: {}, missing: ["clickError"] };
  } finally {
    await page.close().catch(() => {});
  }
}

async function crawlPlayer(context, url, timeout, resultLimit, resultRankLimit, authWaitMs, maxLoadMore, resultPageLimit, standingsSources = []) {
  const page = await context.newPage();
  const warnings = [];
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout });
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    await waitForAccessLogin(page, authWaitMs);

    // Cashes 또는 Earnings 통계 텍스트가 렌더링될 때까지 명시적 대기
    await page.waitForFunction(() => {
      const text = document.body?.innerText || "";
      return /cashes/i.test(text) || /earnings/i.test(text);
    }, null, { timeout: 10000 }).catch(() => {});

    const name = await extractPlayerName(page);
    const bodyText = await page.locator("body").innerText({ timeout });
    const summary = parseSummary(bodyText);
    const { events, expansion } = await expandAllEventRows(page, summary.cashes, maxLoadMore);
    const tabChecks = await collectProfileTabChecks(page, summary);

    if (!events.length) warnings.push("수집된 이벤트 행이 존재하지 않습니다.");
    if (summary.cashes && events.length < summary.cashes) {
      warnings.push(`프로필 입상 수(Cashes)는 ${summary.cashes}개이나, 수집된 ALL 탭 행은 ${events.length}개입니다. (중단 사유: ${expansion.stoppedReason})`);
    }
    for (const tabCheck of tabChecks) {
      if (tabCheck.status === "warn") warnings.push(tabCheck.detail);
    }

    const player = {
      name,
      url,
      standingsSources,
      summary,
      events,
      expansion,
      tabChecks,
      calculated: calculateFromEvents(events),
      comparisons: [],
      warnings,
      defects: [],
      status: "fail"
    };

    player.comparisons = compareSummary(player.summary, player.calculated);

    const checkableResultEvents = events.filter((event) => event.resultUrl || event.hasResultControl);
    const rankEligibleResultEvents = [];
    const rankSkippedResultEvents = [];

    for (const event of checkableResultEvents) {
      if (resultRankLimit > 0 && event.rank !== null && event.rank > resultRankLimit) {
        event.resultSkipped = `건너뜀 (ResultRankLimit은 ${resultRankLimit}이나 선수의 순위는 ${event.rank})`;
        rankSkippedResultEvents.push(event);
      } else {
        rankEligibleResultEvents.push(event);
      }
    }

    const resultEvents = resultLimit > 0 ? rankEligibleResultEvents.slice(0, resultLimit) : rankEligibleResultEvents;
    const resultEventsToSkip = resultLimit > 0 ? rankEligibleResultEvents.slice(resultLimit) : [];
    for (const event of resultEvents) {
      event.resultPage = event.resultUrl
        ? await crawlResultByUrl(context, player, event, timeout, authWaitMs, resultPageLimit)
        : await crawlResultByClick(context, player, event, timeout, authWaitMs, resultPageLimit);
    }
    for (const event of resultEventsToSkip) {
      event.resultSkipped = `건너뜀 (ResultLimit ${resultLimit} 초과)`;
    }
    if (rankSkippedResultEvents.length) {
      warnings.push(`선수 순위 제한(${resultRankLimit})으로 인해 결과 확인 ${rankSkippedResultEvents.length}건이 건너뛰어졌습니다.`);
    }

    if (events.some((event) => event.hasResultControl && !event.resultUrl)) {
      warnings.push("결과 확인 일부 컨트롤이 단순 버튼 형태입니다. 일부 행에 대해 클릭 네비게이션이 실행되었습니다.");
    }

    player.defects = buildDefects(player);
    player.status = player.defects.length ? "fail" : "pass";
    return player;
  } catch (error) {
    return {
      name: url,
      url,
      standingsSources,
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
  const tabChecks = players.flatMap((player) => player.tabChecks || []);
  const standingsCategories = new Set(players.flatMap((player) => (player.standingsSources || []).map((source) => source.category)));
  const runStatus = report.runStatus || "complete";
  const totalPlayers = report.totalPlayers || players.length;
  const completedPlayers = players.length;
  const pendingPlayers = Math.max(0, totalPlayers - completedPlayers);
  const status = defects.length ? "fail" : runStatus === "complete" ? "pass" : "warn";
  return {
    status,
    runStatus,
    interruptedReason: report.interruptedReason || "",
    totalPlayers,
    completedPlayers,
    pendingPlayers,
    checkedPlayers: completedPlayers,
    checkedStandingsCategories: standingsCategories.size,
    passedPlayers: players.filter((player) => player.status === "pass").length,
    failedPlayers: players.filter((player) => player.status !== "pass").length,
    crawledEvents: events.length,
    tabChecks: tabChecks.length,
    failedTabChecks: tabChecks.filter((check) => check.status === "fail").length,
    crawledResultPages: resultPages.length,
    failedResultPages: resultPages.filter((event) => event.resultPage.status !== "pass").length,
    defects: defects.length
  };
}

function summarizeStandingsSources(players) {
  const byCategory = new Map();
  for (const player of players || []) {
    for (const source of player.standingsSources || []) {
      if (!byCategory.has(source.category)) byCategory.set(source.category, []);
      byCategory.get(source.category).push({ player: player.name, url: player.url, rank: source.rank });
    }
  }
  return Array.from(byCategory.entries()).map(([category, entries]) => ({
    category,
    entries: entries.sort((a, b) => (a.rank || 999999) - (b.rank || 999999))
  }));
}

function formatResultFinding(event) {
  const result = event.resultPage;
  if (!result) {
    if (event.resultSkipped) return event.resultSkipped;
    if (event.resultUrl || event.hasResultControl) return "Pending Result check.";
    return "No Result control found.";
  }
  if (result.error) return result.error;
  if (result.foundRow) {
    return `Found No ${result.foundRow.no}, ${result.foundRow.player}, ${formatValue("Total Earnings", result.foundRow.earnings)}`;
  }
  return `Missing: ${(result.missing || []).join(", ")}`;
}

function formatKoreanResultFinding(event) {
  const result = event.resultPage;
  if (!result) {
    if (event.resultSkipped) return `건너뜀: ${event.resultSkipped}`;
    if (event.resultUrl || event.hasResultControl) return "Result 확인 대기";
    return "Result 버튼/링크 없음";
  }
  if (result.error) return result.error;
  if (result.foundRow) {
    return `일치 행 발견: No ${result.foundRow.no}, ${result.foundRow.player}, ${formatValue("Total Earnings", result.foundRow.earnings)}`;
  }
  return `누락: ${(result.missing || []).join(", ")}`;
}

function formatKoreanDefectType(type) {
  return {
    "Profile summary mismatch": "프로필 요약 불일치",
    "Profile tab count mismatch": "프로필 탭 개수 불일치",
    "Result page mismatch": "Result 페이지 불일치",
    "Crawler warning": "크롤러 경고",
    "Crawler error": "크롤러 오류"
  }[type] || type;
}

function koreanHtmlPath(htmlPath) {
  const parsed = path.parse(htmlPath);
  return path.join(parsed.dir, `${parsed.name}-ko${parsed.ext || ".html"}`);
}

// 프리미엄 인터랙티브 HTML 템플릿 렌더러 함수
function renderReportTemplate(report, isKo) {
  const summary = summarize(report);
  const defects = flattenDefects(report);
  const standingsSourceSummary = summarizeStandingsSources(report.players);
  
  const totalChecked = summary.checkedPlayers || 1;
  const passPercent = Math.round((summary.passedPlayers / totalChecked) * 100);

  const t = {
    title: isKo ? "WSOP 선수 순위 크롤러 리포트" : "WSOP Player Standings Crawler Report",
    generated: isKo ? "생성 시간" : "Generated",
    source: isKo ? "대상 사이트" : "Source",
    runStatus: isKo ? "실행 상태" : "Run Status",
    category: isKo ? "Standings 카테고리" : "Standings Categories",
    playersChecked: isKo ? "확인한 선수" : "Players Checked",
    eventsCrawled: isKo ? "ALL 탭 이벤트 수집" : "ALL Events Crawled",
    tabChecks: isKo ? "프로필 탭 검증" : "Profile Tab Checks",
    resultPages: isKo ? "Result 페이지 확인" : "Result Pages Checked",
    defectCandidates: isKo ? "결함 후보" : "Defect Candidates",
    validationRules: isKo ? "검증 규칙" : "Validation Rules",
    ruleItem: isKo ? "항목" : "Item",
    ruleRule: isKo ? "규칙" : "Rule",
    coverage: isKo ? "Standings 수집 범위" : "Standings Coverage",
    defectList: isKo ? "결함 후보 목록" : "Defect Candidates List",
    playersDetail: isKo ? "선수별 상세 결과" : "Players Detail",
    searchPlaceholder: isKo ? "선수 이름으로 검색..." : "Search players by name...",
    filterAll: isKo ? "전체" : "All",
    filterPass: isKo ? "통과" : "Pass",
    filterFail: isKo ? "실패" : "Fail",
    filterWarn: isKo ? "주의" : "Warn",
    noDefects: isKo ? "발견된 결함 후보가 없습니다." : "No defect candidates found.",
    profileStat: isKo ? "프로필 표시값" : "Profile Stat",
    calculatedValue: isKo ? "ALL 탭 계산값" : "Calculated From ALL Tab",
    statusText: isKo ? "상태" : "Status",
    tabHeader: isKo ? "탭" : "Tab",
    selectedTabLabel: isKo ? "클릭한 탭 라벨" : "Selected Label",
    visibleRows: isKo ? "표시 row 수" : "Visible Rows",
    detailText: isKo ? "상세 정보" : "Detail",
    seriesEvent: isKo ? "시리즈 / 이벤트" : "Series / Event",
    dateText: isKo ? "일자" : "Date",
    rankText: isKo ? "순위" : "Rank",
    earningsText: isKo ? "상금" : "Earnings",
    resultUrlText: isKo ? "Result URL" : "Result URL",
    resultCheckText: isKo ? "Result 확인" : "Result Check",
    finalFindingText: isKo ? "최종 결과 확인 내용" : "Final Result Finding",
    rulesData: isKo ? [
      ["Standings 카테고리", `${STANDINGS_CATEGORIES.map((c) => c.label).join(", ")}에서 상위 선수를 수집합니다.`],
      ["타이틀", "ALL 탭 이벤트 중 Rank가 1인 row를 계산합니다."],
      ["브레이슬릿", "Rank 1 이벤트 중 WSOP 브레이슬릿 이벤트로 분류되는 row를 계산합니다."],
      ["링", "Rank 1 이벤트 중 Circuit/Ring 이벤트로 분류되는 row를 계산합니다."],
      ["파이널 테이블", "ALL 탭 이벤트 중 Rank가 1~9인 row를 계산합니다."],
      ["입상 수", "Load more로 펼친 ALL 탭 전체 row 수를 계산합니다."],
      ["프로필 탭", "Title, Bracelets, Rings, Final Tables 탭을 눌러 표시 row 수와 프로필 요약값을 비교합니다."],
      ["Result", "Result 페이지를 열어 최종 결과표에서 No, 선수명, 상금이 맞는지 확인합니다."]
    ] : [
      ["Standings categories", `Collect top players from ${STANDINGS_CATEGORIES.map((c) => c.label).join(", ")}.`],
      ["Title", "Count ALL-tab events where Rank is 1."],
      ["Bracelets", "Count Rank 1 events classified as WSOP bracelet events."],
      ["Rings", "Count Rank 1 events classified as Circuit/Ring events."],
      ["Final Tables", "Count ALL-tab events where Rank is 1 through 9."],
      ["Cashes", "Count all rows in the ALL tab after Load more expansion."],
      ["Profile tabs", "Click Title, Bracelets, Rings, and Final Tables tabs and compare visible row counts with profile stats."],
      ["Result", "Open Results and find the matching Final Result row by No, Player, and Earnings."]
    ]
  };

  return `<!doctype html>
<html lang="${isKo ? "ko" : "en"}">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(t.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-main: #0b0f19;
      --bg-card: #151d30;
      --bg-header: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
      --bg-input: #1f293d;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --border: rgba(255, 255, 255, 0.08);
      --primary: #8b5cf6;
      --primary-hover: #a78bfa;
      --success: #10b981;
      --success-bg: rgba(16, 185, 129, 0.15);
      --danger: #ef4444;
      --danger-bg: rgba(239, 68, 68, 0.15);
      --warning: #f59e0b;
      --warning-bg: rgba(245, 158, 11, 0.15);
      --shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
      --card-border: 1px solid rgba(255, 255, 255, 0.05);
    }
    body.light-mode {
      --bg-main: #f3f4f6;
      --bg-card: #ffffff;
      --bg-header: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      --bg-input: #ffffff;
      --text-main: #111827;
      --text-muted: #4b5563;
      --border: rgba(0, 0, 0, 0.08);
      --primary: #6d28d9;
      --primary-hover: #5b21b6;
      --success: #059669;
      --success-bg: #ecfdf5;
      --danger: #dc2626;
      --danger-bg: #fef2f2;
      --warning: #d97706;
      --warning-bg: #fffbeb;
      --shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
      --card-border: 1px solid rgba(0, 0, 0, 0.06);
    }

    * { box-sizing: border-box; transition: background-color 0.3s, color 0.3s, border-color 0.3s; }
    body { margin: 0; font-family: 'Inter', sans-serif; background-color: var(--bg-main); color: var(--text-main); line-height: 1.5; padding-bottom: 60px; }
    
    header { background: var(--bg-header); padding: 40px 30px; position: relative; overflow: hidden; border-bottom: var(--card-border); }
    header::after { content: ''; position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%); right: -100px; top: -100px; pointer-events: none; }
    
    .header-content { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 30px; flex-wrap: wrap; }
    .header-title h1 { margin: 0; font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; }
    .header-title p { margin: 8px 0 0; color: var(--text-muted); font-size: 14px; }
    .header-actions { display: flex; align-items: center; gap: 20px; }

    .theme-toggle-btn { background: var(--bg-input); border: var(--card-border); color: var(--text-main); padding: 10px 15px; border-radius: 9999px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 13px; box-shadow: var(--shadow); }
    .theme-toggle-btn:hover { border-color: var(--primary); }

    main { max-width: 1400px; margin: 30px auto; padding: 0 20px; }

    .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; margin-bottom: 40px; }
    .kpi-card { background: var(--bg-card); border-radius: 16px; padding: 22px; border: var(--card-border); box-shadow: var(--shadow); position: relative; overflow: hidden; }
    .kpi-card:hover { transform: translateY(-4px); box-shadow: 0 15px 30px -10px rgba(0,0,0,0.3); }
    .kpi-card .kpi-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
    .kpi-card .kpi-value { font-size: 36px; font-weight: 800; margin-top: 10px; font-family: 'Outfit', sans-serif; }
    
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .status-badge.pass { background-color: var(--success-bg); color: var(--success); }
    .status-badge.fail { background-color: var(--danger-bg); color: var(--danger); }
    .status-badge.warn { background-color: var(--warning-bg); color: var(--warning); }

    .chart-container { display: flex; align-items: center; gap: 15px; }
    .radial-chart { position: relative; width: 64px; height: 64px; }
    .radial-chart svg { transform: rotate(-90deg); width: 64px; height: 64px; }
    .radial-chart circle { fill: none; stroke-width: 6; }
    .radial-chart circle.bg { stroke: var(--bg-input); }
    .radial-chart circle.fg { stroke: var(--success); stroke-linecap: round; transition: stroke-dashoffset 0.5s ease-in-out; }
    .radial-chart .percentage { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700; }

    h2 { font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 700; margin: 40px 0 15px; display: flex; align-items: center; gap: 10px; }
    
    .panel { background: var(--bg-card); border-radius: 16px; border: var(--card-border); box-shadow: var(--shadow); overflow: hidden; padding: 15px; }
    
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th { background: var(--bg-input); color: var(--text-main); font-weight: 600; padding: 12px 16px; }
    td { padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--text-main); vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background-color: rgba(255, 255, 255, 0.02); }
    body.light-mode tr:hover td { background-color: rgba(0, 0, 0, 0.01); }

    .search-filter-bar { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 25px; flex-wrap: wrap; }
    .search-box { position: relative; flex: 1; min-width: 280px; }
    .search-box input { width: 100%; background: var(--bg-card); border: var(--card-border); color: var(--text-main); padding: 12px 20px 12px 45px; border-radius: 99px; font-size: 14px; box-shadow: var(--shadow); outline: none; }
    .search-box input:focus { border-color: var(--primary); }
    .search-box svg { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; fill: var(--text-muted); }

    .filter-group { display: flex; gap: 8px; flex-wrap: wrap; }
    .filter-btn { background: var(--bg-card); border: var(--card-border); color: var(--text-muted); padding: 8px 18px; border-radius: 99px; cursor: pointer; font-size: 13px; font-weight: 600; box-shadow: var(--shadow); }
    .filter-btn:hover { border-color: var(--primary); color: var(--text-main); }
    .filter-btn.active { background: var(--primary); color: white; border-color: var(--primary); }

    .player-card { background: var(--bg-card); border-radius: 16px; border: var(--card-border); box-shadow: var(--shadow); margin-bottom: 15px; overflow: hidden; }
    .player-header { padding: 20px 24px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; }
    .player-header:hover { background-color: rgba(255,255,255,0.01); }
    body.light-mode .player-header:hover { background-color: rgba(0,0,0,0.01); }
    
    .player-info-left { display: flex; align-items: center; gap: 15px; }
    .player-info-left h3 { margin: 0; font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; }
    .player-meta-info { font-size: 12px; color: var(--text-muted); margin-top: 4px; display: flex; gap: 12px; flex-wrap: wrap; }
    .player-meta-info span { display: inline-flex; align-items: center; gap: 4px; }
    
    .player-header-right { display: flex; align-items: center; gap: 15px; }
    .arrow-icon { width: 20px; height: 20px; fill: var(--text-muted); transition: transform 0.3s; }
    
    .player-body { max-height: 0; overflow: hidden; padding: 0 24px; transition: max-height 0.3s ease-out, padding 0.3s; }
    .player-body.open { max-height: 2000px; padding: 24px; border-top: 1px solid var(--border); }
    
    .grid-2col { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 25px; }

    .defects-summary-box { background: var(--danger-bg); border: 1px solid var(--danger); border-radius: 12px; padding: 15px; margin-bottom: 25px; color: var(--text-main); }
    .defects-summary-box h4 { margin: 0 0 10px; font-weight: 700; display: flex; align-items: center; gap: 8px; }

    .nowrap { white-space: nowrap; }
    a { color: var(--primary); text-decoration: none; font-weight: 500; }
    a:hover { text-decoration: underline; color: var(--primary-hover); }
  </style>
</head>
<body>
  <header>
    <div class="header-content">
      <div class="header-title">
        <h1>${escapeHtml(t.title)}</h1>
        <p>${escapeHtml(t.generated)}: ${escapeHtml(new Date().toLocaleString())} | ${escapeHtml(t.runStatus)}: ${escapeHtml(summary.runStatus)}${summary.interruptedReason ? ` (${escapeHtml(summary.interruptedReason)})` : ""} | ${escapeHtml(t.source)}: <a href="${escapeHtml(report.playersUrl || "")}">${escapeHtml(report.playersUrl || "")}</a></p>
      </div>
      <div class="header-actions">
        <div class="chart-container">
          <div class="radial-chart">
            <svg>
              <circle class="bg" cx="32" cy="32" r="28" />
              <circle class="fg" cx="32" cy="32" r="28" stroke-dasharray="175.9" stroke-dashoffset="${175.9 - (175.9 * passPercent / 100)}" />
            </svg>
            <div class="percentage">${passPercent}%</div>
          </div>
          <div>
            <span class="status-badge ${summary.status}">${escapeHtml(isKo ? formatStatus(summary.status) : summary.status)}</span>
          </div>
        </div>
        <button class="theme-toggle-btn" id="theme-toggle">
          <svg style="width:16px;height:16px;" viewBox="0 0 24 24"><path fill="currentColor" d="M12,18C11.11,18 10.26,17.8 9.5,17.45C11.56,16.5 13,14.42 13,12C13,9.58 11.56,7.5 9.5,6.55C10.26,6.2 11.11,6 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z"/></svg>
          Theme Toggle
        </button>
      </div>
    </div>
  </header>

  <main>
    <div class="dashboard-grid">
      <div class="kpi-card"><div class="kpi-label">${escapeHtml(t.category)}</div><div class="kpi-value">${summary.checkedStandingsCategories}</div></div>
      <div class="kpi-card"><div class="kpi-label">${escapeHtml(t.playersChecked)}</div><div class="kpi-value">${summary.completedPlayers}/${summary.totalPlayers}</div></div>
      <div class="kpi-card"><div class="kpi-label">${escapeHtml(t.eventsCrawled)}</div><div class="kpi-value">${summary.crawledEvents}</div></div>
      <div class="kpi-card"><div class="kpi-label">${escapeHtml(t.tabChecks)}</div><div class="kpi-value">${summary.tabChecks}</div></div>
      <div class="kpi-card"><div class="kpi-label">${escapeHtml(t.resultPages)}</div><div class="kpi-value">${summary.crawledResultPages}</div></div>
      <div class="kpi-card" style="border-color: ${defects.length ? "var(--danger)" : "rgba(255,255,255,0.05)"};"><div class="kpi-label">${escapeHtml(t.defectCandidates)}</div><div class="kpi-value" style="color: ${defects.length ? "var(--danger)" : "inherit"};">${summary.defects}</div></div>
    </div>

    <h2>${escapeHtml(t.validationRules)}</h2>
    <div class="panel" style="margin-bottom:40px;">
      <table>
        <thead>
          <tr><th class="nowrap" style="width:200px;">${escapeHtml(t.ruleItem)}</th><th>${escapeHtml(t.ruleRule)}</th></tr>
        </thead>
        <tbody>
          ${t.rulesData.map(([item, rule]) => `<tr><td class="nowrap"><strong>${escapeHtml(item)}</strong></td><td>${escapeHtml(rule)}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>

    <h2>${escapeHtml(t.coverage)}</h2>
    <div class="panel" style="margin-bottom:40px;">
      ${standingsSourceSummary.length ? `<table>
        <thead>
          <tr><th style="width:280px;">Category</th><th>Players</th></tr>
        </thead>
        <tbody>
          ${standingsSourceSummary.map((item) => `<tr>
            <td><strong>${escapeHtml(item.category)}</strong></td>
            <td>
              <div style="display:flex;gap:10px;flex-wrap:wrap;">
                ${item.entries.map((entry) => `<span class="status-badge" style="background:var(--bg-input);padding:5px 10px;"><span style="color:var(--primary);font-weight:700;margin-right:4px;">#${escapeHtml(entry.rank ?? "-")}</span> <a href="${escapeHtml(entry.url)}">${escapeHtml(entry.player)}</a></span>`).join("")}
              </div>
            </td>
          </tr>`).join("")}
        </tbody>
      </table>` : `<p>${escapeHtml(t.noDefects)}</p>`}
    </div>

    <h2>${escapeHtml(t.defectList)}</h2>
    <div class="panel" style="margin-bottom:40px;">
      ${defects.length ? `<table>
        <thead>
          <tr><th>Type</th><th>Player</th><th>Item</th><th>Expected</th><th>Actual</th><th>Detail</th></tr>
        </thead>
        <tbody>
          ${defects.map((row) => `<tr style="border-left: 3px solid var(--danger);">
            <td class="nowrap"><span class="status-badge fail">${escapeHtml(isKo ? formatKoreanDefectType(row.type) : row.type)}</span></td>
            <td class="nowrap"><strong>${escapeHtml(row.player)}</strong></td>
            <td>${escapeHtml(isKo ? formatLabel(row.item) : row.item)}</td>
            <td><code>${escapeHtml(row.expected)}</code></td>
            <td><code>${escapeHtml(row.actual)}</code></td>
            <td>
              <div style="max-width:400px;font-size:11px;color:var(--text-muted);word-break:break-all;">
                ${escapeHtml(row.detail || "")}
              </div>
            </td>
          </tr>`).join("")}
        </tbody>
      </table>` : `<p>${escapeHtml(t.noDefects)}</p>`}
    </div>

    <div class="search-filter-bar">
      <h2>${escapeHtml(t.playersDetail)}</h2>
      <div class="search-box">
        <svg viewBox="0 0 24 24"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>
        <input type="text" id="search-input" placeholder="${escapeHtml(t.searchPlaceholder)}">
      </div>
      <div class="filter-group">
        <button class="filter-btn active" data-filter="all">${escapeHtml(t.filterAll)} (${summary.checkedPlayers})</button>
        <button class="filter-btn" data-filter="pass">${escapeHtml(t.filterPass)} (${summary.passedPlayers})</button>
        <button class="filter-btn" data-filter="fail">${escapeHtml(t.filterFail)} (${summary.failedPlayers})</button>
      </div>
    </div>

    <div id="players-list">
      ${(report.players || []).map((player) => {
        const hasWarning = player.warnings && player.warnings.length > 0;
        return `<div class="player-card" data-status="${player.status}" data-name="${escapeHtml(player.name)}">
          <div class="player-header">
            <div class="player-info-left">
              <h3>${escapeHtml(player.name)}</h3>
              <div class="player-meta-info">
                <span>🔗 <a href="${escapeHtml(player.url)}" onclick="event.stopPropagation();">${escapeHtml(player.url)}</a></span>
                <span>🏆 All Tab Crawled: <strong>${player.events?.length ?? 0}</strong></span>
                <span>📊 Profile Cashes: <strong>${player.summary?.cashes ?? "-"}</strong></span>
                <span>🔄 Load More: <strong>${player.expansion?.loadMoreClicks ?? 0}</strong></span>
              </div>
            </div>
            <div class="player-header-right">
              <span class="status-badge ${player.status}">${escapeHtml(isKo ? formatStatus(player.status) : player.status)}</span>
              <svg class="arrow-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
            </div>
          </div>
          <div class="player-body">
            ${player.error ? `<div class="defects-summary-box"><h4>⚠️ Crawl Error</h4><p>${escapeHtml(player.error)}</p></div>` : ""}
            ${hasWarning ? `<div class="defects-summary-box" style="background:var(--warning-bg);border-color:var(--warning);color:var(--text-main);">
              <h4>⚠️ Warnings</h4>
              <ul style="margin:0;padding-left:20px;">
                ${player.warnings.map(w => `<li>${escapeHtml(w)}</li>`).join("")}
              </ul>
            </div>` : ""}

            <div class="grid-2col">
              <div>
                <h4 style="margin:0 0 10px;">Summary Metrics Check</h4>
                <table style="width:100%;">
                  <thead>
                    <tr><th>Stat</th><th>${escapeHtml(t.profileStat)}</th><th>Calculated</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    ${(player.comparisons || []).map((item) => `<tr>
                      <td><strong>${escapeHtml(isKo ? formatLabel(item.label) : item.label)}</strong></td>
                      <td>${escapeHtml(formatValue(item.label, item.top))}</td>
                      <td>${escapeHtml(formatValue(item.label, item.calculated))}</td>
                      <td><span class="status-badge ${item.status}">${escapeHtml(isKo ? formatStatus(item.status) : item.status)}</span></td>
                    </tr>`).join("")}
                  </tbody>
                </table>
              </div>

              <div>
                <h4 style="margin:0 0 10px;">Profile Tabs Integrity</h4>
                <table style="width:100%;">
                  <thead>
                    <tr><th>${escapeHtml(t.tabHeader)}</th><th>Label</th><th>Profile Stat</th><th>Actual Count</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    ${(player.tabChecks || []).map((item) => `<tr>
                      <td><strong>${escapeHtml(isKo ? formatLabel(item.label) : item.label)}</strong></td>
                      <td><code>${escapeHtml(item.selectedTab || "-")}</code></td>
                      <td>${escapeHtml(formatValue(item.label, item.expected))}</td>
                      <td>${escapeHtml(formatValue(item.label, item.actual))}</td>
                      <td><span class="status-badge ${item.status}">${escapeHtml(isKo ? formatStatus(item.status) : item.status)}</span></td>
                    </tr>`).join("")}
                  </tbody>
                </table>
              </div>
            </div>

            <h4 style="margin:20px 0 10px;">Cashed Events Results Matching</h4>
            <div style="overflow-x:auto;">
              <table style="width:100%;">
                <thead>
                  <tr>
                    <th>${escapeHtml(t.seriesEvent)}</th>
                    <th>${escapeHtml(t.dateText)}</th>
                    <th>${escapeHtml(t.rankText)}</th>
                    <th>${escapeHtml(t.earningsText)}</th>
                    <th>${escapeHtml(t.resultUrlText)}</th>
                    <th>${escapeHtml(t.resultCheckText)}</th>
                    <th>${escapeHtml(t.finalFindingText)}</th>
                  </tr>
                </thead>
                <tbody>
                  ${(player.events || []).slice(0, 100).map((event) => {
                    const resStatus = event.resultPage ? event.resultPage.status : "pending";
                    return `<tr>
                      <td><strong>${escapeHtml(event.eventName)}</strong></td>
                      <td class="nowrap">${escapeHtml(event.date || "-")}</td>
                      <td class="nowrap">${escapeHtml(event.rankText || event.rank || "-")}</td>
                      <td class="nowrap">${escapeHtml(formatValue("Total Earnings", event.earnings))}</td>
                      <td>
                        ${event.resultPage?.url ? `<a href="${escapeHtml(event.resultPage.url)}" target="_blank">Link</a>` : event.resultUrl ? `<a href="${escapeHtml(event.resultUrl)}" target="_blank">Link</a>` : "-"}
                      </td>
                      <td>
                        ${event.resultPage ? `<span class="status-badge ${event.resultPage.status}">${escapeHtml(isKo ? formatStatus(event.resultPage.status) : event.resultPage.status)}</span>` : `<span style="color:var(--text-muted);">-</span>`}
                      </td>
                      <td style="font-size:12px;color:var(--text-muted);max-width:300px;word-break:break-all;">
                        ${escapeHtml(isKo ? formatKoreanResultFinding(event) : formatResultFinding(event))}
                      </td>
                    </tr>`;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>`;
      }).join("")}
    </div>
  </main>

  <script>
    // 테마 토글 처리
    const themeToggleBtn = document.getElementById('theme-toggle');
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('wsop-theme', isLight ? 'light' : 'dark');
    });

    // 로드 시 로컬스토리지 테마 복원
    const savedTheme = localStorage.getItem('wsop-theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
    }

    // 아코디언 접고 펼치기 로직
    const playerHeaders = document.querySelectorAll('.player-header');
    playerHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        const icon = header.querySelector('.arrow-icon');
        body.classList.toggle('open');
        if (body.classList.contains('open')) {
          icon.style.transform = 'rotate(180deg)';
        } else {
          icon.style.transform = 'rotate(0deg)';
        }
      });
    });

    // 실시간 검색 및 필터 로직
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const playerCards = document.querySelectorAll('.player-card');

    let currentFilter = 'all';
    let searchQuery = '';

    function filterPlayers() {
      playerCards.forEach(card => {
        const name = card.getAttribute('data-name').toLowerCase();
        const status = card.getAttribute('data-status');
        
        const matchesSearch = name.includes(searchQuery);
        const matchesFilter = currentFilter === 'all' || status === currentFilter;
        
        if (matchesSearch && matchesFilter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      filterPlayers();
    });

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        filterPlayers();
      });
    });
  </script>
</body>
</html>
`;
}

function renderHtml(report) {
  return renderReportTemplate(report, false);
}

function renderKoreanHtml(report) {
  return renderReportTemplate(report, true);
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

function buildCrawlerReport({ startedAt, finishedAt, playersUrl, playerEntries, players, runStatus, interruptedReason = "" }) {
  const completedPlayers = [];
  const pendingPlayers = [];

  for (let index = 0; index < playerEntries.length; index += 1) {
    const player = players[index];
    if (player) {
      completedPlayers.push(player);
    } else {
      const entry = playerEntries[index];
      pendingPlayers.push({
        index,
        url: entry.url,
        standingsSources: entry.standingsSources
      });
    }
  }

  const report = {
    mode: "crawler",
    runStatus,
    interruptedReason,
    startedAt,
    finishedAt,
    playersUrl,
    standingsCategories: STANDINGS_CATEGORIES.map((category) => category.label),
    totalPlayers: playerEntries.length,
    completedPlayers: completedPlayers.length,
    pendingPlayers,
    players: completedPlayers
  };
  report.summary = summarize(report);
  return report;
}

function writeReportArtifacts(args, report) {
  writeJson(args.out, report);
  fs.mkdirSync(path.dirname(args.html), { recursive: true });
  fs.writeFileSync(args.html, renderHtml(report), "utf8");
  const koreanHtml = koreanHtmlPath(args.html);
  fs.writeFileSync(koreanHtml, renderKoreanHtml(report), "utf8");
  writeCsv(args.defects, flattenDefects(report));
  return koreanHtml;
}

function runSelfTest() {
  const parsedArgs = parseArgs(["--result-rank-limit", "50", "--concurrency", "5"]);
  if (parsedArgs.resultRankLimit !== 50) {
    throw new Error("Result rank limit argument parsing failed");
  }
  if (parsedArgs.concurrency !== 5) {
    throw new Error("Concurrency argument parsing failed");
  }

  if (cleanPlayerName("Kristen FoxenKristen Foxen", "https://www.wsop.com/players/kristen-foxen/") !== "Kristen Foxen") {
    throw new Error("Repeated player name cleanup failed");
  }
  if (cleanPlayerName("BUPPIEMaurice Hawkins", "https://www.wsop.com/players/maurice-hawkins/") !== "Maurice Hawkins") {
    throw new Error("Badge-prefixed player name cleanup failed");
  }

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
  const tabChecks = PROFILE_TAB_CHECKS.map((check) => ({
    key: check.key,
    label: check.label,
    expected: summary[check.summaryKey],
    actual: summary[check.summaryKey],
    selectedTab: check.tabLabels[0],
    status: "pass",
    detail: "Self-test tab check."
  }));
  const sampleReport = { playersUrl: DEFAULT_PLAYERS_URL, players: [{ name: "Sample", url: "https://example.test/player", summary, events, expansion: {}, tabChecks, calculated, comparisons, defects: [], warnings: [], status: "pass" }] };
  const html = renderHtml(sampleReport);
  if (!html.includes("WSOP Player Standings Crawler Report")) throw new Error("HTML render failed");
  const koreanHtml = renderKoreanHtml(sampleReport);
  if (!koreanHtml.includes("WSOP 선수 순위 크롤러 리포트")) throw new Error("Korean HTML render failed");
  const partialReport = buildCrawlerReport({
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    playersUrl: DEFAULT_PLAYERS_URL,
    playerEntries: [
      { url: "https://example.test/player-1", standingsSources: [] },
      { url: "https://example.test/player-2", standingsSources: [] }
    ],
    players: [sampleReport.players[0]],
    runStatus: "running"
  });
  if (partialReport.summary.completedPlayers !== 1 || partialReport.summary.pendingPlayers !== 1) {
    throw new Error("Partial report progress summary failed");
  }
  if (!renderHtml(partialReport).includes("1/2")) {
    throw new Error("Partial report HTML progress render failed");
  }
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
  let stopRequested = false;
  let interruptedReason = "";
  let writeProgressReport = null;
  const handleStopSignal = (signal) => {
    if (stopRequested) {
      console.warn(`Second ${signal} received. Exiting immediately.`);
      process.exit(130);
    }
    stopRequested = true;
    interruptedReason = `Interrupted by ${signal}`;
    console.warn(`${interruptedReason}. No new players will start; writing partial report.`);
    if (writeProgressReport) writeProgressReport("interrupted");
  };

  try {
    if (args.userDataDir) {
      fs.mkdirSync(args.userDataDir, { recursive: true });
      context = await chromium.launchPersistentContext(args.userDataDir, launchOptions);
      browser = context.browser();
    } else {
      browser = await chromium.launch(launchOptions);
      context = await browser.newContext();
    }
  } catch (error) {
    if (!args.browserChannel) {
      if (/Executable doesn't exist|Please run the following command|install/i.test(error.message)) {
        console.error("Playwright Chromium is not installed. Run the BAT/PowerShell wrapper, or run: node node_modules/playwright/cli.js install chromium");
      }
      throw error;
    }

    console.warn(`Could not launch browser channel "${args.browserChannel}": ${error.message}`);
    console.warn("Retrying with Playwright Chromium.");
    delete launchOptions.channel;

    if (args.userDataDir) {
      context = await chromium.launchPersistentContext(args.userDataDir, launchOptions);
      browser = context.browser();
    } else {
      browser = await chromium.launch(launchOptions);
      context = await browser.newContext();
    }
  }

  try {
    const startedAt = new Date().toISOString();
    let playerEntries = args.playerUrls.map((url) => ({
      url,
      standingsSources: [{ category: "Manual player URL", rank: null, name: "", rowText: "", selected: false }]
    }));
    if (!playerEntries.length) {
      const listPage = await context.newPage();
      playerEntries = await collectPlayerEntries(listPage, args.playersUrl, args.limit, authWaitMs);
      await listPage.close().catch(() => {});
    }

    if (!playerEntries.length) throw new Error(`No player links found at ${args.playersUrl}`);

    const players = [];
    const requestedConcurrency = args.concurrency;
    const concurrency = normalizeConcurrency(requestedConcurrency);
    if (concurrency !== Math.floor(requestedConcurrency)) {
      console.warn(`  [경고] 동시성 ${requestedConcurrency}은 권장 상한 ${MAX_CONCURRENCY}을 초과하여 ${concurrency}으로 제한합니다.`);
    }
    const queue = playerEntries.map((entry, index) => ({ entry, index }));
    writeProgressReport = (runStatus = "running") => {
      const report = buildCrawlerReport({
        startedAt,
        finishedAt: new Date().toISOString(),
        playersUrl: args.playersUrl,
        playerEntries,
        players,
        runStatus,
        interruptedReason
      });
      const koreanHtml = writeReportArtifacts(args, report);
      return { report, koreanHtml };
    };
    process.on("SIGINT", handleStopSignal);
    process.on("SIGTERM", handleStopSignal);

    writeProgressReport("running");
    
    console.log(`[크롤러 시작] 총 ${playerEntries.length}명의 선수를 병렬 크롤링합니다. (동시성: ${concurrency})`);

    const worker = async () => {
      while (!stopRequested && queue.length > 0) {
        const { entry, index } = queue.shift();
        console.log(`  [크롤러] [${index + 1}/${playerEntries.length}] 크롤링 개시: ${entry.url}`);
        
        try {
          // 개별 크롤러 실행을 백오프 재시도로 안전하게 래핑
          const playerResult = await retryWithBackoff(async () => {
            const result = await crawlPlayer(
              context,
              entry.url,
              args.timeout,
              args.resultLimit,
              args.resultRankLimit,
              authWaitMs,
              args.maxLoadMore,
              args.resultPageLimit,
              entry.standingsSources
            );
            if (result.error) throw new Error(result.error);
            return result;
          }, 2, 2000);

          players[index] = playerResult;
          console.log(`  [크롤러] [${index + 1}/${playerEntries.length}] 크롤링 완료: ${entry.url} - 상태: ${playerResult.status}`);
          writeProgressReport(stopRequested ? "interrupted" : "running");
        } catch (error) {
          console.error(`  [오류] [${index + 1}/${playerEntries.length}] 크롤링 최종 실패: ${entry.url} - ${error.message}`);
          players[index] = {
            name: entry.url,
            url: entry.url,
            standingsSources: entry.standingsSources,
            summary: {},
            events: [],
            calculated: {},
            comparisons: [],
            warnings: [`크롤링 에러: ${error.message}`],
            defects: [],
            status: "fail",
            error: error.message
          };
          writeProgressReport(stopRequested ? "interrupted" : "running");
        }
      }
    };

    // 설정된 동시성 크기만큼 워커 구동
    const workerPromises = Array.from({ length: Math.min(concurrency, playerEntries.length) }, worker);
    await Promise.all(workerPromises);

    const { report, koreanHtml } = writeProgressReport(stopRequested ? "interrupted" : "complete");

    console.log(`Crawler JSON: ${args.out}`);
    console.log(`Crawler HTML: ${args.html}`);
    console.log(`Crawler Korean HTML: ${koreanHtml}`);
    console.log(`Defect CSV: ${args.defects}`);
    console.log(`Overall: ${report.summary.status}`);
    if (stopRequested) process.exitCode = 130;
    else if (report.summary.status !== "pass") process.exitCode = 1;
  } finally {
    process.removeListener("SIGINT", handleStopSignal);
    process.removeListener("SIGTERM", handleStopSignal);
    if (context) await context.close().catch(() => {});
    else if (browser) await browser.close().catch(() => {});
  }
}

main().catch((error) => {
  if (/Target page, context or browser has been closed/i.test(error.message)) {
    console.error("The browser closed before the crawler finished. Keep the browser window open until the report is generated, and rerun the BAT file.");
    console.error("If this happens without closing the browser manually, rerun after the wrapper installs Playwright Chromium or pass --browser-channel none.");
  }
  console.error(error);
  process.exitCode = 1;
});
