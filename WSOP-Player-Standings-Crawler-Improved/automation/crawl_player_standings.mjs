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
const DISABLED_RESULT_MODES = new Set(["skip", "fail", "check"]);
const RESULT_SEARCH_LOOKBEHIND_PAGES = 2;

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
    disabledResultMode: "skip",
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
    else if (arg === "--disabled-result-mode") args.disabledResultMode = String(argv[++i] || "").toLowerCase();
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
  --disabled-result-mode <skip|fail|check>
                            How to handle disabled Result controls. skip: ignore as unavailable, fail: report as defect, check: open disabled href if present. Default: skip
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
  return normalizeText(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}

function normalizeDisabledResultMode(value) {
  const mode = String(value || "skip").toLowerCase();
  if (!DISABLED_RESULT_MODES.has(mode)) {
    throw new Error("--disabled-result-mode must be one of: skip, fail, check.");
  }
  return mode;
}

function comparableNameCandidates(value) {
  const originalText = normalizeText(value);
  const text = originalText.toLowerCase();
  const candidates = new Set();
  const add = (candidate) => {
    const comparable = normalizeComparable(candidate);
    if (comparable.length >= 3) candidates.add(comparable);
  };

  add(text);
  add(text.replace(/^[a-z0-9_ -]+(?=[^\p{ASCII}])/iu, ""));
  add(text.replace(/[\p{ASCII}]+/gu, " "));

  const tokens = originalText.split(/\s+/).filter(Boolean);
  if (tokens.length >= 2) {
    add(tokens.slice(0, 2).join(" "));
    add(tokens.slice(-2).join(" "));
    if (tokens.length >= 3) add(tokens.slice(0, -1).join(" "));
  }

  const capitalizedSuffix = originalText.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)$/);
  if (capitalizedSuffix) add(capitalizedSuffix[1]);

  return Array.from(candidates);
}

function resultPlayerNameMatches(rowPlayer, playerName) {
  const rowNames = comparableNameCandidates(rowPlayer);
  const targetNames = comparableNameCandidates(playerName);
  if (!targetNames.length) return true;
  if (!rowNames.length) return false;
  return rowNames.some((rowName) => targetNames.some((targetName) => rowName.includes(targetName) || targetName.includes(rowName)));
}

function playerNameCandidates(player) {
  const values = [
    player?.name,
    ...(player?.standingsSources || []).map((source) => source.name)
  ];
  return Array.from(new Set(values.flatMap(comparableNameCandidates)));
}

function resultPlayerMatches(rowPlayer, player) {
  const rowNames = comparableNameCandidates(rowPlayer);
  const targetNames = playerNameCandidates(player);
  if (!targetNames.length) return true;
  if (!rowNames.length) return false;
  return rowNames.some((rowName) => targetNames.some((targetName) => rowName.includes(targetName) || targetName.includes(rowName)));
}

function parseMoneyFromText(value) {
  const match = normalizeText(value).match(/(?:[$\u20ac\u00a3]|[A-Z]{1,3}\$)\s*(-?\d[\d,]*(?:\.\d+)?)/);
  return match ? Math.round(Number(match[1].replace(/[,\s]/g, ""))) : null;
}

function parseLastMoneyFromText(value) {
  const matches = Array.from(normalizeText(value).matchAll(/(?:[$\u20ac\u00a3]|[A-Z]{1,3}\$)\s*(-?\d[\d,]*(?:\.\d+)?)/g));
  const match = matches[matches.length - 1];
  return match ? Math.round(Number(match[1].replace(/[,\s]/g, ""))) : null;
}

function parseMoneyNearPlayerName(text, rawNames) {
  const normalizedText = normalizeText(text);
  for (const name of rawNames || []) {
    const normalizedName = normalizeText(name);
    if (!normalizedName) continue;
    const nameIndex = normalizedText.toLowerCase().indexOf(normalizedName.toLowerCase());
    if (nameIndex < 0) continue;
    const afterName = normalizedText.slice(nameIndex + normalizedName.length);
    const beforeNextRank = afterName.split(/\s+\d{1,6}\s+/)[0] || afterName;
    const match = beforeNextRank.match(/(?:[$\u20ac\u00a3]|[A-Z]{1,3}\$)\s*(-?\d[\d,]*(?:\.\d+)?)/);
    if (match) return Math.round(Number(match[1].replace(/[,\s]/g, "")));
  }
  return null;
}

function findRankRowSegment(text, targetRank) {
  if (!targetRank) return null;
  const normalizedText = normalizeText(text);
  const rowStartPattern = /(?:^|\s)(\d{1,6})\s+/g;
  const starts = [];
  let match = null;
  while ((match = rowStartPattern.exec(normalizedText)) !== null) {
    starts.push({
      rank: Number(match[1].replace(/,/g, "")),
      index: match.index,
      textStart: match.index + (match[0].startsWith(" ") ? 1 : 0)
    });
  }
  for (let i = 0; i < starts.length; i += 1) {
    if (starts[i].rank !== targetRank) continue;
    const end = starts[i + 1]?.index ?? normalizedText.length;
    return normalizedText.slice(starts[i].textStart, end).trim();
  }
  return null;
}

function findTextMatchIndexes(text, needle) {
  const indexes = [];
  const normalizedNeedle = normalizeText(needle);
  if (!normalizedNeedle) return indexes;
  const lowerText = text.toLowerCase();
  const lowerNeedle = normalizedNeedle.toLowerCase();
  let index = lowerText.indexOf(lowerNeedle);
  while (index >= 0) {
    indexes.push(index);
    index = lowerText.indexOf(lowerNeedle, index + lowerNeedle.length);
  }
  return indexes;
}

function findResultRowInBodyText(bodyText, player, targetRank, targetEarnings) {
  const text = normalizeText(bodyText);
  if (!text) return null;

  const targetNames = playerNameCandidates(player);
  if (!targetNames.length) return null;

  const rawTargetNames = Array.from(new Set([
    player?.name,
    ...(player?.standingsSources || []).map((source) => source.name)
  ].filter(Boolean)));
  const rankRowSegment = findRankRowSegment(text, targetRank);
  if (rankRowSegment) {
    const segmentComparable = normalizeComparable(rankRowSegment);
    const nameMatches = targetNames.some((targetName) => segmentComparable.includes(targetName));
    if (nameMatches) {
      return {
        no: targetRank,
        player: player.name,
        country: "",
        earnings: parseMoneyNearPlayerName(rankRowSegment, rawTargetNames) ?? parseLastMoneyFromText(rankRowSegment),
        rowText: rankRowSegment,
        source: "final-result-text"
      };
    }
  }
  const moneyText = targetEarnings === null || targetEarnings === undefined
    ? null
    : targetEarnings.toLocaleString("en-US");
  const moneyPattern = moneyText
    ? new RegExp(`(?:[$€£]\\s*)?${escapeRegExp(moneyText)}\\b`, "g")
    : null;
  const matchIndexes = new Set(moneyPattern ? Array.from(text.matchAll(moneyPattern)).map((match) => match.index ?? -1) : []);
  for (const name of rawTargetNames) {
    for (const index of findTextMatchIndexes(text, name)) matchIndexes.add(index);
  }

  for (const index of matchIndexes) {
    if (index < 0) continue;
    const nearbyText = text.slice(Math.max(0, index - 180), Math.min(text.length, index + 260));
    const nearbyComparable = normalizeComparable(nearbyText);
    const nameMatches = targetNames.some((targetName) => nearbyComparable.includes(targetName));
    if (!nameMatches) continue;

    const beforeMoney = nearbyText.slice(0, Math.max(0, index - Math.max(0, index - 180)));
    const rankMatch = beforeMoney.match(/(?:^|\s)(\d{1,6})\s+[^$€£]{2,180}$/);
    const parsedRank = rankMatch ? Number(rankMatch[1].replace(/,/g, "")) : targetRank;
    if (targetRank && parsedRank && parsedRank !== targetRank) continue;

    return {
      no: parsedRank || targetRank,
      player: player.name,
      country: "",
      earnings: parseMoneyNearPlayerName(nearbyText, rawTargetNames) ?? parseMoneyFromText(nearbyText),
      rowText: nearbyText,
      source: "final-result-text"
    };
  }

  return null;
}

function resultRowMatchesTarget(row, player) {
  return resultPlayerMatches(row.player, player);
}

function resultMissingChecks(checks) {
  return Object.entries(checks)
    .filter(([key, ok]) => !ok && key !== "directPageClicked")
    .map(([key]) => key);
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

function isBrowserClosedError(error) {
  return /Target page, context or browser has been closed/i.test(error?.message || String(error || ""));
}

function localizeWarning(warning, isKo) {
  if (!isKo) return warning;
  const crawlError = String(warning || "").match(/^Crawl error: (.*)$/);
  if (crawlError) return `크롤링 에러: ${crawlError[1]}`;
  return warning;
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
    disabledResultUrl: row.disabledResultUrl || null,
    hasResultControl: row.hasResultControl,
    resultUnavailable: Boolean(row.resultUnavailable),
    resultUnavailableReason: row.resultUnavailableReason || "",
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

function eventDeduplicationKey(event) {
  if (!event) return "";
  return eventComparisonKey(event);
}

function looseEventDeduplicationKey(event) {
  if (!event) return "";
  const date = normalizeComparable(event.date || "");
  if (date && event.rank !== null && event.rank !== undefined && event.earnings !== null && event.earnings !== undefined) {
    return `${date}|${event.rank}|${event.earnings}`;
  }
  return "";
}

function areLikelyDuplicateEvents(left, right) {
  const leftStrongKey = eventDeduplicationKey(left);
  const rightStrongKey = eventDeduplicationKey(right);
  if (leftStrongKey && leftStrongKey === rightStrongKey) return true;

  const leftLooseKey = looseEventDeduplicationKey(left);
  const rightLooseKey = looseEventDeduplicationKey(right);
  if (!leftLooseKey || leftLooseKey !== rightLooseKey) return false;

  const leftName = normalizeComparable(left?.eventName || "");
  const rightName = normalizeComparable(right?.eventName || "");
  const namesOverlap = Boolean(leftName && rightName && (leftName.includes(rightName) || rightName.includes(leftName)));
  const rowDistance = Math.abs((left?.rowIndex ?? Number.NaN) - (right?.rowIndex ?? Number.NaN));
  const adjacentRows = Number.isFinite(rowDistance) && rowDistance <= 1;
  const missingResultUrl = !left?.resultUrl || !right?.resultUrl;

  return namesOverlap || (adjacentRows && missingResultUrl);
}

function deduplicateComparisonEvents(events) {
  const uniqueEvents = [];
  const duplicateEvents = [];

  for (const event of events || []) {
    const duplicateIndex = uniqueEvents.findIndex((existingEvent) => areLikelyDuplicateEvents(existingEvent, event));
    if (duplicateIndex === -1) {
      uniqueEvents.push(event);
      continue;
    }

    const existingEvent = uniqueEvents[duplicateIndex];
    if (!existingEvent.resultUrl && event.resultUrl) {
      duplicateEvents.push(existingEvent);
      uniqueEvents[duplicateIndex] = event;
    } else {
      duplicateEvents.push(event);
    }
  }

  return { uniqueEvents, duplicateEvents };
}

function expectedCashesCount(summary) {
  const cashes = summary?.cashes;
  return Number.isFinite(cashes) && cashes > 0 ? cashes : null;
}

function splitEventsByExpectedCashes(events, summary) {
  const expected = expectedCashesCount(summary);
  if (!expected || events.length <= expected) {
    return { comparisonEvents: events, overflowEvents: [] };
  }
  return {
    comparisonEvents: events.slice(0, expected),
    overflowEvents: events.slice(expected)
  };
}

function comparisonEventsForSummary(events, summary) {
  const rawSplit = splitEventsByExpectedCashes(events || [], summary);
  const expected = expectedCashesCount(summary);
  if (!expected || (events || []).length <= expected) {
    return { ...rawSplit, duplicateEvents: [], strategy: "raw" };
  }

  const deduped = deduplicateComparisonEvents(events || []);
  const dedupedSplit = splitEventsByExpectedCashes(deduped.uniqueEvents, summary);
  const rawScore = summaryCountMismatchScore(summary, calculateFromEvents(rawSplit.comparisonEvents));
  const dedupedScore = summaryCountMismatchScore(summary, calculateFromEvents(dedupedSplit.comparisonEvents));

  if (dedupedScore < rawScore) {
    return { ...dedupedSplit, duplicateEvents: deduped.duplicateEvents, strategy: "deduped" };
  }

  return { ...rawSplit, duplicateEvents: [], strategy: "raw" };
}

function summaryCountMismatchScore(summary, calculated) {
  const keys = ["titles", "bracelets", "rings", "finalTables", "cashes"];
  return keys.reduce((score, key) => {
    const expected = summary?.[key];
    const actual = calculated?.[key];
    if (!Number.isFinite(expected) || !Number.isFinite(actual)) return score;
    return score + Math.abs(expected - actual);
  }, 0);
}

function eventComparisonKey(event) {
  return [
    normalizeComparable(event?.eventName || ""),
    normalizeComparable(event?.date || ""),
    event?.rank ?? "",
    event?.earnings ?? ""
  ].join("|");
}

function eventContributesToProfileTab(event, tabKey) {
  if (!event) return false;
  if (tabKey === "finalTables") return event.rank !== null && event.rank >= 1 && event.rank <= 9;
  if (event.rank !== 1) return false;
  if (tabKey === "titles") return true;
  if (tabKey === "bracelets") return classifyAward(`${event.eventName} ${event.rowText}`) === "bracelet";
  if (tabKey === "rings") return classifyAward(`${event.eventName} ${event.rowText}`) === "ring";
  return false;
}

function pickClosestCountVariant(variants, preferredName = "raw") {
  const sorted = [...variants].sort((left, right) => {
    if (left.difference !== right.difference) return left.difference - right.difference;
    if (left.name === preferredName) return -1;
    if (right.name === preferredName) return 1;
    return left.priority - right.priority;
  });
  return sorted[0] || variants[0];
}

function calculatedWithVerifiedTabCounts(calculated, summary, tabChecks) {
  const adjusted = { ...calculated };
  for (const tabCheck of tabChecks || []) {
    if (tabCheck.status !== "pass") continue;
    if (!tabCheck.summaryKey) continue;
    if (!Number.isFinite(summary?.[tabCheck.summaryKey])) continue;
    adjusted[tabCheck.summaryKey] = summary[tabCheck.summaryKey];
  }
  return adjusted;
}

function compareSummary(summary, calculated) {
  return STAT_DEFS.map((stat) => {
    const top = summary[stat.key];
    const calculatedValue = calculated[stat.key];
    const comparable = top !== null && top !== undefined && calculatedValue !== null && calculatedValue !== undefined;
    const exactMatch = comparable && top === calculatedValue;
    return {
      key: stat.key,
      label: stat.label,
      top,
      calculated: calculatedValue,
      status: exactMatch ? "pass" : stat.type === "money" ? "warn" : "fail"
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
    if (comparison.status !== "fail") continue;
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

function hasWarningStatus(items) {
  return (items || []).some((item) => item?.status === "warn");
}

function playerStatus(player) {
  if (player?.error) return "fail";
  const defects = player?.defects?.length ? player.defects : buildDefects(player || {});
  if (defects.length) return "fail";
  if (hasWarningStatus(player?.comparisons) || hasWarningStatus(player?.tabChecks) || (player?.events || []).some((event) => event.resultPage?.status === "warn")) {
    return "warn";
  }
  return "pass";
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

async function clickControlWithFallback(control, timeout = 5000) {
  try {
    await control.click({ timeout });
    return true;
  } catch (error) {
    const message = String(error?.message || "");
    const canFallback = /intercepts pointer events|not receiving pointer events|Timeout/i.test(message);
    if (!canFallback) throw error;
  }

  return await control.evaluate((element) => {
    element.scrollIntoView({ block: "center", inline: "center" });
    if (typeof element.click === "function") {
      element.click();
      return true;
    }
    return element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
  }).catch(() => false);
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

function canonicalPlayerName(profileName, standingsSources = []) {
  const cleanedProfileName = normalizeText(profileName);
  const sourceNames = standingsSources
    .map((source) => normalizeText(source.name))
    .filter(Boolean);

  for (const sourceName of sourceNames) {
    const profileComparable = normalizeComparable(cleanedProfileName);
    const sourceComparable = normalizeComparable(sourceName);
    if (sourceComparable && profileComparable.includes(sourceComparable)) {
      return sourceName;
    }
  }

  return cleanedProfileName;
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

    function isVisibleElement(element) {
      const style = window.getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse" || Number(style.opacity) === 0) return false;
      return Array.from(element.getClientRects()).some((rect) => rect.width > 0 && rect.height > 0);
    }

    function isDisabledControl(element) {
      const disabledClassPattern = /(?:^|[\s_-])(disabled|disable|inactive|unavailable|locked)(?:$|[\s_-])/i;
      const closestDisabled = element.closest("[disabled], [aria-disabled='true'], .disabled, .is-disabled, .inactive, .unavailable, .locked");
      const className = typeof element.className === "string" ? element.className : "";
      const style = window.getComputedStyle(element);
      return Boolean(element.disabled)
        || element.getAttribute("aria-disabled") === "true"
        || element.getAttribute("disabled") !== null
        || disabledClassPattern.test(className)
        || Boolean(closestDisabled)
        || style.pointerEvents === "none";
    }

    for (const table of Array.from(document.querySelectorAll("table"))) {
      if (!isVisibleElement(table)) continue;
      const headers = headersForTable(table);
      const tableRows = Array.from(table.querySelectorAll("tbody tr")).length
        ? Array.from(table.querySelectorAll("tbody tr"))
        : Array.from(table.querySelectorAll("tr")).slice(headers.length ? 1 : 0);

      for (const row of tableRows) {
        if (!isVisibleElement(row)) continue;
        const cells = Array.from(row.querySelectorAll("td, th")).map((cell) => normalize(cell.textContent));
        const text = normalize(row.textContent);
        if (!cells.length || !looksLikeEventRow(text)) continue;

        row.setAttribute("data-wsop-crawler-row", String(rowIndex));
        const resultControls = Array.from(row.querySelectorAll("a[href], button, [role='button']")).map((element) => ({
          element,
          href: element.href || "",
          text: normalize([
            element.textContent,
            element.getAttribute("aria-label"),
            element.getAttribute("title"),
            element.href || ""
          ].filter(Boolean).join(" ")),
          disabled: isDisabledControl(element)
        })).filter((control) => /result/i.test(control.text));
        const enabledResultControls = resultControls.filter((control) => !control.disabled);
        const resultLink = enabledResultControls.find((control) => control.href);
        const disabledResultLink = resultControls.find((control) => control.disabled && control.href);
        const hasDisabledResultControl = resultControls.some((control) => control.disabled);

        rows.push({
          rowIndex,
          text,
          cells,
          headers,
          resultUrl: resultLink?.href || null,
          disabledResultUrl: disabledResultLink?.href || null,
          hasResultControl: enabledResultControls.length > 0,
          resultUnavailable: enabledResultControls.length === 0 && hasDisabledResultControl,
          resultUnavailableReason: enabledResultControls.length === 0 && hasDisabledResultControl
            ? "Result 버튼/링크가 비활성화되어 아직 검증 가능한 Result 페이지가 아닙니다."
            : ""
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
      return hasEventShape || event.rank !== null || event.earnings !== null || event.hasResultControl || event.resultUnavailable;
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

async function findVisibleLoadMoreControl(page) {
  const controls = page.locator("button, a, [role=button]").filter({ hasText: /load\s*more|show\s*more|more/i });
  const count = await controls.count().catch(() => 0);

  for (let i = count - 1; i >= 0; i -= 1) {
    const control = controls.nth(i);
    const text = normalizeText(await control.innerText({ timeout: 1000 }).catch(() => ""));
    if (!/\b(load\s*more|show\s*more|more)\b/i.test(text)) continue;
    if (!(await control.isVisible().catch(() => false))) continue;
    const disabled = await control
      .evaluate((element) => Boolean(element.disabled) || element.getAttribute("aria-disabled") === "true" || /disabled|loading/i.test(element.className || ""))
      .catch(() => false);
    if (disabled) continue;
    return control;
  }

  return null;
}

async function waitForEventRowsToIncrease(page, beforeCount, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  let latestEvents = await extractEventRows(page);

  while (Date.now() < deadline) {
    if (latestEvents.length > beforeCount) return latestEvents;
    await page.waitForLoadState("networkidle", { timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(700);
    latestEvents = await extractEventRows(page);
  }

  return latestEvents;
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
  let stalledClicks = 0;

  while (expansion.loadMoreClicks < maxLoadMore) {
    if (expected && events.length >= expected) {
      expansion.reachedExpectedCashes = true;
      expansion.stoppedReason = "expected-cashes-reached";
      break;
    }

    const loadMore = await findVisibleLoadMoreControl(page);
    if (!loadMore) {
      expansion.stoppedReason = "load-more-not-found";
      break;
    }

    const beforeCount = events.length;
    await loadMore.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
    await loadMore.click({ timeout: 10000 });
    expansion.loadMoreClicks += 1;
    events = await waitForEventRowsToIncrease(page, beforeCount);

    if (events.length <= beforeCount) {
      stalledClicks += 1;
      if (stalledClicks >= 3) {
        expansion.stoppedReason = "row-count-did-not-increase";
        break;
      }
      await page.waitForTimeout(1500);
      continue;
    }

    stalledClicks = 0;
  }

  if (expansion.stoppedReason === "not-started") {
    expansion.stoppedReason = expansion.loadMoreClicks >= maxLoadMore ? "max-load-more-reached" : "complete";
  }
  if (expected && events.length >= expected) expansion.reachedExpectedCashes = true;
  expansion.finalEventCount = events.length;
  return { events, expansion };
}

async function expandCurrentProfileTabRows(page, expectedRows, maxLoadMore) {
  let events = await extractEventRows(page);
  const expected = Number.isFinite(expectedRows) && expectedRows > 0 ? expectedRows : null;
  const expansion = {
    loadMoreClicks: 0,
    reachedExpectedRows: false,
    stoppedReason: expected ? "not-started" : "no-expected-count"
  };
  let stalledClicks = 0;

  while (expected && events.length < expected && expansion.loadMoreClicks < maxLoadMore) {
    const loadMore = await findVisibleLoadMoreControl(page);
    if (!loadMore) {
      expansion.stoppedReason = "load-more-not-found";
      break;
    }

    const beforeCount = events.length;
    await loadMore.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
    await loadMore.click({ timeout: 10000 });
    expansion.loadMoreClicks += 1;
    events = await waitForEventRowsToIncrease(page, beforeCount);

    if (events.length <= beforeCount) {
      stalledClicks += 1;
      if (stalledClicks >= 3) {
        expansion.stoppedReason = "row-count-did-not-increase";
        break;
      }
      await page.waitForTimeout(1500);
      continue;
    }

    stalledClicks = 0;
  }

  if (expected && events.length >= expected) {
    expansion.reachedExpectedRows = true;
    expansion.stoppedReason = "expected-rows-reached";
  } else if (expected && expansion.stoppedReason === "not-started") {
    expansion.stoppedReason = expansion.loadMoreClicks >= maxLoadMore ? "max-load-more-reached" : "complete";
  }

  return { events, expansion };
}

async function collectProfileTabChecks(page, summary, maxLoadMore, disabledResultMode, skippedComparisonEvents = []) {
  const checks = [];

  for (const tabCheck of PROFILE_TAB_CHECKS) {
    const expected = summary?.[tabCheck.summaryKey];
    const check = {
      key: tabCheck.key,
      label: tabCheck.label,
      summaryKey: tabCheck.summaryKey,
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

    const { events: tabEvents, expansion } = await expandCurrentProfileTabRows(page, expected, maxLoadMore);
    const skippedExpectedEvents = disabledResultMode === "skip"
      ? skippedComparisonEvents.filter((event) => eventContributesToProfileTab(event, tabCheck.key))
      : [];
    const skippedExpectedKeys = new Set(skippedExpectedEvents.map(eventComparisonKey));
    const skippedTabEvents = disabledResultMode === "skip" && skippedExpectedEvents.length
      ? tabEvents.filter((event) => skippedExpectedKeys.has(eventComparisonKey(event)))
      : [];
    const skippedTabKeys = new Set(skippedTabEvents.map(eventComparisonKey));
    const rawComparableTabEvents = skippedTabEvents.length
      ? tabEvents.filter((event) => !skippedTabKeys.has(eventComparisonKey(event)))
      : tabEvents;
    const dedupedTabEvents = deduplicateComparisonEvents(tabEvents);
    const dedupedComparableTabEvents = skippedTabEvents.length
      ? dedupedTabEvents.uniqueEvents.filter((event) => !skippedTabKeys.has(eventComparisonKey(event)))
      : dedupedTabEvents.uniqueEvents;
    const adjustedExpected = Number.isFinite(expected)
      ? Math.max(0, expected - skippedExpectedEvents.length)
      : expected;
    const variantExpected = (value) => Number.isFinite(value) ? value : expected;
    const variantDifference = (actual, value) => Number.isFinite(value) ? Math.abs(actual - value) : 0;
    const variants = [
      { name: "raw", priority: 0, actual: tabEvents.length, expected, duplicateCount: 0, skippedCount: 0 },
      { name: "deduped", priority: 1, actual: dedupedTabEvents.uniqueEvents.length, expected, duplicateCount: dedupedTabEvents.duplicateEvents.length, skippedCount: 0 },
      { name: "disabled-skipped", priority: 2, actual: rawComparableTabEvents.length, expected, duplicateCount: 0, skippedCount: skippedTabEvents.length },
      { name: "disabled-skipped-adjusted", priority: 3, actual: rawComparableTabEvents.length, expected: adjustedExpected, duplicateCount: 0, skippedCount: skippedTabEvents.length },
      { name: "deduped-disabled-skipped", priority: 4, actual: dedupedComparableTabEvents.length, expected, duplicateCount: dedupedTabEvents.duplicateEvents.length, skippedCount: skippedTabEvents.length },
      { name: "deduped-disabled-skipped-adjusted", priority: 5, actual: dedupedComparableTabEvents.length, expected: adjustedExpected, duplicateCount: dedupedTabEvents.duplicateEvents.length, skippedCount: skippedTabEvents.length }
    ].map((variant) => ({
      ...variant,
      expected: variantExpected(variant.expected),
      difference: variantDifference(variant.actual, variantExpected(variant.expected))
    }));
    const selectedVariant = pickClosestCountVariant(variants);
    check.expected = selectedVariant.expected;
    check.actual = selectedVariant.actual;
    check.status = Number.isFinite(selectedVariant.expected) && selectedVariant.expected === selectedVariant.actual ? "pass" : "fail";
    check.skipped = skippedTabEvents.length;
    check.duplicates = selectedVariant.name.includes("deduped") ? dedupedTabEvents.duplicateEvents.length : 0;
    check.countStrategy = selectedVariant.name;
    check.originalExpected = expected;
    const detailParts = [
      `${check.selectedTab} tab rows=${check.actual}`,
      `profile ${tabCheck.label}=${check.expected ?? "-"}`
    ];
    if (selectedVariant.name !== "raw") detailParts.push(`strategy=${selectedVariant.name}`);
    if (check.duplicates) detailParts.push(`duplicates ignored=${check.duplicates}`);
    if (selectedVariant.skippedCount) detailParts.push(`disabled skipped=${selectedVariant.skippedCount}`);
    if (selectedVariant.name !== "raw" && rawComparableTabEvents.length !== check.actual) detailParts.push(`raw=${tabEvents.length}`);
    if (check.expected !== expected) detailParts.push(`original=${expected ?? "-"}`);
    detailParts.push(`loadMoreClicks=${expansion.loadMoreClicks}`);
    detailParts.push(`stopped=${expansion.stoppedReason}`);
    check.detail = `${detailParts.join(", ")}.`;
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
    const isVisibleElement = (element) => {
      const style = window.getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse" || Number(style.opacity) === 0) return false;
      return Array.from(element.getClientRects()).some((rect) => rect.width > 0 && rect.height > 0);
    };
    const rows = [];
    const seen = new Set();

    const addRow = (row) => {
      if (row.no === null || !row.player) return;
      const key = `${row.no}:${row.player}:${row.earnings ?? ""}`;
      if (seen.has(key)) return;
      seen.add(key);
      rows.push(row);
    };

    for (const table of Array.from(document.querySelectorAll("table"))) {
      if (!isVisibleElement(table)) continue;
      const headerText = normalize(table.querySelector("thead")?.textContent || table.textContent || "");
      if (!/\bNo\b/i.test(headerText) || !/\bPlayer\b/i.test(headerText) || !/\bEarnings\b/i.test(headerText)) continue;

      for (const row of Array.from(table.querySelectorAll("tr"))) {
        if (!isVisibleElement(row)) continue;
        const cells = Array.from(row.querySelectorAll("td, th")).map((cell) => normalize(cell.textContent));
        if (cells.length < 3) continue;
        const no = parseNumber(cells[0]);
        const earnings = parseMoney(cells[cells.length - 1]);
        const player = cells[1] || "";
        const country = cells.length >= 4 ? cells[cells.length - 2] : "";
        addRow({ no, player, country, earnings, cells, rowText: normalize(row.textContent) });
      }
    }

    if (rows.length) return rows;

    const bodyText = normalize(document.body?.innerText || "");
    const resultStart = bodyText.search(/Final Result/i);
    const headerStart = bodyText.search(/\bNo\s+Player\s+Country\s+Earnings\b/i);
    const start = headerStart >= 0 ? headerStart : resultStart;
    const finalResultText = start >= 0 ? bodyText.slice(start) : bodyText;
    const rowPattern = /(?:^|\s)(\d{1,6})\s+(.{2,180}?)\s+[$€£]([\d,]+)(?=\s+\d{1,6}\s+|$)/g;
    let match = null;
    while ((match = rowPattern.exec(finalResultText)) !== null) {
      const no = Number(match[1].replace(/,/g, ""));
      const player = normalize(match[2]);
      const earnings = parseMoney(match[3]);
      addRow({
        no,
        player,
        country: "",
        earnings,
        cells: [String(no), player, earnings === null ? "" : `$${earnings.toLocaleString("en-US")}`],
        rowText: normalize(match[0])
      });
    }

    return rows;
  });
}

async function currentResultPageContentSignature(page) {
  const rows = await extractFinalResultRows(page).catch(() => []);
  const bodyText = normalizeText(await page.locator("body").innerText({ timeout: 3000 }).catch(() => ""));
  return resultRowsSignature(rows, bodyText);
}

async function waitForResultPageContentChange(page, previousSignature, timeoutMs = 12000) {
  if (!previousSignature) return true;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    await page.waitForLoadState("networkidle", { timeout: 1500 }).catch(() => {});
    const currentSignature = await currentResultPageContentSignature(page);
    if (currentSignature && currentSignature !== previousSignature) return true;
    await page.waitForTimeout(400);
  }

  return false;
}

async function reloadResultPageAtFirstPage(page, timeoutMs = 30000) {
  const previousSignature = await currentResultPageContentSignature(page);
  await page.goto(page.url(), { waitUntil: "domcontentloaded", timeout: timeoutMs }).catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
  await waitForResultPageContentChange(page, previousSignature, 5000).catch(() => false);
  return activeResultPageNumber(page);
}

async function activeResultPageNumber(page) {
  const controls = page.locator("a, button, [role=button]");
  const count = await controls.count().catch(() => 0);

  for (let i = 0; i < count; i += 1) {
    const control = controls.nth(i);
    if (!(await control.isVisible().catch(() => false))) continue;
    const text = normalizeText(await control.innerText({ timeout: 1000 }).catch(() => ""));
    if (!/^\d{1,5}$/.test(text)) continue;
    const active = await control.evaluate((element) => {
      const classes = String(element.className || "");
      return element.getAttribute("aria-current") === "page" || /\bactive\b/i.test(classes);
    }).catch(() => false);
    if (active) return Number(text);
  }

  return null;
}

async function clickResultPageNumber(page, pageNumber) {
  if (!pageNumber || pageNumber <= 1) return false;
  const pattern = new RegExp(`^\\s*${pageNumber}\\s*$`);
  const controls = page.locator("a, button, [role=button]").filter({ hasText: pattern });
  const count = await controls.count().catch(() => 0);
  for (let i = 0; i < count; i += 1) {
    const control = controls.nth(i);
    if (!(await control.isVisible().catch(() => false))) continue;
    const disabled = await control.evaluate((element) => Boolean(element.disabled) || element.getAttribute("aria-disabled") === "true" || /disabled/i.test(element.className || "")).catch(() => false);
    if (disabled) continue;
    const current = await control.evaluate((element) => {
      const classes = String(element.className || "");
      return element.getAttribute("aria-current") === "page" || /\bactive\b/i.test(classes);
    }).catch(() => false);
    if (current) return true;
    const previousSignature = await currentResultPageContentSignature(page);
    if (!(await clickControlWithFallback(control, 5000))) continue;
    if (await waitForResultPageContentChange(page, previousSignature)) return true;
  }
  return false;
}

async function visibleResultPageNumbers(page) {
  const controls = page.locator("a, button, [role=button]");
  const count = await controls.count().catch(() => 0);
  const pageNumbers = [];

  for (let i = 0; i < count; i += 1) {
    const control = controls.nth(i);
    if (!(await control.isVisible().catch(() => false))) continue;
    const text = normalizeText(await control.innerText({ timeout: 1000 }).catch(() => ""));
    if (!/^\d{1,5}$/.test(text)) continue;
    pageNumbers.push(Number(text));
  }

  return [...new Set(pageNumbers)].sort((a, b) => a - b);
}

async function clickNextVisibleResultPageNumber(page, currentPageNumber) {
  const visibleNumbers = await visibleResultPageNumbers(page);
  const nextVisibleNumber = visibleNumbers.find((pageNumber) => pageNumber > currentPageNumber);
  if (!nextVisibleNumber) return null;
  if (await clickResultPageNumber(page, nextVisibleNumber)) {
    return nextVisibleNumber;
  }
  return null;
}

async function clickResultPageNumberThroughPaginationWindow(page, targetPageNumber, maxWindowAdvances = null) {
  if (!targetPageNumber || targetPageNumber <= 1) return false;
  if (await clickResultPageNumber(page, targetPageNumber)) return true;

  const maxAttempts = maxWindowAdvances ?? Math.min(Math.max(targetPageNumber + 2, 10), 120);
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const activePageNumber = await activeResultPageNumber(page);
    if (activePageNumber && activePageNumber >= targetPageNumber) break;
    if (!(await clickStrictNextResultPage(page))) break;
    if (await clickResultPageNumber(page, targetPageNumber)) return true;
  }

  return false;
}

async function clickNextResultPage(page) {
  const controls = page.locator("a, button, [role=button]").filter({ hasText: /^(next|>|›|»|…|\.\.\.)\s*$/i });
  const count = await controls.count().catch(() => 0);
  for (let i = 0; i < count; i += 1) {
    const control = controls.nth(i);
    if (!(await control.isVisible().catch(() => false))) continue;
    const disabled = await control.evaluate((element) => Boolean(element.disabled) || element.getAttribute("aria-disabled") === "true" || /disabled/i.test(element.className || "")).catch(() => false);
    if (disabled) continue;
    const previousSignature = await currentResultPageContentSignature(page);
    if (!(await clickControlWithFallback(control, 5000))) continue;
    if (await waitForResultPageContentChange(page, previousSignature)) return true;
  }
  return false;
}

async function clickForwardResultPaginationControl(page) {
  const controls = page.locator("a, button, [role=button]");
  const count = await controls.count().catch(() => 0);

  for (let i = 0; i < count; i += 1) {
    const control = controls.nth(i);
    if (!(await control.isVisible().catch(() => false))) continue;
    const forward = await control.evaluate((element) => {
      const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
      const text = normalize([
        element.textContent,
        element.getAttribute("aria-label"),
        element.getAttribute("title"),
        element.getAttribute("rel"),
        element.getAttribute("class")
      ].filter(Boolean).join(" "));
      const disabled = Boolean(element.disabled)
        || element.getAttribute("aria-disabled") === "true"
        || /disabled/i.test(element.className || "");
      if (disabled) return false;
      if (/\b(prev|previous|back)\b/i.test(text)) return false;
      return /\b(next|forward)\b/i.test(text)
        || text === ">"
        || text === ">>"
        || text === "..."
        || text === "\u2026"
        || text === "\u203a"
        || text === "\u00bb"
        || /(^|\s)(>|\.\.\.|\u2026|\u203a|\u00bb)(\s|$)/.test(text);
    }).catch(() => false);
    if (!forward) continue;

    const previousSignature = await currentResultPageContentSignature(page);
    if (!(await clickControlWithFallback(control, 5000))) continue;
    if (await waitForResultPageContentChange(page, previousSignature)) return true;
  }

  return false;
}

async function clickStrictNextResultPage(page) {
  const controls = page.locator("a, button, [role=button]");
  const count = await controls.count().catch(() => 0);

  for (let i = 0; i < count; i += 1) {
    const control = controls.nth(i);
    if (!(await control.isVisible().catch(() => false))) continue;
    const next = await control.evaluate((element) => {
      const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
      const text = normalize([
        element.textContent,
        element.getAttribute("aria-label"),
        element.getAttribute("title"),
        element.getAttribute("rel"),
        element.getAttribute("class")
      ].filter(Boolean).join(" "));
      const disabled = Boolean(element.disabled)
        || element.getAttribute("aria-disabled") === "true"
        || /disabled/i.test(element.className || "");
      if (disabled) return false;
      if (/\b(prev|previous|back)\b/i.test(text)) return false;
      return /\bnext\b/i.test(text)
        || text === ">"
        || text === "\u203a";
    }).catch(() => false);
    if (!next) continue;

    const previousSignature = await currentResultPageContentSignature(page);
    if (!(await clickControlWithFallback(control, 5000))) continue;
    if (await waitForResultPageContentChange(page, previousSignature)) return true;
  }

  return false;
}

async function clickStrictPreviousResultPage(page) {
  const controls = page.locator("a, button, [role=button]");
  const count = await controls.count().catch(() => 0);

  for (let i = 0; i < count; i += 1) {
    const control = controls.nth(i);
    if (!(await control.isVisible().catch(() => false))) continue;
    const previous = await control.evaluate((element) => {
      const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
      const text = normalize([
        element.textContent,
        element.getAttribute("aria-label"),
        element.getAttribute("title"),
        element.getAttribute("rel"),
        element.getAttribute("class")
      ].filter(Boolean).join(" "));
      const disabled = Boolean(element.disabled)
        || element.getAttribute("aria-disabled") === "true"
        || /disabled/i.test(element.className || "");
      if (disabled) return false;
      if (/\b(next|forward)\b/i.test(text)) return false;
      return /\b(prev|previous|back)\b/i.test(text)
        || text === "<"
        || text === "\u2039";
    }).catch(() => false);
    if (!previous) continue;

    const previousSignature = await currentResultPageContentSignature(page);
    if (!(await clickControlWithFallback(control, 5000))) continue;
    if (await waitForResultPageContentChange(page, previousSignature)) return true;
  }

  return false;
}

async function advanceResultPage(page, currentPageNumber, targetPageNumber, inspectEveryPage) {
  const nextPageNumber = currentPageNumber + 1;

  if (targetPageNumber && targetPageNumber > currentPageNumber) {
    if (await clickResultPageNumber(page, targetPageNumber)) {
      return { advanced: true, resultPageNumber: targetPageNumber, directPageClicked: true };
    }

    const visibleNumbers = await visibleResultPageNumbers(page);
    const maxVisibleNumber = visibleNumbers.length ? Math.max(...visibleNumbers) : null;
    if (maxVisibleNumber && targetPageNumber > maxVisibleNumber) {
      if (await clickForwardResultPaginationControl(page)) {
        if (await clickResultPageNumber(page, targetPageNumber)) {
          return { advanced: true, resultPageNumber: targetPageNumber, directPageClicked: true };
        }
        if (await clickResultPageNumber(page, Math.max(nextPageNumber, maxVisibleNumber + 1))) {
          return { advanced: true, resultPageNumber: Math.max(nextPageNumber, maxVisibleNumber + 1), directPageClicked: true };
        }
      }
    }
  }

  if (await clickStrictNextResultPage(page)) {
    return { advanced: true, resultPageNumber: nextPageNumber, directPageClicked: false };
  }

  if (await clickNextResultPage(page)) {
    return { advanced: true, resultPageNumber: nextPageNumber, directPageClicked: false };
  }

  if (await clickForwardResultPaginationControl(page)) {
    if (await clickResultPageNumber(page, nextPageNumber)) {
      return { advanced: true, resultPageNumber: nextPageNumber, directPageClicked: true };
    }
    return { advanced: true, resultPageNumber: nextPageNumber, directPageClicked: false };
  }

  if (await clickResultPageNumber(page, nextPageNumber)) {
    return { advanced: true, resultPageNumber: nextPageNumber, directPageClicked: true };
  }

  const nextVisiblePageNumber = await clickNextVisibleResultPageNumber(page, currentPageNumber);
  if (nextVisiblePageNumber) {
    return { advanced: true, resultPageNumber: nextVisiblePageNumber, directPageClicked: true };
  }

  if (inspectEveryPage && targetPageNumber && targetPageNumber !== currentPageNumber && targetPageNumber !== nextPageNumber) {
    if (await clickResultPageNumber(page, targetPageNumber)) {
      return { advanced: true, resultPageNumber: targetPageNumber, directPageClicked: true };
    }
  }

  return { advanced: false, resultPageNumber: currentPageNumber, directPageClicked: false };
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

function resultRangeResolvesTargetRank(range, targetRank) {
  return Boolean(targetRank && range && ((targetRank >= range.min && targetRank <= range.max) || range.min > targetRank));
}

async function retreatResultPage(page, currentPageNumber) {
  const previousPageNumber = Math.max(1, currentPageNumber - 1);

  if (await clickStrictPreviousResultPage(page)) {
    const activePageNumber = await activeResultPageNumber(page);
    return { advanced: true, resultPageNumber: activePageNumber || previousPageNumber, directPageClicked: false };
  }

  if (previousPageNumber !== currentPageNumber && await clickResultPageNumber(page, previousPageNumber)) {
    return { advanced: true, resultPageNumber: previousPageNumber, directPageClicked: true };
  }

  return { advanced: false, resultPageNumber: currentPageNumber, directPageClicked: false };
}

function resultRowsResolveTargetRank(rows, targetRank) {
  if (!targetRank) return false;
  const ranks = (rows || [])
    .map((row) => row.no)
    .filter((rank) => Number.isFinite(rank));
  if (!ranks.length) return false;
  const minRank = Math.min(...ranks);
  const maxRank = Math.max(...ranks);
  return minRank > targetRank || (ranks.includes(targetRank) && maxRank > targetRank);
}

function targetRankGap(previousRange, currentRange, targetRank) {
  if (!targetRank || !previousRange || !currentRange) return null;
  const gapStart = previousRange.max + 1;
  const gapEnd = currentRange.min - 1;
  if (gapEnd < gapStart) return null;
  if (targetRank < gapStart || targetRank > gapEnd) return null;
  return { start: gapStart, end: gapEnd };
}

function resultPageInspectionLimit(resultPageLimit) {
  if (resultPageLimit === 0) return Number.MAX_SAFE_INTEGER;
  if (!Number.isFinite(resultPageLimit) || resultPageLimit < 0) {
    throw new Error("--result-page-limit must be 0 or a positive number.");
  }
  return Math.floor(resultPageLimit);
}

function shouldInspectEveryResultPage(resultPageLimit) {
  return resultPageLimit === 0;
}

function resultPageNumberForRank(rank) {
  return rank && rank > 50 ? Math.ceil(rank / 50) : null;
}

function resultPageNumberForRangeStart(rank) {
  return rank && rank > 50 ? Math.ceil(rank / 50) : 1;
}

function resultSearchStartPageForRank(rank) {
  const targetPage = resultPageNumberForRank(rank);
  if (!targetPage) return null;
  return Math.max(1, targetPage - RESULT_SEARCH_LOOKBEHIND_PAGES);
}

function shouldUseDirectResultRankJump(targetRank, resultPageLimit) {
  const searchStartPage = resultSearchStartPageForRank(targetRank);
  if (!searchStartPage || searchStartPage <= 1) return false;
  return resultPageLimit !== 0 || searchStartPage > 10;
}

function resultRowsSignature(rows, bodyText) {
  const range = rankRangeForRows(rows || []);
  const rangeKey = range ? `${range.min}-${range.max}` : "no-ranks";
  const rowKey = (rows || [])
    .slice(0, 5)
    .map((row) => `${row.no}:${normalizeComparable(row.player)}:${row.earnings ?? ""}`)
    .join("|");
  return `${rangeKey}::${rowKey || normalizeText(bodyText).slice(0, 500)}`;
}

function resultPageSignature(url, rows, bodyText) {
  return `${url || "unknown-url"}::${resultRowsSignature(rows, bodyText)}`;
}

function cachedPagesCoverEvent(cachedPages, event) {
  const targetRank = event.rank;
  if (!targetRank) return false;

  return cachedPages.some((cachedPage) => {
    const ranks = (cachedPage.rows || [])
      .map((row) => row.no)
      .filter((rank) => Number.isFinite(rank));
    const range = rankRangeForRows(cachedPage.rows || []);
    if (!range) return false;
    return range.min > targetRank || (ranks.includes(targetRank) && range.max > targetRank);
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
  const targetRank = event.rank;
  const targetEarnings = event.earnings;
  const searchedPages = [];
  let foundRow = null;

  for (const cachedPage of cachedPages) {
    const range = rankRangeForRows(cachedPage.rows || []);
    searchedPages.push({ pageIndex: cachedPage.pageIndex, resultPageNumber: cachedPage.resultPageNumber ?? cachedPage.pageIndex, url: cachedPage.url, rows: cachedPage.rows.length, rankRange: range ? `${range.min}-${range.max}` : null });
    const candidates = targetRank ? cachedPage.rows.filter((row) => row.no === targetRank) : cachedPage.rows;
    foundRow = candidates.find((row) => resultRowMatchesTarget(row, player)) || null;

    if (foundRow) break;
  }

  if (!foundRow) {
    for (const cachedPage of cachedPages) {
      const lastBody = cachedPage.bodyText || "";
      foundRow = findResultRowInBodyText(lastBody, player, targetRank, targetEarnings);
      if (foundRow) {
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
  const missing = resultMissingChecks(checks);
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
  const targetRank = event.rank;
  const targetEarnings = event.earnings;
  const pageInspectionLimit = resultPageInspectionLimit(resultPageLimit);
  const inspectEveryPage = shouldInspectEveryResultPage(resultPageLimit);
  const visitedPageContentSignatures = new Set();
  const searchedPages = [];
  const cachedPages = [];
  let foundRow = null;
  let directPageClicked = false;
  let lastBody = "";
  let targetGap = null;
  let resultPageNumber = 1;
  let previousRange = null;
  let resetFromOvershotFirstPage = false;
  const pendingResultPageNumbers = [];
  const gapRecoveryPageNumbers = new Set();
  const searchStartPageNumber = shouldUseDirectResultRankJump(targetRank, resultPageLimit) ? resultSearchStartPageForRank(targetRank) : null;

  if (searchStartPageNumber && searchStartPageNumber > 1) {
    directPageClicked = await clickResultPageNumberThroughPaginationWindow(page, searchStartPageNumber);
    const activePageNumber = await activeResultPageNumber(page);
    if (activePageNumber) resultPageNumber = activePageNumber;
    else if (directPageClicked) resultPageNumber = searchStartPageNumber;
    directPageClicked = directPageClicked || Boolean(activePageNumber && activePageNumber > 1);
  }

  for (let pageIndex = 1; pageIndex <= pageInspectionLimit; pageIndex += 1) {
    const url = page.url();

    const rows = await extractFinalResultRows(page);
    const title = await page.title().catch(() => "");
    const bodyText = normalizeText(await page.locator("body").innerText({ timeout: 10000 }).catch(() => ""));
    const range = rankRangeForRows(rows);
    const activePageNumber = await activeResultPageNumber(page);
    if (activePageNumber) resultPageNumber = activePageNumber;
    targetGap = targetGap || targetRankGap(previousRange, range, targetRank);
    const pageContentSignature = resultRowsSignature(rows, bodyText);
    if (visitedPageContentSignatures.has(pageContentSignature)) break;
    visitedPageContentSignatures.add(pageContentSignature);

    cachedPages.push({ pageIndex, resultPageNumber, url, title, rows, bodyText });
    searchedPages.push({ pageIndex, resultPageNumber, url, rows: rows.length, rankRange: range ? `${range.min}-${range.max}` : null });
    const candidates = targetRank ? rows.filter((row) => row.no === targetRank) : rows;
    let pageFoundRow = candidates.find((row) => resultRowMatchesTarget(row, player)) || null;

    if (!pageFoundRow) {
      lastBody = bodyText;
      pageFoundRow = findResultRowInBodyText(lastBody, player, targetRank, targetEarnings);
    }
    if (pageFoundRow && !foundRow) foundRow = pageFoundRow;
    previousRange = range || previousRange;

    if (foundRow) break;
    if (targetRank && range && range.min > targetRank) {
      const retreat = await retreatResultPage(page, resultPageNumber);
      if (!retreat.advanced) {
        if (!resetFromOvershotFirstPage) {
          resetFromOvershotFirstPage = true;
          const reloadedPageNumber = await reloadResultPageAtFirstPage(page, timeout);
          resultPageNumber = reloadedPageNumber || 1;
          previousRange = null;
          continue;
        }
        break;
      }
      directPageClicked = directPageClicked || retreat.directPageClicked;
      resultPageNumber = retreat.resultPageNumber;
      continue;
    }
    if (resultRowsResolveTargetRank(rows, targetRank)) break;
    const pendingPageNumber = pendingResultPageNumbers.shift();
    if (pendingPageNumber && pendingPageNumber !== resultPageNumber && await clickResultPageNumber(page, pendingPageNumber)) {
      directPageClicked = true;
      resultPageNumber = pendingPageNumber;
      continue;
    }
    const advance = await advanceResultPage(page, resultPageNumber, null, inspectEveryPage);
    if (!advance.advanced) break;
    directPageClicked = directPageClicked || advance.directPageClicked;
    resultPageNumber = advance.resultPageNumber;
  }

  const checks = {
    hasFinalResultRows: searchedPages.some((item) => item.rows > 0) || Boolean(foundRow),
    directPageClicked,
    rankMatches: !targetRank || Boolean(foundRow && foundRow.no === targetRank),
    playerMatches: Boolean(foundRow),
    earningsMatches: targetEarnings === null || targetEarnings === undefined || Boolean(foundRow && foundRow.earnings === targetEarnings)
  };
  const missing = resultMissingChecks(checks);
  const body = lastBody || normalizeText(await page.locator("body").innerText({ timeout: 10000 }).catch(() => ""));

  return {
    url: page.url(),
    title: await page.title().catch(() => ""),
    status: missing.length ? "fail" : "pass",
    checks,
    missing,
    cachedPages,
    targetGap,
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
    const targetRank = event.rank;
    const targetEarnings = event.earnings;
    const pageInspectionLimit = resultPageInspectionLimit(resultPageLimit);
    const inspectEveryPage = shouldInspectEveryResultPage(resultPageLimit);
    const visitedPageContentSignatures = new Set();
    const searchedPages = [];
    let foundRow = null;
    let directPageClicked = false;
    let lastBody = "";
    let targetGap = null;
    let resultPageNumber = 1;
    let previousRange = null;
    let resetFromOvershotFirstPage = false;
    const pendingResultPageNumbers = [];
    const gapRecoveryPageNumbers = new Set();
    const searchStartPageNumber = shouldUseDirectResultRankJump(targetRank, resultPageLimit) ? resultSearchStartPageForRank(targetRank) : null;

    if (searchStartPageNumber && searchStartPageNumber > 1) {
      directPageClicked = await clickResultPageNumberThroughPaginationWindow(page, searchStartPageNumber);
      const activePageNumber = await activeResultPageNumber(page);
      if (activePageNumber) resultPageNumber = activePageNumber;
      else if (directPageClicked) resultPageNumber = searchStartPageNumber;
      directPageClicked = directPageClicked || Boolean(activePageNumber && activePageNumber > 1);
    }

    for (let pageIndex = 1; pageIndex <= pageInspectionLimit; pageIndex += 1) {
      const url = page.url();

      const rows = await extractFinalResultRows(page);
      const title = await page.title().catch(() => "");
      const bodyText = normalizeText(await page.locator("body").innerText({ timeout: 10000 }).catch(() => ""));
      const range = rankRangeForRows(rows);
      const activePageNumber = await activeResultPageNumber(page);
      if (activePageNumber) resultPageNumber = activePageNumber;
      targetGap = targetGap || targetRankGap(previousRange, range, targetRank);
      const pageContentSignature = resultRowsSignature(rows, bodyText);
      if (visitedPageContentSignatures.has(pageContentSignature)) break;
      visitedPageContentSignatures.add(pageContentSignature);

      // 캐시 페이지 적재
      cachedPages.push({ pageIndex, resultPageNumber, url, title, rows, bodyText });

      searchedPages.push({ pageIndex, resultPageNumber, url, rows: rows.length, rankRange: range ? `${range.min}-${range.max}` : null });
      const candidates = targetRank ? rows.filter((row) => row.no === targetRank) : rows;
      let pageFoundRow = candidates.find((row) => resultRowMatchesTarget(row, player)) || null;

      if (!pageFoundRow) {
        lastBody = bodyText;
        pageFoundRow = findResultRowInBodyText(lastBody, player, targetRank, targetEarnings);
      }
      if (pageFoundRow && !foundRow) foundRow = pageFoundRow;
      previousRange = range || previousRange;

      if (foundRow) break;
      if (targetRank && range && range.min > targetRank) {
        const retreat = await retreatResultPage(page, resultPageNumber);
        if (!retreat.advanced) {
          if (!resetFromOvershotFirstPage) {
            resetFromOvershotFirstPage = true;
            const reloadedPageNumber = await reloadResultPageAtFirstPage(page, timeout);
            resultPageNumber = reloadedPageNumber || 1;
            previousRange = null;
            continue;
          }
          break;
        }
        directPageClicked = directPageClicked || retreat.directPageClicked;
        resultPageNumber = retreat.resultPageNumber;
        continue;
      }
      if (resultRowsResolveTargetRank(rows, targetRank)) break;
      const pendingPageNumber = pendingResultPageNumbers.shift();
      if (pendingPageNumber && pendingPageNumber !== resultPageNumber && await clickResultPageNumber(page, pendingPageNumber)) {
        directPageClicked = true;
        resultPageNumber = pendingPageNumber;
        continue;
      }
      const advance = await advanceResultPage(page, resultPageNumber, null, inspectEveryPage);
      if (!advance.advanced) break;
      directPageClicked = directPageClicked || advance.directPageClicked;
      resultPageNumber = advance.resultPageNumber;
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
    const missing = resultMissingChecks(checks);
    const body = lastBody || normalizeText(await page.locator("body").innerText({ timeout: 10000 }).catch(() => ""));

    return {
      url: page.url(),
      title: await page.title().catch(() => ""),
      status: missing.length ? "fail" : "pass",
      checks,
      missing,
      targetGap,
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

async function crawlPlayer(context, url, timeout, resultLimit, resultRankLimit, authWaitMs, maxLoadMore, resultPageLimit, disabledResultMode, standingsSources = []) {
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

    const profileName = await extractPlayerName(page);
    const name = canonicalPlayerName(profileName, standingsSources);
    const bodyText = await page.locator("body").innerText({ timeout });
    const summary = parseSummary(bodyText);
    const { events, expansion } = await expandAllEventRows(page, summary.cashes, maxLoadMore);
    const { comparisonEvents: profileComparisonEvents, overflowEvents, duplicateEvents, strategy: comparisonStrategy } = comparisonEventsForSummary(events, summary);
    for (const event of duplicateEvents) {
      event.resultSkipped = event.resultSkipped || "건너뜀 (중복 이벤트 row)";
      event.duplicateEvent = true;
    }
    for (const event of overflowEvents) {
      event.resultSkipped = `건너뜀 (프로필 Cashes ${summary.cashes}개를 초과해 수집된 row)`;
      event.outsideProfileCashes = true;
    }
    const unavailableResultEvents = profileComparisonEvents.filter((event) => event.resultUnavailable);
    const skippedUnavailableResultEvents = disabledResultMode === "skip" ? unavailableResultEvents : [];
    const summaryForComparison = summary;
    const comparableEvents = profileComparisonEvents;
    const tabChecks = await collectProfileTabChecks(page, summary, maxLoadMore, disabledResultMode, skippedUnavailableResultEvents);
    const calculated = calculatedWithVerifiedTabCounts(calculateFromEvents(comparableEvents), summary, tabChecks);

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
      summaryForComparison,
      summaryAdjustment: null,
      events,
      expansion,
      duplicateEvents: duplicateEvents.length,
      comparisonStrategy,
      tabChecks,
      calculated,
      comparisons: [],
      warnings,
      defects: [],
      status: "fail"
    };

    player.comparisons = compareSummary(player.summaryForComparison || player.summary, player.calculated);

    for (const event of unavailableResultEvents) {
      if (disabledResultMode === "fail") {
        event.resultPage = {
          url: event.disabledResultUrl || event.resultUrl || player.url,
          status: "fail",
          error: event.resultUnavailableReason || "Result 버튼/링크가 비활성화되어 검증할 수 없습니다.",
          checks: { resultControlEnabled: false },
          missing: ["resultControlEnabled"]
        };
      } else if (disabledResultMode === "check" && event.disabledResultUrl) {
        event.resultUrl = event.disabledResultUrl;
      } else {
        event.resultSkipped = event.resultUnavailableReason || "Result 버튼/링크가 비활성화되어 검증을 건너뜀";
      }
    }

    const checkableResultEvents = profileComparisonEvents.filter((event) => !event.resultPage && (event.resultUrl || event.hasResultControl));
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
    if (unavailableResultEvents.length) {
      if (disabledResultMode === "fail") {
        warnings.push(`Result 버튼/링크가 비활성화된 ${unavailableResultEvents.length}건을 결함으로 기록했습니다.`);
      } else if (disabledResultMode === "check") {
        const checkableDisabledCount = unavailableResultEvents.filter((event) => event.disabledResultUrl).length;
        warnings.push(`Result 버튼/링크가 비활성화된 ${unavailableResultEvents.length}건 중 URL이 있는 ${checkableDisabledCount}건은 직접 접근으로 검증합니다.`);
      } else {
        warnings.push(`Result 버튼/링크가 비활성화된 ${unavailableResultEvents.length}건은 아직 검증 가능한 페이지가 아니어서 Result 상세 페이지 검증만 건너뜁니다. 프로필 요약/탭 계산에는 포함합니다.`);
      }
    }

    if (profileComparisonEvents.some((event) => event.hasResultControl && !event.resultUrl)) {
      warnings.push("결과 확인 일부 컨트롤이 단순 버튼 형태입니다. 일부 행에 대해 클릭 네비게이션이 실행되었습니다.");
    }

    player.defects = buildDefects(player);
    player.status = playerStatus(player);
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
  const warnPlayers = players.filter((player) => player.status === "warn").length;
  const failedPlayers = players.filter((player) => player.status === "fail").length;
  const passedPlayers = players.filter((player) => player.status === "pass").length;
  const status = defects.length || failedPlayers ? "fail" : (warnPlayers || runStatus !== "complete") ? "warn" : "pass";
  return {
    status,
    runStatus,
    interruptedReason: report.interruptedReason || "",
    totalPlayers,
    completedPlayers,
    pendingPlayers,
    checkedPlayers: completedPlayers,
    checkedStandingsCategories: standingsCategories.size,
    passedPlayers,
    warnedPlayers: warnPlayers,
    failedPlayers,
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
      ["입상 수", "Load more로 펼친 ALL 탭 row 중 프로필 Cashes 개수까지만 비교 계산에 사용합니다."],
      ["총 상금", "프로필 Total Earnings와 ALL 탭 계산 합계가 다르면 환율/통화/원본값 차이 가능성이 있어 주의로 표시하고 실패 집계에서는 제외합니다."],
      ["프로필 탭", "Title, Bracelets, Rings, Final Tables 탭을 눌러 표시 row 수와 프로필 요약값을 비교합니다."],
      ["Result", "Result 페이지를 열어 최종 결과표에서 No, 선수명, 상금이 모두 정확히 맞는지 확인합니다."]
    ] : [
      ["Standings categories", `Collect top players from ${STANDINGS_CATEGORIES.map((c) => c.label).join(", ")}.`],
      ["Title", "Count ALL-tab events where Rank is 1."],
      ["Bracelets", "Count Rank 1 events classified as WSOP bracelet events."],
      ["Rings", "Count Rank 1 events classified as Circuit/Ring events."],
      ["Final Tables", "Count ALL-tab events where Rank is 1 through 9."],
      ["Cashes", "Count ALL-tab rows only up to the profile Cashes count for comparison."],
      ["Total Earnings", "If profile Total Earnings differs from the ALL-tab calculated total, mark it as Warn because currency/rate/source differences can occur, and exclude it from failure totals."],
      ["Profile tabs", "Click Title, Bracelets, Rings, and Final Tables tabs and compare visible row counts with profile stats."],
      ["Result", "Open Results and verify that No, Player, and Earnings all match exactly."]
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
        <button class="filter-btn" data-filter="warn">${escapeHtml(t.filterWarn)} (${summary.warnedPlayers || 0})</button>
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
                ${player.warnings.map(w => `<li>${escapeHtml(localizeWarning(w, isKo))}</li>`).join("")}
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
  const parsedArgs = parseArgs(["--result-rank-limit", "50", "--concurrency", "5", "--disabled-result-mode", "fail"]);
  if (parsedArgs.resultRankLimit !== 50) {
    throw new Error("Result rank limit argument parsing failed");
  }
  if (parsedArgs.concurrency !== 5) {
    throw new Error("Concurrency argument parsing failed");
  }
  if (normalizeDisabledResultMode(parsedArgs.disabledResultMode) !== "fail") {
    throw new Error("Disabled Result mode argument parsing failed");
  }
  if (resultPageInspectionLimit(0) !== Number.MAX_SAFE_INTEGER || !shouldInspectEveryResultPage(0)) {
    throw new Error("Result page limit 0 should inspect every page");
  }
  if (resultPageInspectionLimit(50) !== 50 || shouldInspectEveryResultPage(50)) {
    throw new Error("Positive result page limit should cap inspected pages");
  }
  if (resultSearchStartPageForRank(501) !== 9 || resultSearchStartPageForRank(28) !== null) {
    throw new Error("Result search start page calculation failed");
  }
  if (!shouldUseDirectResultRankJump(1006, 10) || !shouldUseDirectResultRankJump(1006, 0) || shouldUseDirectResultRankJump(28, 10)) {
    throw new Error("Result direct rank jump gating failed");
  }
  if (resultPageNumberForRank(50) !== null || resultPageNumberForRank(51) !== 2 || resultPageNumberForRank(100) !== 2 || resultPageNumberForRangeStart(400) !== 8 || resultPageNumberForRangeStart(401) !== 9) {
    throw new Error("Result page number calculation failed");
  }
  if (!resultRangeResolvesTargetRank({ min: 400, max: 449 }, 420) || !resultRangeResolvesTargetRank({ min: 450, max: 499 }, 420) || resultRangeResolvesTargetRank({ min: 350, max: 399 }, 420)) {
    throw new Error("Result target rank early-stop calculation failed");
  }
  if (resultRangeResolvesTargetRank({ min: 301, max: 350 }, 353) || !resultRangeResolvesTargetRank({ min: 351, max: 400 }, 353)) {
    throw new Error("Deep result rank range resolution failed");
  }
  if (resultRowsResolveTargetRank([{ no: 1 }, { no: 928 }], 353) || resultRowsResolveTargetRank([{ no: 351 }, { no: 352 }, { no: 353 }], 353) || !resultRowsResolveTargetRank([{ no: 351 }, { no: 352 }, { no: 353 }, { no: 354 }], 353)) {
    throw new Error("Sparse result rows should not stop deep-rank pagination early");
  }
  if (resultRowsResolveTargetRank([{ no: 1 }, { no: 100 }], 100) || resultRowsResolveTargetRank([{ no: 100 }, { no: 100 }], 100)) {
    throw new Error("Tied target ranks should continue across result pages");
  }
  if (cachedPagesCoverEvent([{ rows: [{ no: 1 }, { no: 100 }] }], { rank: 100 }) || cachedPagesCoverEvent([{ rows: [{ no: 100 }, { no: 100 }] }], { rank: 100 })) {
    throw new Error("Cached pages ending on tied target rank should not be treated as covering the event");
  }
  const rankGap = targetRankGap({ min: 371, max: 434 }, { min: 500, max: 558 }, 458);
  if (!rankGap || rankGap.start !== 435 || rankGap.end !== 499 || targetRankGap({ min: 371, max: 434 }, { min: 500, max: 558 }, 600)) {
    throw new Error("Target rank gap detection failed");
  }
  if (!resultPlayerNameMatches("Александр Басин Russia", "SBasinАлександр Басин")) {
    throw new Error("Unicode player name matching failed");
  }
  if (!resultPlayerNameMatches("Christian Frimodt Denmark", "ButijustknowChristian Frimodt")) {
    throw new Error("Screen-name-prefixed player name matching failed");
  }
  if (resultPlayerMatches("William Wolf Mexico", { name: "William Foxen", standingsSources: [] })) {
    throw new Error("Result player matching should not match players by first name only");
  }
  if (!resultPlayerMatches("Александр Басин Russia", { name: "SBasinАлександр Басин", standingsSources: [{ name: "Александр Басин" }] })) {
    throw new Error("Standings real-name alias matching failed");
  }
  const textFallbackRow = findResultRowInBodyText("Final Result No Player Country Earnings 52 Александр Басин Russia $876,595 53 Other Player Germany $1,000", { name: "SBasinАлександр Басин", standingsSources: [{ name: "Александр Басин" }] }, 52, 876595);
  if (!textFallbackRow || textFallbackRow.no !== 52) {
    throw new Error("Final result text fallback matching failed");
  }
  const textFallbackMoneyMismatchRow = findResultRowInBodyText("Final Result No Player Country Earnings 52 Александр Басин Russia $875,000 53 Other Player Germany $1,000", { name: "SBasinАлександр Басин", standingsSources: [{ name: "Александр Басин" }] }, 52, 876595);
  if (!textFallbackMoneyMismatchRow || textFallbackMoneyMismatchRow.no !== 52 || textFallbackMoneyMismatchRow.earnings !== 875000) {
    throw new Error("Final result text fallback should preserve the found row for an earnings mismatch failure");
  }
  const wrongWilliamFallbackRow = findResultRowInBodyText("Final Result No Player Country Earnings 111 William Wolf Mexico $7,005", { name: "William Foxen", standingsSources: [] }, null, 836);
  if (wrongWilliamFallbackRow) {
    throw new Error("Final result text fallback should not match a different player with the same first name");
  }
  const audFallbackRow = findResultRowInBodyText("5 Kahle Burns New Zealand A$201,994 6 Benny Spindler Germany A$146,205 7 Mikel Habb Australia A$107,730 8 Russell Thomas United States A$82,721 9 Antonio Esfandiari United States A$65,408 10 Jordan Westmorland Australia A$65,408", { name: "Antonio Esfandiari", standingsSources: [] }, 9, 65408);
  if (!audFallbackRow || audFallbackRow.no !== 9 || audFallbackRow.earnings !== 65408) {
    throw new Error("Final result text fallback should read the earnings beside the matched player");
  }
  const resultEarningsMismatchChecks = {
    hasFinalResultRows: true,
    directPageClicked: false,
    rankMatches: true,
    playerMatches: true,
    earningsMatches: false
  };
  if (resultMissingChecks(resultEarningsMismatchChecks).join(",") !== "earningsMatches") {
    throw new Error("Result earnings mismatch should be a failure");
  }

  if (cleanPlayerName("Kristen FoxenKristen Foxen", "https://www.wsop.com/players/kristen-foxen/") !== "Kristen Foxen") {
    throw new Error("Repeated player name cleanup failed");
  }
  if (cleanPlayerName("BUPPIEMaurice Hawkins", "https://www.wsop.com/players/maurice-hawkins/") !== "Maurice Hawkins") {
    throw new Error("Badge-prefixed player name cleanup failed");
  }
  if (canonicalPlayerName("SBasinАлександр Басин", [{ name: "Александр Басин" }]) !== "Александр Басин") {
    throw new Error("Standings real-name canonicalization failed");
  }

  const summary = parseSummary("Title 2 Bracelets 1 Rings 1 Final Tables 3 Cashes 4 Total Earnings $165,000");
  const events = [
    normalizeEvent({ rowIndex: 0, text: "WSOP Bracelet #1 $100,000 Result", cells: ["WSOP Bracelet", "#1", "$100,000"], headers: ["Event", "Rank", "Earnings"], resultUrl: "https://example.test/1", hasResultControl: true }),
    normalizeEvent({ rowIndex: 1, text: "WSOP Circuit Ring #1 $50,000 Result", cells: ["WSOP Circuit Ring", "#1", "$50,000"], headers: ["Event", "Rank", "Earnings"], resultUrl: "https://example.test/2", hasResultControl: true }),
    normalizeEvent({ rowIndex: 2, text: "WSOP #9 $10,000 Result", cells: ["WSOP", "#9", "$10,000"], headers: ["Event", "Rank", "Earnings"], resultUrl: "https://example.test/3", hasResultControl: true }),
    normalizeEvent({ rowIndex: 3, text: "WSOP #10 $5,000 Result", cells: ["WSOP", "#10", "$5,000"], headers: ["Event", "Rank", "Earnings"], resultUrl: "https://example.test/4", hasResultControl: true })
  ];
  const unavailableResultEvent = normalizeEvent({
    rowIndex: 4,
    text: "WSOP Paradise #22 $58,300 Result",
    cells: ["WSOP Paradise", "#22 / 287", "$58,300", "Result"],
    headers: ["Event", "Rank", "Earnings", "Result"],
    resultUrl: null,
    hasResultControl: false,
    resultUnavailable: true,
    resultUnavailableReason: "Result disabled"
  });
  if (!unavailableResultEvent.resultUnavailable || unavailableResultEvent.resultUrl || unavailableResultEvent.hasResultControl) {
    throw new Error("Disabled Result control should be preserved as unavailable, not checkable");
  }
  const skippedBraceletWin = normalizeEvent({
    rowIndex: 5,
    text: "WSOP Bracelet #1 $12,345 Result",
    cells: ["WSOP Bracelet", "#1", "$12,345", "Result"],
    headers: ["Event", "Rank", "Earnings", "Result"],
    resultUrl: null,
    hasResultControl: false,
    resultUnavailable: true,
    resultUnavailableReason: "Result disabled"
  });
  if (!eventContributesToProfileTab(skippedBraceletWin, "titles") || !eventContributesToProfileTab(skippedBraceletWin, "bracelets") || !eventContributesToProfileTab(skippedBraceletWin, "finalTables") || eventContributesToProfileTab(skippedBraceletWin, "rings")) {
    throw new Error("Skipped Result event tab contribution classification failed");
  }
  const skippedAdjustment = calculateFromEvents([skippedBraceletWin]);
  if (skippedAdjustment.titles !== 1 || skippedAdjustment.bracelets !== 1 || skippedAdjustment.rings !== 0 || skippedAdjustment.finalTables !== 1 || skippedAdjustment.cashes !== 1 || skippedAdjustment.totalEarnings !== 12345) {
    throw new Error("Skipped winning event summary adjustment failed");
  }
  const disabledIncludedSummary = parseSummary("Title 1 Bracelets 1 Rings 0 Final Tables 1 Cashes 1 Total Earnings $12,345");
  const disabledIncludedComparisons = compareSummary(disabledIncludedSummary, calculateFromEvents([skippedBraceletWin]));
  if (disabledIncludedComparisons.some((item) => item.status !== "pass")) {
    throw new Error("Disabled Result rows should remain in profile summary comparisons");
  }
  const calculated = calculateFromEvents(events);
  const comparisons = compareSummary(summary, calculated);
  if (comparisons.some((item) => item.status !== "pass")) {
    throw new Error(`Self-test comparison failed: ${JSON.stringify(comparisons)}`);
  }
  const overflowSplit = splitEventsByExpectedCashes(events, parseSummary("Title 1 Bracelets 1 Rings 0 Final Tables 2 Cashes 2 Total Earnings $150,000"));
  if (overflowSplit.comparisonEvents.length !== 2 || overflowSplit.overflowEvents.length !== 2 || calculateFromEvents(overflowSplit.comparisonEvents).cashes !== 2) {
    throw new Error("Events beyond profile Cashes should be excluded from comparison totals");
  }
  const exactExpectedSplit = comparisonEventsForSummary([events[0], events[0]], parseSummary("Title 2 Bracelets 2 Rings 0 Final Tables 2 Cashes 2 Total Earnings $200,000"));
  if (exactExpectedSplit.comparisonEvents.length !== 2 || exactExpectedSplit.strategy !== "raw") {
    throw new Error("Collected rows that already match profile Cashes should not be deduplicated");
  }
  const duplicateBeforeLegitimateWinA = normalizeEvent({ rowIndex: 10, text: "Duplicate FT #9 $10,000 Result", cells: ["Duplicate FT", "#9", "$10,000"], headers: ["Event", "Rank", "Earnings"], resultUrl: "https://example.test/dup-a", hasResultControl: true });
  duplicateBeforeLegitimateWinA.date = "Jan 01 2024";
  const duplicateBeforeLegitimateWinB = normalizeEvent({ rowIndex: 11, text: "Duplicate FT #9 $10,000 Result", cells: ["Duplicate FT", "#9", "$10,000"], headers: ["Event", "Rank", "Earnings"], resultUrl: null, hasResultControl: true });
  duplicateBeforeLegitimateWinB.date = "Jan 01 2024";
  const dedupPreferredSplit = comparisonEventsForSummary([duplicateBeforeLegitimateWinA, duplicateBeforeLegitimateWinB, skippedBraceletWin], parseSummary("Title 1 Bracelets 1 Rings 0 Final Tables 2 Cashes 2 Total Earnings $22,345"));
  const dedupPreferredCalculated = calculateFromEvents(dedupPreferredSplit.comparisonEvents);
  if (dedupPreferredSplit.strategy !== "deduped" || dedupPreferredCalculated.titles !== 1 || dedupPreferredCalculated.finalTables !== 2 || dedupPreferredCalculated.cashes !== 2) {
    throw new Error("Summary comparison should deduplicate only when it improves profile count matching");
  }
  const originalFinalTableEvent = normalizeEvent({ rowIndex: 4, text: "Original label #9 $10,000 Result", cells: ["Original label", "#9", "$10,000"], headers: ["Event", "Rank", "Earnings"], resultUrl: "https://example.test/original", hasResultControl: true });
  originalFinalTableEvent.date = "Jan 01 2024";
  const duplicateEvent = normalizeEvent({ rowIndex: 5, text: "Alternate label #9 $10,000 Result", cells: ["Alternate label", "#9", "$10,000"], headers: ["Event", "Rank", "Earnings"], resultUrl: null, hasResultControl: true });
  duplicateEvent.date = "Jan 01 2024";
  const pauliusLikeEvents = [events[0], events[1], originalFinalTableEvent, duplicateEvent, events[3], skippedBraceletWin];
  const deduped = deduplicateComparisonEvents(pauliusLikeEvents);
  const dedupedSplit = splitEventsByExpectedCashes(deduped.uniqueEvents, parseSummary("Title 1 Bracelets 1 Rings 0 Final Tables 3 Cashes 5 Total Earnings $177,345"));
  const dedupedCalculated = calculateFromEvents(dedupedSplit.comparisonEvents);
  if (deduped.duplicateEvents.length !== 1 || dedupedCalculated.titles !== 3 || dedupedCalculated.finalTables !== 4 || dedupedCalculated.cashes !== 5) {
    throw new Error("Duplicate event rows should be removed before applying profile Cashes overflow");
  }
  const sameDateRankPrizeA = normalizeEvent({ rowIndex: 10, text: "Distinct Event A #9 $10,000 Result", cells: ["Distinct Event A", "#9", "$10,000"], headers: ["Event", "Rank", "Earnings"], resultUrl: "https://example.test/a", hasResultControl: true });
  sameDateRankPrizeA.date = "Jan 01 2024";
  const sameDateRankPrizeB = normalizeEvent({ rowIndex: 11, text: "Distinct Event B #9 $10,000 Result", cells: ["Distinct Event B", "#9", "$10,000"], headers: ["Event", "Rank", "Earnings"], resultUrl: "https://example.test/b", hasResultControl: true });
  sameDateRankPrizeB.date = "Jan 01 2024";
  const distinctSamePrizeEvents = deduplicateComparisonEvents([sameDateRankPrizeA, sameDateRankPrizeB]);
  if (distinctSamePrizeEvents.uniqueEvents.length !== 2 || distinctSamePrizeEvents.duplicateEvents.length !== 0) {
    throw new Error("Distinct events with the same date, rank, and earnings should not be deduplicated");
  }
  const earningsComparison = compareSummary({ totalEarnings: 100 }, { totalEarnings: 200 }).find((item) => item.key === "totalEarnings");
  if (earningsComparison?.status !== "warn" || buildDefects({ name: "Sample", url: "https://example.test/player", comparisons: [earningsComparison] }).length) {
    throw new Error("Total Earnings mismatch should warn without creating a failure defect");
  }
  const warningOnlyPlayer = { name: "Warn Sample", url: "https://example.test/warn", comparisons: [earningsComparison], tabChecks: [], events: [], defects: [] };
  warningOnlyPlayer.status = playerStatus(warningOnlyPlayer);
  if (warningOnlyPlayer.status !== "warn") {
    throw new Error("Total Earnings mismatch should set player status to warn");
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
  const warningReport = buildCrawlerReport({
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    playersUrl: DEFAULT_PLAYERS_URL,
    playerEntries: [{ url: warningOnlyPlayer.url, standingsSources: [] }],
    players: [warningOnlyPlayer],
    runStatus: "complete"
  });
  if (warningReport.summary.status !== "warn" || warningReport.summary.warnedPlayers !== 1 || warningReport.summary.failedPlayers !== 0) {
    throw new Error("Warning-only report should have overall warn status");
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
  args.disabledResultMode = normalizeDisabledResultMode(args.disabledResultMode);

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
              args.disabledResultMode,
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
          if (isBrowserClosedError(error)) {
            stopRequested = true;
            interruptedReason = "Browser closed before the crawler finished";
          }
          players[index] = {
            name: entry.url,
            url: entry.url,
            standingsSources: entry.standingsSources,
            summary: {},
            events: [],
            calculated: {},
            comparisons: [],
            warnings: [`Crawl error: ${error.message}`],
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
  if (isBrowserClosedError(error)) {
    console.error("The browser closed before the crawler finished. Keep the browser window open until the report is generated, and rerun the BAT file.");
    console.error("If this happens without closing the browser manually, rerun after the wrapper installs Playwright Chromium or pass --browser-channel none.");
  }
  console.error(error);
  process.exitCode = 1;
});
