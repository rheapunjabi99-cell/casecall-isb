// GET /api/stats -> public numbers for the landing page, read back from Supabase
import { missingEnv, db, enc } from "./_shared.js";
import { SKILLS } from "./_cases.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Use GET." });
  if (missingEnv(["SUPABASE_URL", "SUPABASE_SERVICE_KEY"]).length) return res.status(500).json({ error: "Server is missing Supabase settings." });
  try {
    const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
    const [total, strong, students, recent] = await Promise.all([
      db.count("cc_turns", "is_valid=eq.true"),
      db.count("cc_turns", "is_valid=eq.true&verdict=eq.strong"),
      db.count("cc_users", ""),
      db.select("cc_turns", `select=skill,verdict&is_valid=eq.true&created_at=gte.${enc(since)}&limit=5000`),
    ]);
    const counts = {};
    for (const r of recent) if (r.verdict !== "strong" && SKILLS.includes(r.skill)) counts[r.skill] = (counts[r.skill] || 0) + 1;
    const topFocus = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([skill, count]) => ({ skill, count }));
    res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate=60");
    return res.status(200).json({ total, strongShare: total ? Math.round((strong / total) * 100) : 0, students, topFocus });
  } catch (e) {
    console.error(e);
    return res.status(503).json({ error: "Stats are unavailable right now." });
  }
}
