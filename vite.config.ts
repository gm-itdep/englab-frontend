import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  base: '/englab-frontend/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: ['es2020', 'chrome109', 'firefox115', 'safari15'],
    cssCodeSplit: true,
  },
});
