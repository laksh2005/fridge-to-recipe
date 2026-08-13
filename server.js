// Local dev API server. Runs the same handler Vercel runs in production,
// just wrapped in Express so 'npm run dev' is a normal, boring dev server.
import 'dotenv/config';
import express from 'express';
import handler from './api/generate-recipe.js';

const app = express();
app.use(express.json());

app.post('/api/generate-recipe', handler);

const port = 3001;
app.listen(port, () => console.log(`API server listening on http://localhost:${port}`));
