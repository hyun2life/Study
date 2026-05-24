import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs/promises';
import path from 'node:path';

function htmlReviewMiddleware() {
  const workspaceRoot = path.resolve(process.cwd(), '..');

  return {
    name: 'html-review-middleware',
    configureServer(server) {
      server.middlewares.use('/__html-review', async (req, res) => {
        try {
          const requestUrl = new URL(req.url || '', 'http://127.0.0.1');
          const targetPath = requestUrl.searchParams.get('path');

          if (!targetPath) {
            sendJson(res, 400, { error: 'path query is required' });
            return;
          }

          const resolvedPath = path.resolve(targetPath);
          const lowerResolved = resolvedPath.toLowerCase();
          const lowerRoot = workspaceRoot.toLowerCase();

          if (!lowerResolved.startsWith(`${lowerRoot}${path.sep}`)) {
            sendJson(res, 403, { error: `Only files under ${workspaceRoot} can be reviewed.` });
            return;
          }

          if (!/\.(html|htm)$/i.test(resolvedPath)) {
            sendJson(res, 400, { error: 'Only .html and .htm files can be reviewed.' });
            return;
          }

          const html = await fs.readFile(resolvedPath, 'utf8');
          sendJson(res, 200, { path: resolvedPath, html });
        } catch (error) {
          sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
        }
      });
    },
  };
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export default defineConfig({
  plugins: [react(), htmlReviewMiddleware()],
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
});
