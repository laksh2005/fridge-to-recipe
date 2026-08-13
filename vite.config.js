import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// In production Vercel runs api/generate-recipe.js as a serverless function.
// Locally there is no Vercel, so this plugin runs the exact same handler as
// dev-server middleware. One handler file, no dev-only copy to keep in sync.
function apiPlugin(env) {
  return {
    name: 'local-api',
    configureServer(server) {
      // The key is read from .env here, on the server, and is never exposed
      // to the browser (it has no VITE_ prefix, so Vite will not inline it).
      // Guarded, because assigning undefined to process.env stores the
      // string "undefined", which would defeat the handler's missing-key check.
      if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;

      server.middlewares.use('/api/generate-recipe', async (req, res) => {
        const { default: handler } = await server.ssrLoadModule('/api/generate-recipe.js');

        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const raw = Buffer.concat(chunks).toString();

        try {
          req.body = raw ? JSON.parse(raw) : {};
        } catch {
          req.body = null;
        }

        // Minimal stand-in for the status().json() helpers Vercel provides.
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };

        await handler(req, res);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return { plugins: [react(), apiPlugin(env)] };
});
