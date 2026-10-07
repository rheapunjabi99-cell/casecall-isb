// GET  /api/me              -> profile, every case attempt with its ratings, skills vs the target role, recommendations
// POST /api/me { track }    -> change the student's target role
import { body, missingEnv, db, enc, userIdFrom, publicUser } from "./_shared.js";
import { CASES } from "./_cases.js";
import { buildProfile, normalizeTrack, TRACKS, TRACK_NAMES } from "./_profile.js";

const COLS = "id,case_id,started_at,completed_at,overall,skills,summary";

async function loadAttempts(uid) {
  const q = (cols) => db.select("cc_attempts", `select=${cols}&user_id=eq.${enc(uid)}&order=started_at.desc&limit=200`);
  try {
    // custom_title / custom_focus need supabase/upgrade.sql; fall back quietly if it hasn't been run yet.
    return await q(`${COLS},custom_title:custom_case->>title,custom_company:custom_case->>company,custom_focus:custom_case->focus`);
  } catch (e) {
    return await q(COLS);
  }
}

export default async function handler(req, res) {
  const missing = missingEnv(["SUPABASE_URL", "SUPABASE_SERVICE_KEY"]);
  if (missing.length) return res.status(500).json({ error: `Server is missing: ${missing.join(", ")}` });
  const uid = userIdFrom(req);
  if (!uid) return res.status(401).json({ error: "Please sign in again." });

  try {
    if (req.method === "POST") {
      const b = body(req);
      if (!TRACKS[b.track]) return res.status(400).json({ error: "Pick Consulting, Product management, General management or Not sure yet." });
      const u = await db.update("cc_users", `id=eq.${enc(uid)}`, { track: b.track });
      if (!u) return res.status(401).json({ error: "Please sign in again." });
      return res.status(200).json({ user: publicUser(u) });
    }
    if (req.method !== "GET") return res.status(405).json({ error: "Use GET or POST." });

    const users = await db.select("cc_users", `select=*&id=eq.${enc(uid)}&limit=1`);
    if (!users[0]) return res.status(401).json({ error: "Please sign in again." });
    const user = publicUser(users[0]);
    const attempts = await loadAttempts(uid);
    const completed = attempts.filter((a) => a.completed_at).sort((a, b) => a.completed_at.localeCompare(b.completed_at));

    const profile = buildProfile(completed, user.track);
    const byId = Object.fromEntries(CASES.map((c) => [c.id, c]));
    const describe = (a) => {
      if (a.case_id === "custom") {
        return { title: `${a.custom_company || "Custom case"}: ${a.custom_title || "Built for your gaps"}`, type: "Custom case", domains: [profile.track], focus: Array.isArray(a.custom_focus) ? a.custom_focus : [], custom: true };
      }
      const c = byId[a.case_id];
      return c ? { title: `${c.company}: ${c.title}`, type: c.type, domains: c.domains, focus: c.focus, custom: false } : { title: a.case_id, type: "", domains: [], focus: [], custom: false };
    };

    const minutes = completed.reduce((m, a) => m + Math.min(60, Math.max(1, Math.round((new Date(a.completed_at) - new Date(a.started_at)) / 60000))), 0);
    const avg = completed.length ? Math.round(completed.reduce((s, a) => s + (a.overall || 0), 0) / completed.length) : null;
    const firstThree = completed.slice(0, 3), lastThree = completed.slice(-3);
    const mean = (xs) => Math.round(xs.reduce((s, a) => s + (a.overall || 0), 0) / xs.length);
    const change = completed.length >= 4 ? mean(lastThree) - mean(firstThree) : null;

    const { done, ...pub } = profile;
    return res.status(200).json({
      user,
      tracks: TRACK_NAMES.map((name) => ({ name, blurb: TRACKS[name].blurb })),
      kpis: {
        casesCompleted: completed.length,
        avgScore: avg,
        readiness: profile.readiness,
        atBar: profile.skills.filter((s) => s.status === "At the bar").length,
        minutes,
        change,
      },
      ...pub,
      progression: completed.map((a) => ({ id: a.id, completed_at: a.completed_at, overall: a.overall, title: describe(a).title })),
      attempts: attempts.map((a) => {
        const { custom_title, custom_company, custom_focus, ...rest } = a;
        return { ...rest, ...describe(a) };
      }),
    });
  } catch (e) {
    console.error(e);
    return res.status(503).json({ error: "Our database is unavailable right now. Please try again in a minute." });
  }
}
