import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  plugins: [react()],
  envDir: fileURLToPath(new URL('../..', import.meta.url)),
  server: {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
    proxy: { '/api': 'http://localhost:8080' },
  },
});
