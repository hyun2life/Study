import { test, expect } from '@playwright/test';
import { spawn, execSync } from 'child_process';
import * as path from 'path';

let serverProcess;

test.describe.configure({ mode: 'serial' });

test.describe('Web Runner Server Tests', () => {
  test.beforeAll(async () => {
    return new Promise((resolve, reject) => {
      // Ensure we run the server from the WSOP-Web-Automation root
      serverProcess = spawn('node', ['scripts/web-runner-server.js'], {
        cwd: process.cwd(),
        env: { ...process.env, PORT: '3000', AUTO_LAUNCH: 'false' }
      });

      serverProcess.stdout.on('data', (data) => {
        if (data.toString().includes('dashboard server running')) {
          resolve();
        }
      });

      serverProcess.on('error', (err) => {
        reject(err);
      });

      // Fallback resolve in case output format changes
      setTimeout(() => resolve(), 3000);
    });
  });

  test.afterAll(() => {
    if (serverProcess && !serverProcess.killed) {
      serverProcess.kill('SIGINT');
    }
  });

  test('POST /api/run handles arguments correctly and does not execute injected commands via shell', async ({ request }) => {
    // Generate a unique filename for the pwned test
    const pwnedPath = path.join('/tmp', `pwned-${Date.now()}`);

    const response = await request.post('http://127.0.0.1:3000/api/run', {
      data: {
        phaseId: 'list',
        customArgs: {
          "test-inj": `a; touch ${pwnedPath}`
        }
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);

    // Give child process enough time to spawn and potentially execute the injected command
    await new Promise(r => setTimeout(r, 1500));

    const fs = require('fs');
    // Expecting the file NOT to exist because shell evaluation is disabled
    expect(fs.existsSync(pwnedPath)).toBe(false);
  });
});
