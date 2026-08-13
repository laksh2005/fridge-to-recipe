# Fridge to Recipe

Type in whatever is in your fridge and get back a recipe you can actually cook with:
checkable steps, servings you can scale, and ingredient swaps.

The model never talks to you in prose. It returns structured JSON, which the app
parses, validates, and renders as interactive React components.

## Setup

```bash
npm install
cp .env.example .env
```

Add a Gemini API key to `.env` (free from [Google AI Studio](https://aistudio.google.com/apikey)):

```
GEMINI_API_KEY=your_key_here
```

```bash
npm run dev
```

## Features

- Free-form ingredient input with example presets
- Structured recipe rendering — no chat, no raw model text anywhere
- Step checklist with progress
- Servings scaler that recomputes every quantity
- Ingredient swaps suggested by the model, applied client-side
- Refinement loop — "make it spicier" edits the existing recipe in place instead
  of regenerating, and the old recipe stays visible while it updates
- Last recipe and theme persist across reloads via `localStorage`
- Light and dark mode
- Mobile responsive

## AI usage

I used Claude Code throughout, and I understand every file in this repo.

- **Scaffolding and boilerplate** — the initial Vite setup, CSS, and the
  repetitive parts of the components.
- **Design discussion** — I worked through the schema shape with it, and the
  decision to make `amount` a number rather than a string came out of that
  conversation. It is the choice the rest of the app rests on.
- **Debugging** — it caught two real bugs during verification that I would have
  shipped otherwise:
  1. An earlier version wired the local dev server as a custom Vite plugin
     that assigned the API key onto `process.env` directly; assigning
     `undefined` there stores the *string* `"undefined"`, which silently
     defeated the missing-key check and produced a confusing 502 instead of a
     clear error. Replaced that plugin with a plain Express server
     (`server.js`) for the same reason as everything else here — it's the
     boring, standard way to run a local API, and easier to explain than a
     custom Vite middleware.
  2. A refined recipe with more steps than the previous one briefly rendered
     checkboxes with `checked={undefined}`, flipping them from controlled to
     uncontrolled. Fixed in `StepChecklist`.
- **Verification** — driving the browser to test the failure paths (malformed
  JSON, wrong shapes, empty arrays, 500s, overlapping requests) rather than
  just eyeballing the happy path.

I wrote the prompt and the validation rules myself, since those are the parts
that decide whether the app works when the model misbehaves.

## Known limitations

- **Swaps are name-only.** Picking a swap changes the displayed ingredient
  name but not its quantity — asking the model to convert amounts between
  unrelated ingredients (e.g. eggs → tofu) produced unreliable numbers. The
  refinement loop is the honest way to actually recompute a recipe.
- **Scaled amounts are decimals**, not fractions (`0.75 cup`, not `¾ cup`).
- **No rate limiting or auth** on the API route — fine for a demo, not for
  production.
- **No nutrition or cook times** — kept the schema small on purpose; every
  extra field is another field the model can get wrong.

## Time spent

Roughly 7–8 hours: schema design and provider setup, the serverless endpoint,
the generation hook and stale-response handling, the components, testing the
failure paths in a real browser, and this README.

## Stack

Vite · React 19 · `@google/genai` (Gemini 2.5 Flash) · Express (local dev only)
· Vercel serverless functions · plain CSS. No state library and no schema/
validation library — `src/lib/recipeSchema.js` is about forty lines of plain
`if` checks, which is easier to read than a validation DSL and keeps the
failure handling visible instead of hidden behind an abstraction.
