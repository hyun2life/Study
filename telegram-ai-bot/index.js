import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 환경변수 로드
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.TELEGRAM_BOT_TOKEN;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!token || token === "your_telegram_bot_token_here") {
  console.error("오류: .env 파일에 올바른 TELEGRAM_BOT_TOKEN을 설정해주세요.");
  process.exit(1);
}

// 텔레그램 봇 초기화 (Polling 방식)
const bot = new TelegramBot(token, { polling: true });
console.log("🤖 텔레그램 AI 에이전트 제어 봇이 시작되었습니다. 메시지를 기다리는 중...");

if (geminiApiKey && geminiApiKey !== "your_gemini_api_key_here") {
  console.log("✨ Gemini 2.5 Flash 에이전트 모드가 활성화되었습니다. (REST API + Function Calling)");
} else {
  console.log("⚠️ 경고: GEMINI_API_KEY가 설정되지 않았습니다. 자연어 제어 및 AI 대화 기능이 비활성화되며, 슬래시 명령어만 제공됩니다.");
}

// 워크스페이스 루트 폴더 (Study)
const WORKSPACE_ROOT = path.resolve(__dirname, ".."); 
const paths = {
  crawlerRoot: path.resolve(__dirname, "../WSOP-Web/WSOP-Player-Standings-Crawler"),
  automationRoot: path.resolve(__dirname, "../WSOP-Web/WSOP-Web-Automation")
};

// 대화 히스토리 파일 경로 설정 및 영구보존 로직
const HISTORY_FILE = path.resolve(__dirname, "chat_history.json");
const MAX_HISTORY = 30; // 보관할 최대 히스토리 개수

// 히스토리 로드 함수
function loadHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("대화 히스토리 로드 실패:", err.message);
  }
  return {};
}

// 히스토리 저장 함수
function saveHistory(conversations) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(conversations, null, 2), "utf-8");
  } catch (err) {
    console.error("대화 히스토리 저장 실패:", err.message);
  }
}

// 파일에서 기존 대화기록 불러오기
const conversations = loadHistory();

// 최근 생성된 JSON 리포트 파일을 찾아서 파싱하는 헬퍼 함수
function getLatestReportSummary(crawlerOutDir) {
  try {
    if (!fs.existsSync(crawlerOutDir)) return null;
    const files = fs.readdirSync(crawlerOutDir)
      .filter(file => file.endsWith("-data.json"))
      .map(file => {
        const filePath = path.join(crawlerOutDir, file);
        return {
          name: file,
          path: filePath,
          time: fs.statSync(filePath).mtime.getTime()
        };
      })
      .sort((a, b) => b.time - a.time);

    if (files.length === 0) return null;

    const latestFile = files[0].path;
    const data = JSON.parse(fs.readFileSync(latestFile, "utf-8"));
    return {
      fileName: files[0].name,
      summary: data.summary,
      playersCount: data.players?.length || 0
    };
  } catch (err) {
    console.error("리포트 요약 추출 실패:", err.message);
    return null;
  }
}

// 안전하지 않은 명령어 필터링
function isCommandSafe(command) {
  const dangerousPatterns = [
    /\bdel\b/i,
    /\brd\b/i,
    /\bformat\b/i,
    /\bshutdown\b/i,
    /\brmdir\b/i,
    /\bmkfs\b/i,
    /\bpoweroff\b/i,
    /\breboot\b/i
  ];
  if (command.includes("rm ") && (command.includes("-r") || command.includes("-f"))) {
    return false;
  }
  for (const pattern of dangerousPatterns) {
    if (pattern.test(command)) {
      return false;
    }
  }
  return true;
}

// 에이전트가 사용할 도구 정의
const tools = [
  {
    functionDeclarations: [
      {
        name: "read_file",
        description: "Read the contents of a local file in the workspace.",
        parameters: {
          type: "OBJECT",
          properties: {
            path: {
              type: "STRING",
              description: "The path of the file to read (relative to workspace root: c:/Users/USER1/Desktop/Study)."
            }
          },
          required: ["path"]
        }
      },
      {
        name: "write_file",
        description: "Create or write content to a local file in the workspace. Overwrites if file exists.",
        parameters: {
          type: "OBJECT",
          properties: {
            path: {
              type: "STRING",
              description: "The path of the file to write (relative to workspace root)."
            },
            content: {
              type: "STRING",
              description: "The complete file content to write."
            }
          },
          required: ["path", "content"]
        }
      },
      {
        name: "list_directory",
        description: "List files and folders within a directory in the workspace.",
        parameters: {
          type: "OBJECT",
          properties: {
            path: {
              type: "STRING",
              description: "The directory path to list (relative to workspace root). Defaults to '.' for root."
            }
          }
        }
      },
      {
        name: "execute_command",
        description: "Execute a local command (shell/terminal) in the workspace.",
        parameters: {
          type: "OBJECT",
          properties: {
            command: {
              type: "STRING",
              description: "The terminal command to execute."
            },
            cwd: {
              type: "STRING",
              description: "The working directory to run the command in (relative to workspace root)."
            },
            runInBackground: {
              type: "BOOLEAN",
              description: "If true, starts the command in the background (like starting servers) and returns immediately. For tests or scripts that need to finish, set this to false."
            }
          },
          required: ["command"]
        }
      }
    ]
  }
];

// 로컬 도구 실제 실행기
async function executeTool(name, args, chatId) {
  if (name === "read_file") {
    const rawPath = args.path;
    const safePath = path.resolve(WORKSPACE_ROOT, rawPath);
    if (!safePath.startsWith(WORKSPACE_ROOT)) {
      throw new Error("보안 오류: 워크스페이스 외부의 파일은 읽을 수 없습니다.");
    }
    if (!fs.existsSync(safePath)) {
      throw new Error(`파일이 존재하지 않습니다: ${rawPath}`);
    }
    const content = fs.readFileSync(safePath, "utf-8");
    return { content: content };
  }

  if (name === "write_file") {
    const rawPath = args.path;
    const safePath = path.resolve(WORKSPACE_ROOT, rawPath);
    if (!safePath.startsWith(WORKSPACE_ROOT)) {
      throw new Error("보안 오류: 워크스페이스 외부에 파일을 쓸 수 없습니다.");
    }
    const content = args.content;
    fs.mkdirSync(path.dirname(safePath), { recursive: true });
    fs.writeFileSync(safePath, content, "utf-8");
    console.log(`[File Write] Wrote file to: ${safePath}`);
    return { success: true, message: `Successfully wrote ${content.length} characters to ${rawPath}` };
  }

  if (name === "list_directory") {
    const rawPath = args.path || ".";
    const safePath = path.resolve(WORKSPACE_ROOT, rawPath);
    if (!safePath.startsWith(WORKSPACE_ROOT)) {
      throw new Error("보안 오류: 워크스페이스 외부의 디렉토리는 조회할 수 없습니다.");
    }
    if (!fs.existsSync(safePath)) {
      throw new Error(`디렉토리가 존재하지 않습니다: ${rawPath}`);
    }
    const stat = fs.statSync(safePath);
    if (!stat.isDirectory()) {
      throw new Error(`디렉토리가 아닙니다: ${rawPath}`);
    }
    const files = fs.readdirSync(safePath).map(file => {
      const filePath = path.join(safePath, file);
      const fileStat = fs.statSync(filePath);
      return {
        name: file,
        isDirectory: fileStat.isDirectory(),
        size: fileStat.size
      };
    });
    return { path: rawPath, files: files };
  }

  if (name === "execute_command") {
    const command = args.command;
    const runInBackground = !!args.runInBackground;
    const rawCwd = args.cwd || ".";
    const safeCwd = path.resolve(WORKSPACE_ROOT, rawCwd);

    if (!safeCwd.startsWith(WORKSPACE_ROOT)) {
      throw new Error("보안 오류: 워크스페이스 외부 디렉토리에서는 명령어를 실행할 수 없습니다.");
    }
    if (!isCommandSafe(command)) {
      throw new Error("보안 오류: 안전 규정상 허용되지 않는 위험한 명령어가 감지되었습니다.");
    }

    if (runInBackground) {
      console.log(`[Background Exec] ${command} at ${safeCwd}`);
      const proc = exec(command, { cwd: safeCwd });
      proc.unref(); // 백그라운드 분리
      return {
        status: "started_in_background",
        message: `명령어 [${command}]가 백그라운드에서 구동되었습니다. (작업 경로: ${rawCwd})`
      };
    } else {
      console.log(`[Sync Exec] ${command} at ${safeCwd}`);
      bot.sendMessage(chatId, `⏳ <i>명령어 실행 중: \`${command}\`</i>`, { parse_mode: "Markdown" }).catch(() => {});
      
      return new Promise((resolve) => {
        exec(command, { cwd: safeCwd, timeout: 45000, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
          resolve({
            success: !error,
            exitCode: error ? error.code : 0,
            stdout: stdout.substring(0, 8000), // 버퍼 자르기
            stderr: stderr.substring(0, 8000),
            error: error ? error.message : null
          });
        });
      });
    }
  }

  throw new Error(`지원하지 않는 도구 이름: ${name}`);
}

// Gemini API 연동 호출 헬퍼
async function callGeminiAPI(chatId, newParts) {
  if (!conversations[chatId]) {
    conversations[chatId] = [];
  }

  const history = conversations[chatId];
  if (newParts) {
    history.push({ role: "user", parts: newParts });
    saveHistory(conversations); // 대화 추가 시 영구 저장
  }

  // 히스토리 크기 제한 초과 시 오래된 대화 삭제
  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
    saveHistory(conversations);
  }

  const model = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: history,
      tools: tools,
      systemInstruction: {
        parts: [{
          text: `당신은 사용자 PC의 파일과 명령어를 제어하는 강력한 로컬 AI 에이전트(안티그라비티)입니다.
사용자에게 친근하게 한국어로 답하세요.
사용자의 요구사항을 처리하기 위해 제공된 도구들(read_file, write_file, list_directory, execute_command)을 적극 활용하십시오.
필요하다면 여러 개의 도구를 연달아 호출하여 최종 결과를 만들어낼 수 있습니다 (예: 디렉토리 조회 후 파일 읽기, 또는 파일 수정 후 테스트 스크립트 실행).
사용자가 코드나 텍스트를 수정해달라고 하면 write_file을 호출하여 직접 소스코드를 수정하십시오.
서버를 기동하라는 명령(예: 대시보드 기동)의 경우 execute_command의 runInBackground 파라미터를 true로 설정하여 즉시 리턴하게 하십시오.
도구 실행 결과(오류 포함)를 바탕으로 다음 단계 작업을 결정하거나 최종 답변을 내리십시오.
답변할 때 마크다운 형식을 사용하여 깔끔하게 정리해 대답하십시오.`
        }]
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API HTTP Status: ${response.status}, Detail: ${errText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content;
}

// 봇 도움말 텍스트
const HELP_TEXT = `🤖 <b>WSOP Workspace 로컬 AI 에이전트 봇 도움말</b>

이 봇은 <b>Gemini 2.5 Flash 에이전트</b>를 탑재하여 사용자님의 일반 자연어 대화 형식을 완전히 해석하고, 파일 읽기/쓰기, 쉘 명령어 실행을 로컬에서 대행합니다!

<b>[사용 예시]</b>
• <i>"대시보드 켜줘"</i> (서버를 백그라운드에 구동)
• <i>"전체 테스트 실행하고 결과 알려줘"</i>
• <i>"WSOP-Web-Automation 폴더에 어떤 파일이 있는지 봐줘"</i>
• <i>"index.js 파일에서 도움말 문구를 좀 더 화려하게 수정해줘"</i>
• <i>"크롤러 2명만 빠르게 실행해줘"</i>

<b>[수동 제어용 슬래시 명령어]</b>
• <code>/run</code> - 대시보드 서버(Run.bat) 백그라운드 기동
• <code>/run_all</code> - 대시보드 전체 테스트 실행
• <code>/run_crawler</code> - 크롤러 빠른 실행 (2명)
• <code>/run_crawler_full</code> - 크롤러 정밀 실행 (10명)
• <code>/run_qa</code> - Playwright QA 테스트 실행
• <code>/help</code> - 이 도움말을 표시합니다.
`;

// /start & /help 명령어 처리
bot.onText(/^\/(start|help)$/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, HELP_TEXT, { parse_mode: "HTML" });
});

// --- 기존 수동 제어 명령어 핸들러들 정의 ---
function runDashboardServer(chatId) {
  bot.sendMessage(chatId, "🖥️ <b>[WSOP 대시보드 서버 기동]</b>\n대시보드 서버(Run.bat)를 백그라운드에서 실행합니다...", { parse_mode: "HTML" });
  exec("cmd /c Run.bat", { cwd: path.resolve(WORKSPACE_ROOT, "WSOP-Web") }, (error) => {
    if (error) {
      bot.sendMessage(chatId, `❌ <b>[대시보드 기동 실패]</b>\n<code>${error.message}</code>`, { parse_mode: "HTML" });
      return;
    }
    bot.sendMessage(chatId, `✅ <b>[대시보드 서버 기동 완료]</b> (http://localhost:3000)`, { parse_mode: "HTML" });
  });
}

function runAllDashboardTests(chatId) {
  bot.sendMessage(chatId, "🧪 <b>[WSOP Web 전체 테스트 실행]</b>\n전체 테스트를 실행 중입니다. 잠시만 기다려 주세요...", { parse_mode: "HTML" });
  exec("node scripts/run-phase.cjs all", { cwd: paths.automationRoot, maxBuffer: 1024 * 1024 * 10 }, (error) => {
    const testStatus = error ? "🔴 일부 페이즈 실패" : "🟢 모두 정상 완료";
    bot.sendMessage(chatId, `✅ <b>[전체 테스트 실행 완료]</b>\n결과: ${testStatus}`, { parse_mode: "HTML" });
  });
}

function runCrawlerSmoke(chatId) {
  bot.sendMessage(chatId, "🚀 <b>[크롤러 빠른 실행]</b>\n선수 2명 대상 크롤러를 구동합니다...", { parse_mode: "HTML" });
  exec("node automation/crawl_player_standings.mjs --limit 2 --result-limit 1 --max-load-more 3 --result-page-limit 1", { cwd: paths.crawlerRoot, maxBuffer: 1024 * 1024 * 10 }, (error) => {
    const outDir = path.join(paths.crawlerRoot, "automation/output");
    const reportInfo = getLatestReportSummary(outDir);
    let summaryText = "";
    if (reportInfo && reportInfo.summary) {
      const s = reportInfo.summary;
      summaryText = `\n\n📊 요약:\n상태: ${s.status === "pass" ? "🟢 PASS" : "🔴 FAIL"}\n인원: ${s.totalPlayers}명\n결함: ${s.defects}건`;
    }
    bot.sendMessage(chatId, `<b>[크롤링 완료]</b>${summaryText}`, { parse_mode: "HTML" });
  });
}

function runCrawlerFull(chatId) {
  bot.sendMessage(chatId, "🚀 <b>[크롤러 정밀 실행]</b>\n선수 10명 대상 크롤러를 구동합니다. 다소 시간이 걸립니다...", { parse_mode: "HTML" });
  exec("node automation/crawl_player_standings.mjs --limit 10 --result-limit 0 --max-load-more 100 --result-page-limit 0", { cwd: paths.crawlerRoot, maxBuffer: 1024 * 1024 * 10 }, (error) => {
    const outDir = path.join(paths.crawlerRoot, "automation/output");
    const reportInfo = getLatestReportSummary(outDir);
    let summaryText = "";
    if (reportInfo && reportInfo.summary) {
      const s = reportInfo.summary;
      summaryText = `\n\n📊 요약:\n상태: ${s.status === "pass" ? "🟢 PASS" : "🔴 FAIL"}\n인원: ${s.totalPlayers}명\n결함: ${s.defects}건`;
    }
    bot.sendMessage(chatId, `<b>[정밀 크롤링 완료]</b>${summaryText}`, { parse_mode: "HTML" });
  });
}

function runQaTests(chatId) {
  bot.sendMessage(chatId, "🧪 <b>[QA UI 자동화 테스트 시작]</b>\nPlaywright 테스트를 실행합니다...", { parse_mode: "HTML" });
  exec("npm run test:smoke", { cwd: paths.automationRoot, maxBuffer: 1024 * 1024 * 10 }, (error) => {
    const status = error ? "🔴 실패 발생" : "🟢 모두 성공";
    bot.sendMessage(chatId, `✅ <b>[QA 자동화 테스트 완료]</b>\n결과: ${status}`, { parse_mode: "HTML" });
  });
}

bot.onText(/\/run$/, (msg) => runDashboardServer(msg.chat.id));
bot.onText(/\/run_all$/, (msg) => runAllDashboardTests(msg.chat.id));
bot.onText(/\/run_crawler$/, (msg) => runCrawlerSmoke(msg.chat.id));
bot.onText(/\/run_crawler_full$/, (msg) => runCrawlerFull(msg.chat.id));
bot.onText(/\/run_qa$/, (msg) => runQaTests(msg.chat.id));

// --- 자연어 처리 및 에이전트 루프 핸들러 ---
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // 명령어(/로 시작)인 경우 무시
  if (!text || text.startsWith("/")) return;

  if (!geminiApiKey || geminiApiKey === "your_gemini_api_key_here") {
    bot.sendMessage(chatId, "ℹ️ 현재 AI 연동이 설정되지 않았습니다.\n슬래시 명령어만 제공됩니다. 도움말은 <code>/help</code>를 입력하세요.", { parse_mode: "HTML" });
    return;
  }

  try {
    bot.sendChatAction(chatId, "typing");

    // 최초 AI 에이전트 API 호출
    let content = await callGeminiAPI(chatId, [{ text: text }]);
    
    // 최대 도구 호출 횟수 제한 (무한루프 방지)
    const MAX_LOOPS = 8;
    let loopCount = 0;

    while (content && content.parts && content.parts.some(p => p.functionCall) && loopCount < MAX_LOOPS) {
      loopCount++;

      // 모델이 생성한 도구 호출(FunctionCall) 파트를 히스토리에 추가
      conversations[chatId].push(content);
      saveHistory(conversations);

      const functionResponseParts = [];

      // 각 functionCall에 대해 순차적/병렬로 로컬 기능 실행
      for (const part of content.parts) {
        if (part.functionCall) {
          const { name, args } = part.functionCall;
          console.log(`[Agent Tool Call] '${name}' Args:`, JSON.stringify(args));
          
          let result;
          try {
            result = await executeTool(name, args, chatId);
          } catch (err) {
            console.error(`[Tool Execution Error]`, err);
            result = { error: err.message };
          }

          functionResponseParts.push({
            functionResponse: {
              name: name,
              response: result
            }
          });
        }
      }

      bot.sendChatAction(chatId, "typing");

      // 실행 결과들을 role: 'function' 형태로 대화 기록에 누적
      conversations[chatId].push({
        role: "function",
        parts: functionResponseParts
      });
      saveHistory(conversations);

      // API 재호출하여 다음 단계 파악
      content = await callGeminiAPI(chatId, null);
    }

    if (content) {
      // 최종 AI 답변을 히스토리에 저장
      conversations[chatId].push(content);
      saveHistory(conversations);

      const finalResponseText = content.parts?.map(p => p.text || "").join("") || "(답변 없음)";
      
      // 마크다운 형식 전송 시도
      try {
        await bot.sendMessage(chatId, finalResponseText, { parse_mode: "Markdown" });
      } catch (sendErr) {
        console.warn("Markdown 전송 실패, 일반 텍스트로 대체하여 재시도:", sendErr.message);
        await bot.sendMessage(chatId, finalResponseText);
      }
    }

  } catch (err) {
    console.error("에러 발생:", err);
    bot.sendMessage(chatId, `❌ 에러가 발생했습니다:\n<code>${err.message}</code>`, { parse_mode: "HTML" });
  }
});
