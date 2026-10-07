// GET /api/me -> the signed-in student's profile, case history and skill progress (read back from Supabase)
import { missingEnv, db, enc, userIdFrom, publicUser } from "./_shared.js";
import { CASES, SKILLS } from "./_cases.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Use GET." });
  const missing = missingEnv(["SUPABASE_URL", "SUPABASE_SERVICE_KEY"]);
  if (missing.length) return res.status(500).json({ error: `Server is missing: ${missing.join(", ")}` });
  const uid = userIdFrom(req);
  if (!uid) return res.status(401).json({ error: "Please sign in again." });
  try {
    const users = await db.select("cc_users", `select=*&id=eq.${enc(uid)}&limit=1`);
    if (!users[0]) return res.status(401).json({ error: "Please sign in again." });
    const attempts = await db.select("cc_attempts", `select=id,case_id,started_at,completed_at,overall,skills,summary&user_id=eq.${enc(uid)}&order=started_at.desc&limit=100`);
    const completed = attempts.filter((a) => a.completed_at).sort((a, b) => a.completed_at.localeCompare(b.completed_at));

    const skills = SKILLS.map((name) => {
      const scores = completed.map((a) => a.skills && a.skills[name]).filter((v) => typeof v === "number");
      const recent = scores.slice(-3);
      const avg = recent.length ? Math.round(recent.reduce((x, y) => x + y, 0) / recent.length) : null;
      const status = !scores.length ? "Not started" : (recent.length >= 2 && avg >= 80 ? "Interview-ready" : "Practising");
      return { name, avg, status, reps: scores.length, trend: scores.slice(-6) };
    });

    const minutes = completed.reduce((m, a) => m + Math.min(60, Math.max(1, Math.round((new Date(a.completed_at) - new Date(a.started_at)) / 60000))), 0);
    const doneIds = new Set(completed.map((a) => a.case_id));
    const weakest = skills.filter((s) => s.avg !== null).sort((a, b) => a.avg - b.avg)[0];
    const nextCase = CASES.find((c) => !doneIds.has(c.id)) || CASES[0];
    const titles = Object.fromEntries(CASES.map((c) => [c.id, `${c.company}: ${c.title}`]));

    return res.status(200).json({
      user: publicUser(users[0]),
      kpis: {
        casesCompleted: completed.length,
        avgScore: completed.length ? Math.round(completed.reduce((s, a) => s + (a.overall || 0), 0) / completed.length) : null,
        readySkills: skills.filter((s) => s.status === "Interview-ready").length,
        minutes,
      },
      skills,
      practiseNext: { caseId: nextCase.id, title: titles[nextCase.id], focus: weakest ? weakest.name : null },
      attempts: attempts.map((a) => ({ ...a, title: titles[a.case_id] || a.case_id })),
    });
  } catch (e) {
    console.error(e);
    return res.status(503).json({ error: "Our database is unavailable right now. Please try again in a minute." });
  }
}
