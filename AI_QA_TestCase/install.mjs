import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const envPath = path.join(repoRoot, '.env');

function readEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const env = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
  return env;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function resolveCliJs() {
  if (process.env.CLI_JS && fs.existsSync(process.env.CLI_JS)) return process.env.CLI_JS;
  try {
    const npmRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
    const cliJs = path.join(npmRoot, '@anthropic-ai', 'claude-code', 'cli.js');
    if (fs.existsSync(cliJs)) return cliJs;
  } catch {}
  return 'CLI_JS_NOT_FOUND';
}

function substitute(content, vars) {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, value),
    content,
  );
}

function copyTree(srcDir, destDir, vars, filter = () => true) {
  if (!fs.existsSync(srcDir)) return;
  ensureDir(destDir);
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (!filter(src, entry)) continue;
    if (entry.isDirectory()) {
      copyTree(src, dest, vars, filter);
      continue;
    }
    const buffer = fs.readFileSync(src);
    const isText = /\.(md|json|js|sh|ps1|txt|py)$/i.test(entry.name);
    if (isText) {
      const content = substitute(buffer.toString('utf8'), vars);
      fs.writeFileSync(dest, content, 'utf8');
    } else {
      fs.writeFileSync(dest, buffer);
    }
  }
}

const env = readEnv(envPath);
const claudeHome = env.CLAUDE_HOME || path.join(os.homedir(), '.claude');
const vars = {
  NODE_PATH: env.NODE_PATH || process.execPath,
  PROJECT_ROOT: repoRoot,
  WORK_ROOT: env.WORK_ROOT || repoRoot,
  CLAUDE_HOME: claudeHome,
  CLI_JS: env.CLI_JS || resolveCliJs(),
  CONFLUENCE_SITE: env.CONFLUENCE_SITE || 'https://YOUR_SITE.atlassian.net',
  MASTER_DASHBOARD_ID: env.MASTER_DASHBOARD_ID || 'your_master_dashboard_id',
  USER_APPDATA: process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'),
};

const installedBundle = path.join(claudeHome, 'tc-team-v2');
const agentsDest = path.join(claudeHome, 'agents');
const commandsDest = path.join(claudeHome, 'commands');
const skillsDest = path.join(claudeHome, 'skills');

ensureDir(agentsDest);
ensureDir(commandsDest);
ensureDir(skillsDest);
ensureDir(installedBundle);

copyTree(path.join(repoRoot, 'agents'), agentsDest, vars);
copyTree(path.join(repoRoot, 'commands'), commandsDest, vars);
copyTree(path.join(repoRoot, 'skills'), skillsDest, vars);

copyTree(path.join(repoRoot, 'skills'), path.join(installedBundle, 'skills'), vars);
copyTree(path.join(repoRoot, 'docs'), path.join(installedBundle, 'docs'), vars);
copyTree(path.join(repoRoot, 'commands'), path.join(installedBundle, 'commands'), vars);
copyTree(path.join(repoRoot, 'agents'), path.join(installedBundle, 'agents'), vars);

console.log('[install] Claude assets installed');
console.log(`  agents   -> ${agentsDest}`);
console.log(`  commands -> ${commandsDest}`);
console.log(`  skills   -> ${skillsDest}`);
console.log(`  bundle   -> ${installedBundle}`);
