import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    // 라이브러리 빌드로 단일 크롬 확장용 스크립트(content.js) 컴파일
    lib: {
      entry: path.resolve(__dirname, 'src/content.tsx'),
      name: 'AgentationExtension',
      formats: ['iife'],
      fileName: () => 'content.js',
    },
    // 빌드 결과물을 크롬 확장 하위 폴더(extension)로 직접 내보냄
    outDir: path.resolve(__dirname, 'extension'),
    emptyOutDir: false, // 기존 manifest.json, popup.html 등이 덮어써져 지워지지 않도록 방지
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        extend: true,
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'), // React 동작을 위해 필요
  }
});
