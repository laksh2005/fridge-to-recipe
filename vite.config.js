import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Requests to /api go to the Express server (server.js) during local dev.
// In production Vercel serves api/generate-recipe.js directly, no proxy needed.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
