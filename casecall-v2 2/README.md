# CASECALL: case interview practice for ISB students

An independent student project (not affiliated with ISB). Students pick a target role, work through interviewer-led cases (five stages each), get AI feedback at every stage, and see how they compare with the bar for that role. CASECALL then recommends cases, reading and AI-built custom cases for their weakest skills.

## What's new in v2
- **Target roles:** Consulting, Product management, General management (or Not sure yet). Each role has its own bar (target score) and weight for each of the five skills, set in `api/_profile.js`. Students can switch role on the dashboard at any time.
- **Dashboard:** skills against the role's bar (black tick), strengths and gaps, role readiness %, a progression chart of every completed case, and a table of every case with its score per stage.
- **Recommendations:** every case is tagged with `domains` (roles it suits) and `focus` (the two skills it tests hardest). The biggest weighted gaps against the role's bar pick the cases, a practice tip and a reading list (links checked in October 2026).
- **Custom cases:** Gemini writes a new five-stage case (exhibit, maths, twist, rubric and model answers) aimed at the student's weakest skills and role. Limited to 3 a day per student. Stored on the attempt (`cc_attempts.custom_case`).
- **Nine cases** (three new): Kosh (product prioritisation), PrepPal (A/B test readout), Saffron Foods (general management turnaround).

## Pages
- `index.html`: landing page
- `app.html`: the product (served at `/app`): sign up / sign in, dashboard, case library, case sessions, readiness reports
- `try.html`: redirects to the app

## API (Vercel functions)
- `api/auth.js`: sign up / sign in (scrypt-hashed passwords, signed 30-day tokens; @isb.edu emails only by default)
- `api/cases.js`: case library (no rubrics or model answers) and target roles
- `api/attempt.js`: start a case, build a custom case, review an answer with Gemini, finish with a readiness report and next-step recommendation
- `api/me.js`: dashboard data (GET) and change target role (POST)
- `api/stats.js`: public numbers for the landing page
- Helpers (not routes): `api/_cases.js` (cases, rubrics, tags), `api/_profile.js` (role bars, reading list, recommendation logic), `api/_custom.js` (custom-case writer), `api/_shared.js`

## Database
- **New install:** run `supabase/schema.sql` once in Supabase.
- **Already running v1:** run `supabase/upgrade.sql` once (adds `custom_case`, renames old role labels). Until you do, everything works except custom cases.

## Environment variables (Vercel only)
`GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`; optional `GEMINI_MODEL` (default `gemini-3.5-flash-lite`) and `ALLOWED_EMAIL_DOMAIN` (default `isb.edu`; set to empty to allow any email).

## Limits
400 output tokens per review, 8,192 per custom case; 80 reviews, 15 case starts and 3 custom cases per student per day; answers 20 to 1,500 characters; emails and phone numbers rejected; refuses non-answers and prompt injection; never predicts shortlists or offers. `vercel.json` gives `api/attempt.js` up to 60 seconds, because writing a custom case takes 15 to 30 seconds.
