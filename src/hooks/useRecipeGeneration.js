import { useCallback, useRef, useState } from 'react';
import { normalizeRecipe, validateRecipe } from '../lib/recipeSchema.js';

const TIMEOUT_MS = 25000;
const STORAGE_KEY = 'fridge-to-recipe:last-recipe';

function loadSavedRecipe() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveRecipe(recipe) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipe));
  } catch {
    // Storage being full or blocked should never break the app.
  }
}

export function useRecipeGeneration() {
  const [recipe, setRecipe] = useState(loadSavedRecipe);
  const [status, setStatus] = useState('idle'); // idle | loading | error | success
  const [error, setError] = useState(null);

  // Every request gets a number. When a response comes back we only use it if
  // its number is still the latest one, so a slow first request can never
  // overwrite a faster second one.
  const requestIdRef = useRef(0);
  const controllerRef = useRef(null);
  const lastRequestRef = useRef(null);

  const send = useCallback(async (body) => {
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    lastRequestRef.current = body;

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = setTimeout(() => controller.abort('timeout'), TIMEOUT_MS);

    setStatus('loading');
    setError(null);

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => null);
      if (requestId !== requestIdRef.current) return;

      if (!response.ok) {
        setError(data?.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      const problem = validateRecipe(data);
      if (problem) {
        setError(`${problem} Please try again.`);
        setStatus('error');
        return;
      }

      const clean = normalizeRecipe(data);
      setRecipe(clean);
      saveRecipe(clean);
      setStatus('success');
    } catch (caught) {
      if (requestId !== requestIdRef.current) return;

      if (caught.name === 'AbortError') {
        setError('That took too long. Please try again.');
      } else {
        setError('Could not reach the server. Check your connection and try again.');
      }
      setStatus('error');
    } finally {
      clearTimeout(timeout);
    }
  }, []);

  const generate = useCallback((ingredientsText) => send({ mode: 'generate', ingredientsText }), [send]);

  const refine = useCallback(
    (instruction, previousRecipe) => send({ mode: 'refine', instruction, previousRecipe }),
    [send],
  );

  const retry = useCallback(() => {
    if (lastRequestRef.current) send(lastRequestRef.current);
  }, [send]);

  // Go back to whatever we were showing before the failed request.
  const dismissError = useCallback(() => {
    setError(null);
    setStatus(recipe ? 'success' : 'idle');
  }, [recipe]);

  const clearRecipe = useCallback(() => {
    requestIdRef.current += 1;
    controllerRef.current?.abort();
    setRecipe(null);
    setError(null);
    setStatus('idle');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { recipe, status, error, generate, refine, retry, dismissError, clearRecipe };
}
