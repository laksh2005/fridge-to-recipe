# Fridge to Recipe

Type in whatever is in your fridge and get back a recipe you can actually cook with:
checkable steps, servings you can scale, and ingredient swaps.

The model never talks to you in prose. It returns structured JSON, which the app
parses, validates, and renders as interactive React components.

## Setup

```bash
npm install
```

Create a `.env` file from the example and add a Gemini API key
(free from [Google AI Studio](https://aistudio.google.com/apikey)):

```bash
cp .env.example .env
```

```
GEMINI_API_KEY=your_key_here
```

Then:

```bash
npm start
```

Open http://localhost:5173.

## How the API key stays secret

The key is only ever read on the server.

- In production, `api/generate-recipe.js` runs as a Vercel serverless function.
- Locally there is no Vercel, so a small plugin in `vite.config.js` runs that
  **same handler file** as dev-server middleware. There is no dev-only copy of
  the logic to keep in sync.

The variable is deliberately not prefixed with `VITE_`, so Vite will not inline
it into the client bundle. The browser only ever sees `POST /api/generate-recipe`.

## Deploying

Push to GitHub, import the repo in Vercel (it auto-detects Vite), and add
`GEMINI_API_KEY` as a project environment variable. The `api/` folder is picked
up as a serverless function automatically.

## How it works

```
IngredientInput ──▶ useRecipeGeneration ──▶ /api/generate-recipe ──▶ Gemini
                            │                                          │
                            ▼                                    JSON (schema-constrained)
                    validate + normalize
                            │
                            ▼
                   RecipeCard ─ ServingsControl
                              ─ SwapPicker
                              ─ StepChecklist
                              ─ RefinementBar
```

Gemini is called in JSON mode with a `responseSchema`, so it is constrained to
this shape:

```js
{
  title, description, servings,
  ingredients: [{ name, amount, unit, swaps: [] }],
  steps: [string]
}
```

`amount` is always a **number**, never `"1/2 cup"`. That is the single decision
that makes servings scaling pure maths (`amount * target / base`) instead of
fragile string parsing. Ingredients measured to taste come back as `amount: 0`
with `unit: "to taste"`, and the UI skips scaling them.

## Handling bad AI output

A schema constrains the *shape*, not the *sense*, and the transport can fail
independently of the model. Each of these is handled and none of them crashes
the app:

| What goes wrong | What happens |
| --- | --- |
| Malformed JSON | Parsed in a `try/catch` on the server; returns a clean 502, UI shows a retry |
| Valid JSON, wrong shape | `validateRecipe()` rejects it with a specific message |
| Empty ingredients or steps | Rejected — a recipe with no steps is not a recipe |
| `amount` comes back as `"two cups"` | Rejected with the offending ingredient named |
| Request fails or times out | 25s `AbortController` timeout, friendly message, retry button |
| Missing API key | Caught before the call, returns a clear server error |
| Two requests in flight | Older response is discarded (see below) |

**Stale responses.** Every request gets an incrementing id. When a response
arrives, it is only applied if its id is still the latest one, and the previous
request is aborted when a new one starts. A slow first request can therefore
never overwrite a faster second one. This is verified behaviour, not a hope —
firing two overlapping requests where the first is deliberately slower shows the
first result never reaching the screen.

**Errors are never destructive.** If a refinement fails, the recipe you already
had stays on screen with a "keep previous recipe" option, rather than being
replaced by an error page.

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

## Known limitations

- **Swaps are name-only.** Choosing "silken tofu" instead of "eggs" does not
  recalculate the quantity. Asking the model to convert quantities between
  unrelated ingredients produced unreliable numbers, so the swap changes the
  displayed name and leaves the amount alone. The honest fix is a refinement
  call, which the app already supports.
- **Scaled amounts are decimals**, not fractions — you get `0.75 cup`, not
  `¾ cup`. Cosmetic, and the fraction-snapping heuristics I tried were more
  code than they were worth.
- **No rate limiting or auth** on the API route. Fine for a demo, not for
  anything public.
- **Serverless cold starts** can add a second or two to the first request.
- **No nutrition, no cook times** — the schema stays small on purpose. Each
  extra field is another field the model can get wrong.
- **Refinement sends the whole recipe back each time**, which is simple and
  correct but not the cheapest possible token use.

## What I'd do next

- A recipe history list rather than only the most recent one
- Streaming, so steps appear as they generate instead of after a pause
- Unit tests on `scaleIngredients` and `validateRecipe` — both are pure
  functions written to be testable, I just ran out of time to write the tests
- Fraction formatting for scaled amounts

## AI usage

I used Claude Code throughout, and I understand every file in this repo.

- **Scaffolding and boilerplate** — the initial Vite setup, CSS, and the
  repetitive parts of the components.
- **Design discussion** — I worked through the schema shape with it, and the
  decision to make `amount` a number rather than a string came out of that
  conversation. It is the choice the rest of the app rests on.
- **Debugging** — it caught two real bugs during verification that I would have
  shipped otherwise:
  1. Assigning `undefined` to `process.env.GEMINI_API_KEY` in the dev plugin
     stores the *string* `"undefined"`, which silently defeated the
     missing-key check and produced a confusing 502 instead of a clear error.
  2. A refined recipe with more steps than the previous one briefly rendered
     checkboxes with `checked={undefined}`, flipping them from controlled to
     uncontrolled. Fixed in `StepChecklist`.
- **Verification** — driving the browser to test the failure paths (malformed
  JSON, wrong shapes, empty arrays, 500s, overlapping requests) rather than
  just eyeballing the happy path.

I wrote the prompt and the validation rules myself, since those are the parts
that decide whether the app works when the model misbehaves.

## Time spent

Roughly 7 hours.

| | |
| --- | --- |
| Planning, schema design, provider setup | ~1h |
| Serverless endpoint and Gemini integration | ~1h |
| Hook, request lifecycle, stale-response handling | ~1.5h |
| Components and interactive state | ~1.5h |
| Failure-path testing and fixes | ~1h |
| Styling, dark mode, mobile | ~0.5h |
| README | ~0.5h |

## Stack

Vite · React 19 (hooks, function components) · `@google/genai` (Gemini 2.5 Flash)
· Vercel serverless functions · plain CSS. No state library and no validation
library — the validation is about forty lines of plain JavaScript in
`src/lib/recipeSchema.js`, which is easier to read than a schema DSL and makes
the failure handling visible rather than hidden behind an abstraction.
