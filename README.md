# CASECALL: case interview practice for ISB students

An independent student project (not affiliated with ISB). Students create an account, work through six interviewer-led cases (five stages each), get AI feedback at every stage, replay stages, and track five skills on a dashboard.

## Pages
- `index.html` – landing page
- `app.html` – the product (served at `/app`): sign up / sign in, dashboard, case library, case sessions, readiness reports
- `try.html` – redirects to the app

## API (Vercel functions)
- `api/auth.js` – sign up / sign in (scrypt-hashed passwords, signed 30-day tokens; @isb.edu emails only by default)
- `api/cases.js` – case library (no rubrics or model answers)
- `api/attempt.js` – start a case, review an answer with Gemini, finish with a readiness report; every answer and response stored in `cc_turns`
- `api/me.js` – the student's dashboard, read back from Supabase
- `api/stats.js` – public numbers for the landing page
- `api/_cases.js` – the six cases, rubrics and model answers; `api/_shared.js` – helpers (not routes)

## Database
Run `supabase/schema.sql` once in Supabase (creates `cc_users`, `cc_attempts`, `cc_turns`, with Row Level Security on).

## Environment variables (Vercel only)
`GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`; optional `GEMINI_MODEL` (default `gemini-3.5-flash-lite`) and `ALLOWED_EMAIL_DOMAIN` (default `isb.edu`; set to empty to allow any email).

## Limits
400 output tokens per review; 80 reviews and 15 case starts per student per day; answers 20–1,500 characters; emails and phone numbers rejected; refuses non-answers and prompt injection; never predicts shortlists or offers.
