# CASECALL: case interview practice for ISB students

An independent student project (not affiliated with ISB). Students practise interviewer-led case interviews for placements and get AI feedback on every decision.

- `index.html` – landing page (product tour, interactive case decision, readiness radar, prep planner, pilot sign-up)
- `try.html` – practice workspace (served at `/try`): pick a case, type your answer, get feedback from `/api/feedback`, see live numbers from `/api/stats`
- `api/feedback.js` – Vercel function: caps, Gemini call, output checks, logs every exchange to Supabase
- `api/stats.js` – live numbers read back from Supabase
- `api/_shared.js` – Supabase helpers (not a route)
- `supabase/schema.sql` – the `case_checks` table (run once in Supabase)
- `vercel.json` – clean URLs so `/try` works

## Environment variables (Vercel only, never in code)
`GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, optional `GEMINI_MODEL` (default `gemini-3.5-flash-lite`).

## Caps and guardrails
350 max output tokens; 3 reviews per visitor plus 30 per hashed IP per day; answers 30–1,200 characters; emails and phone numbers rejected; refuses non-answers and prompt injection; never predicts shortlists or offers.
