# Fridge to Recipe

Type in whatever is in your fridge and get back a recipe you can actually cook with:
checkable steps, servings you can scale, and ingredient swaps.

The model never talks to you in prose. It returns structured JSON, which the app
parses, validates, and renders as interactive React components.


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
