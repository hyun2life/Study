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
    userDataDir: "automation/.auth/wsop-player-check",
    authWaitMs: null,
    headed: false,
    out: "automation/output/wsop-player-standings-report.json",
    csv: null,
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
    else if (arg === "--csv") args.csv = argv[++i];
    else if (arg === "--self-test") args.selfTest = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!args.csv) {
    args.csv = args.out.replace(/\.json$/i, ".csv");
  }

  return args;
}

function printHelp() {
  console.log(`WSOP player standings consistency check

Usage:
  node automation/check_players_standings.mjs [options]

Options:
  --players-url <url>       Players list URL. Default: ${DEFAULT_PLAYERS_URL}
  --player-url <url>        Check a specific player URL. Can be repeated.
  --limit <n>               Number of players to collect from players page. Default: 10
  --result-limit <n>        Result links to verify per player. Default: 3
  --timeout <ms>            Page timeout. Default: 45000
  --browser-channel <name>  Installed browser channel, for example chrome. Use none for Playwright Chromium.
  --user-data-dir <path>    Reusable browser profile. Use none for a temporary profile.
  --auth-wait-ms <ms>       Wait for manual Cloudflare Access login when needed.
  --headed                  Show browser while running.
  --out <path>              JSON report path.
  --csv <path>              CSV report path.
  --self-test               Run local parser/calculation checks without opening a browser.

Rules:
  Title = lower event rows with rank 1
  Bracelets = rank 1 rows classified as bracelet events
  Rings = rank 1 rows classified as circuit/ring events
  Final Tables = lower event rows with rank 1 through 9
  Cashes = lower event row count
  Total Earnings = sum of lower event earnings
`);
}

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function parseNumber(value) {
  const match = normalizeText(value).match(/-?\d[\d,]*/);
  return match ? Number(match[0].replace(/,/g, "")) : null;
}

function parseMoney(value) {
  const text = normalizeText(value);
  const match = text.match(/\$?\s*-?\d[\d,]*(?:\.\d+)?/);
  if (!match) return null;
  const cleaned = match[0].replace(/[$,\s]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? Math.round(parsed) : null;
}

function parseRank(value) {
  const text = normalizeText(value);
  const rankPatterns = [
    /(?:^|\s)#\s*(\d{1,5})(?:st|nd|rd|th)?(?:\s|$)/i,
    /(?:^|\s)(\d{1,5})(?:st|nd|rd|th)(?:\s|$)/i,
    /(?:place|rank|finish|result)\D{0,12}(\d{1,5})/i,
    /^(\d{1,5})$/
  ];

  for (const pattern of rankPatterns) {
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

function classifyAward(rowText) {
  const text = rowText.toLowerCase();
  if (/\b(ring|circuit|wsopc|wsop-c|circuit event)\b/i.test(text)) return "ring";
  if (/\b(bracelet|wsop|world series of poker|online bracelet)\b/i.test(text)) return "bracelet";
  return "bracelet";
}

function compareStat(label, expected, actual) {
  const comparable = expected !== null && expected !== undefined && actual !== null && actual !== undefined;
  return {
    label,
    top: expected,
    calculated: actual,
    status: comparable && expected === actual ? "pass" : "fail"
  };
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function writeCsv(filePath, playerResults) {
  const headers = [
    "status",
    "player",
    "url",
    "titles_top",
    "titles_calculated",
    "bracelets_top",
    "bracelets_calculated",
    "rings_top",
    "rings_calculated",
    "final_tables_top",
    "final_tables_calculated",
    "cashes_top",
    "cashes_calculated",
    "earnings_top",
    "earnings_calculated",
    "warnings",
    "failed_checks"
  ];

  const rows = playerResults.map((player) => [
    player.status,
    player.name,
    player.url,
    player.summary.titles,
    player.calculated.titles,
    player.summary.bracelets,
    player.calculated.bracelets,
    player.summary.rings,
    player.calculated.rings,
    player.summary.finalTables,
    player.calculated.finalTables,
    player.summary.cashes,
    player.calculated.cashes,
    player.summary.totalEarnings,
    player.calculated.totalEarnings,
    player.warnings.join(" | "),
    player.comparisons.filter((item) => item.status !== "pass").map((item) => item.label).join(" | ")
  ]);

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n") + "\n",
    "utf8"
  );
}

function assertEqual(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

function runSelfTest() {
  const sampleSummaryText = `
    Title
    3
    # 384
    Bracelets
    3
    # 88
    Rings
    0
    # -
    Final Tables
    5
    # 2,950
    Cashes
    108
    # 579
    Total Earnings
    $3,041,039
  `;

  const summary = parseSummary(sampleSummaryText);
  assertEqual("summary.titles", summary.titles, 3);
  assertEqual("summary.bracelets", summary.bracelets, 3);
  assertEqual("summary.rings", summary.rings, 0);
  assertEqual("summary.finalTables", summary.finalTables, 5);
  assertEqual("summary.cashes", summary.cashes, 108);
  assertEqual("summary.totalEarnings", summary.totalEarnings, 3041039);

  const rows = [
    {
      text: "WSOP Bracelet Event #1 No-Limit Hold'em #1 $100,000 Result",
      cells: ["WSOP Bracelet Event #1 No-Limit Hold'em", "#1", "$100,000", "Result"],
      headers: ["Event", "Rank", "Earnings", ""],
      links: [],
      resultLinks: [{ href: "https://example.test/result/1", text: "Result" }],
      hasResultButton: false
    },
    {
      text: "WSOP Circuit Ring Event #2 #1 $50,000 Result",
      cells: ["WSOP Circuit Ring Event #2", "#1", "$50,000", "Result"],
      headers: ["Event", "Rank", "Earnings", ""],
      links: [],
      resultLinks: [{ href: "https://example.test/result/2", text: "Result" }],
      hasResultButton: false
    },
    {
      text: "WSOP Event #3 #9 $10,000 Result",
      cells: ["WSOP Event #3", "#9", "$10,000", "Result"],
      headers: ["Event", "Rank", "Earnings", ""],
      links: [],
      resultLinks: [{ href: "https://example.test/result/3", text: "Result" }],
      hasResultButton: false
    },
    {
      text: "WSOP Event #4 #10 $5,000 Result",
      cells: ["WSOP Event #4", "#10", "$5,000", "Result"],
      headers: ["Event", "Rank", "Earnings", ""],
      links: [],
      resultLinks: [{ href: "https://example.test/result/4", text: "Result" }],
      hasResultButton: false
    }
  ];

  const { calculated } = calculateFromRows(rows);
  assertEqual("calculated.titles", calculated.titles, 2);
  assertEqual("calculated.bracelets", calculated.bracelets, 1);
  assertEqual("calculated.rings", calculated.rings, 1);
  assertEqual("calculated.finalTables", calculated.finalTables, 3);
  assertEqual("calculated.cashes", calculated.cashes, 4);
  assertEqual("calculated.totalEarnings", calculated.totalEarnings, 165000);

  console.log("Self-test passed.");
}

async function collectPlayerUrls(page, playersUrl, limit, authWaitMs) {
  if (limit <= 0) return [];

  await page.goto(playersUrl, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle").catch(() => {});
  await waitForAccessLogin(page, authWaitMs);

  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("a[href]"))
      .map((anchor) => ({
        href: anchor.href,
        text: anchor.textContent || ""
      }))
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
  const unique = [];
  for (const link of links) {
    const cleanUrl = link.href.split("#")[0];
    if (seen.has(cleanUrl)) continue;
    seen.add(cleanUrl);
    unique.push(cleanUrl);
    if (unique.length >= limit) break;
  }

  return unique;
}

async function waitForAccessLogin(page, authWaitMs) {
  const bodyText = normalizeText(await page.locator("body").innerText({ timeout: 10000 }).catch(() => ""));
  const title = normalizeText(await page.title().catch(() => ""));
  const isAccessPage = /cloudflare access|sign in with|send login code/i.test(`${title} ${bodyText}`);

  if (!isAccessPage) return;
  if (!authWaitMs || authWaitMs <= 0) {
    throw new Error(
      "Cloudflare Access login is required. Run with --headed --auth-wait-ms 300000 once, complete login, then rerun."
    );
  }

  console.log(`Cloudflare Access login detected. Complete login in the opened browser within ${authWaitMs}ms.`);
  await page.waitForFunction(
    () => !/cloudflare access|sign in with|send login code/i.test(`${document.title} ${document.body?.innerText || ""}`),
    null,
    { timeout: authWaitMs }
  );
  await page.waitForLoadState("networkidle").catch(() => {});
}

async function extractName(page) {
  const title = normalizeText(await page.title().catch(() => ""));
  const heading = await page
    .locator("h1, h2, [data-testid*=name i], [class*=name i]")
    .first()
    .innerText({ timeout: 3000 })
    .catch(() => "");

  return normalizeText(heading) || title || page.url();
}

async function extractEventRows(page) {
  return page.evaluate(() => {
    const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
    const rows = [];

    function headersForTable(table) {
      const headerRows = Array.from(table.querySelectorAll("thead tr, tr")).slice(0, 2);
      const headers = [];
      for (const row of headerRows) {
        const cells = Array.from(row.querySelectorAll("th"));
        if (cells.length) {
          cells.forEach((cell, index) => {
            headers[index] = normalize(cell.textContent);
          });
          break;
        }
      }
      return headers;
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

        const links = Array.from(row.querySelectorAll("a[href]")).map((anchor) => ({
          href: anchor.href,
          text: normalize(anchor.textContent)
        }));
        const resultLinks = links.filter((link) => /result/i.test(`${link.text} ${link.href}`));
        const buttons = Array.from(row.querySelectorAll("button")).map((button) => normalize(button.textContent));

        rows.push({
          text,
          cells,
          headers,
          links,
          resultLinks,
          hasResultButton: buttons.some((textValue) => /result/i.test(textValue))
        });
      }
    }

    return rows;
  });
}

function valueByHeader(row, headerPatterns) {
  for (let i = 0; i < row.headers.length; i += 1) {
    const header = normalizeText(row.headers[i]);
    if (headerPatterns.some((pattern) => pattern.test(header))) {
      return row.cells[i] || "";
    }
  }
  return "";
}

function enrichEventRow(row) {
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

  const rank = parseRank(rankSource);
  const earnings = parseMoney(earningSource);
  const resultHref = row.resultLinks[0]?.href || null;

  return {
    ...row,
    rank,
    earnings,
    eventName: normalizeText(eventSource),
    resultHref
  };
}

function calculateFromRows(rows) {
  const eventRows = rows
    .map(enrichEventRow)
    .filter((row) => row.rank !== null || row.earnings !== null || row.resultHref);

  const winningRows = eventRows.filter((row) => row.rank === 1);
  const braceletRows = winningRows.filter((row) => classifyAward(row.text) === "bracelet");
  const ringRows = winningRows.filter((row) => classifyAward(row.text) === "ring");

  return {
    eventRows,
    calculated: {
      titles: winningRows.length,
      bracelets: braceletRows.length,
      rings: ringRows.length,
      finalTables: eventRows.filter((row) => row.rank !== null && row.rank >= 1 && row.rank <= 9).length,
      cashes: eventRows.length,
      totalEarnings: eventRows.reduce((sum, row) => sum + (row.earnings || 0), 0)
    }
  };
}

async function extractBadgeStats(page) {
  return page.evaluate(() => {
    const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
    const candidates = Array.from(document.querySelectorAll("*")).filter((element) => {
      const attrs = [
        element.getAttribute("alt"),
        element.getAttribute("title"),
        element.getAttribute("aria-label"),
        element.getAttribute("class"),
        element.getAttribute("src")
      ].join(" ");
      return /badge|bracelet|ring/i.test(attrs);
    });

    const stats = { bracelets: null, rings: null, detected: false };

    for (const kind of ["bracelet", "ring"]) {
      const matches = candidates.filter((element) => {
        const attrs = [
          element.getAttribute("alt"),
          element.getAttribute("title"),
          element.getAttribute("aria-label"),
          element.getAttribute("class"),
          element.getAttribute("src"),
          element.textContent
        ].join(" ");
        return new RegExp(kind, "i").test(attrs);
      });

      if (!matches.length) continue;
      stats.detected = true;

      const numbers = matches
        .map((element) => {
          const parentText = normalize(element.closest("li, div, section, article")?.textContent);
          const match = parentText.match(/\d[\d,]*/);
          return match ? Number(match[0].replace(/,/g, "")) : null;
        })
        .filter((value) => value !== null);

      stats[kind === "bracelet" ? "bracelets" : "rings"] = numbers.length ? Math.max(...numbers) : matches.length;
    }

    return stats;
  });
}

async function validateResultLinks(context, player, rows, limit, timeout, authWaitMs) {
  const checks = [];
  const links = rows.filter((row) => row.resultHref).slice(0, limit);

  for (const row of links) {
    const resultPage = await context.newPage();
    try {
      await resultPage.goto(row.resultHref, { waitUntil: "domcontentloaded", timeout });
      await resultPage.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
      await waitForAccessLogin(resultPage, authWaitMs);
      const body = normalizeText(await resultPage.locator("body").innerText({ timeout: 10000 }));
      const playerToken = player.name.split(/\s+/).find((token) => token.length >= 3) || player.name;
      const eventTokens = row.eventName.split(/\s+/).filter((token) => token.length >= 4).slice(0, 3);
      const hasPlayer = playerToken ? body.toLowerCase().includes(playerToken.toLowerCase()) : true;
      const hasEarnings = row.earnings === null || body.includes(String(row.earnings)) || body.includes(`$${row.earnings.toLocaleString("en-US")}`);
      const hasRank = row.rank === null || new RegExp(`(?:#\\s*)?${row.rank}(?:st|nd|rd|th)?\\b`, "i").test(body);
      const hasEvent = eventTokens.length === 0 || eventTokens.some((token) => body.toLowerCase().includes(token.toLowerCase()));

      checks.push({
        url: row.resultHref,
        eventName: row.eventName,
        rank: row.rank,
        earnings: row.earnings,
        status: hasPlayer && hasEarnings && hasRank && hasEvent ? "pass" : "fail",
        hasPlayer,
        hasEvent,
        hasRank,
        hasEarnings
      });
    } catch (error) {
      checks.push({
        url: row.resultHref,
        eventName: row.eventName,
        rank: row.rank,
        earnings: row.earnings,
        status: "fail",
        error: error.message
      });
    } finally {
      await resultPage.close().catch(() => {});
    }
  }

  return checks;
}

async function checkPlayer(context, url, timeout, resultLimit, authWaitMs) {
  const page = await context.newPage();
  const warnings = [];

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout });
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    await waitForAccessLogin(page, authWaitMs);

    const name = await extractName(page);
    const bodyText = await page.locator("body").innerText({ timeout });
    const summary = parseSummary(bodyText);
    const rawRows = await extractEventRows(page);
    const { eventRows, calculated } = calculateFromRows(rawRows);
    const badgeStats = await extractBadgeStats(page);

    if (!rawRows.length) warnings.push("No lower event rows were detected.");
    if (!eventRows.length) warnings.push("No event rows with rank, earnings, or result link were detected.");
    if (!badgeStats.detected) warnings.push("Bracelet/ring badge elements were not detected.");
    if (eventRows.some((row) => row.hasResultButton && !row.resultHref)) {
      warnings.push("Some Result controls are buttons without href; URL validation skipped for those rows.");
    }

    const comparisons = [
      compareStat("Title", summary.titles, calculated.titles),
      compareStat("Bracelets", summary.bracelets, calculated.bracelets),
      compareStat("Rings", summary.rings, calculated.rings),
      compareStat("Final Tables", summary.finalTables, calculated.finalTables),
      compareStat("Cashes", summary.cashes, calculated.cashes),
      compareStat("Total Earnings", summary.totalEarnings, calculated.totalEarnings)
    ];

    if (badgeStats.bracelets !== null) {
      comparisons.push(compareStat("Bracelet badge count", summary.bracelets, badgeStats.bracelets));
    }
    if (badgeStats.rings !== null) {
      comparisons.push(compareStat("Ring badge count", summary.rings, badgeStats.rings));
    }

    const resultChecks = await validateResultLinks(context, { name }, eventRows, resultLimit, timeout, authWaitMs);
    const status = comparisons.every((item) => item.status === "pass") && resultChecks.every((item) => item.status === "pass")
      ? "pass"
      : "fail";

    return {
      status,
      name,
      url,
      summary,
      calculated,
      badgeStats,
      comparisons,
      resultChecks,
      eventRowCount: eventRows.length,
      sampleEventRows: eventRows.slice(0, 20).map((row) => ({
        rank: row.rank,
        earnings: row.earnings,
        eventName: row.eventName,
        resultHref: row.resultHref
      })),
      warnings
    };
  } catch (error) {
    return {
      status: "fail",
      name: url,
      url,
      summary: {},
      calculated: {},
      badgeStats: {},
      comparisons: [],
      resultChecks: [],
      eventRowCount: 0,
      sampleEventRows: [],
      warnings,
      error: error.message
    };
  } finally {
    await page.close().catch(() => {});
  }
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
  if (args.browserChannel) {
    launchOptions.channel = args.browserChannel;
  }
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

  const startedAt = new Date().toISOString();
  let playerUrls = args.playerUrls;

  try {
    if (!playerUrls.length) {
      const page = await context.newPage();
      playerUrls = await collectPlayerUrls(page, args.playersUrl, args.limit, authWaitMs);
      await page.close();
    }

    if (!playerUrls.length) {
      throw new Error(`No player links found at ${args.playersUrl}`);
    }

    const players = [];
    for (const [index, playerUrl] of playerUrls.entries()) {
      console.log(`[${index + 1}/${playerUrls.length}] Checking ${playerUrl}`);
      players.push(await checkPlayer(context, playerUrl, args.timeout, args.resultLimit, authWaitMs));
    }

    const report = {
      startedAt,
      finishedAt: new Date().toISOString(),
      playersUrl: args.playersUrl,
      checkedPlayers: players.length,
      status: players.every((player) => player.status === "pass") ? "pass" : "fail",
      players
    };

    writeJson(args.out, report);
    writeCsv(args.csv, players);

    console.log(`Report: ${args.out}`);
    console.log(`CSV: ${args.csv}`);
    console.log(`Overall: ${report.status}`);

    if (report.status !== "pass") {
      process.exitCode = 1;
    }
  } finally {
    if (context) await context.close().catch(() => {});
    else if (browser) await browser.close().catch(() => {});
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
