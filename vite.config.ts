import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

const GH_PAGES_BASE = '/tic-tac-toe/';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? GH_PAGES_BASE : '/',
  plugins: [react(), svgr(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))
