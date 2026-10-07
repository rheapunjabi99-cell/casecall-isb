// POST /api/auth   { action: "signup" | "login", email, password, name?, track? }
// Student accounts for CASECALL. Passwords are hashed with scrypt; the app gets a signed 30-day token.
import { body, missingEnv, db, enc, hashPassword, checkPassword, signToken, publicUser, clip } from "./_shared.js";

const TRACKS = ["Consulting", "Product", "Strategy and general management", "Not sure yet"];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });
  const missing = missingEnv(["SUPABASE_URL", "SUPABASE_SERVICE_KEY"]);
  if (missing.length) return res.status(500).json({ error: `Server is missing: ${missing.join(", ")}` });

  const b = body(req);
  const email = String(b.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  const domain = (process.env.ALLOWED_EMAIL_DOMAIN || "isb.edu").toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Enter a valid email address." });
  if (domain && !email.endsWith("@" + domain)) return res.status(400).json({ error: `Use your @${domain} email. CASECALL is for ISB students during the pilot.` });
  if (password.length < 8) return res.status(400).json({ error: "Use a password of at least 8 characters." });

  try {
    const existing = await db.select("cc_users", `select=*&email=eq.${enc(email)}&limit=1`);
    if (b.action === "signup") {
      if (existing.length) return res.status(409).json({ error: "An account with this email already exists. Sign in instead." });
      const name = clip(b.name, 60);
      if (!name) return res.status(400).json({ error: "Enter your name." });
      const track = TRACKS.includes(b.track) ? b.track : "Not sure yet";
      const user = await db.insert("cc_users", { email, name, track, pw_hash: hashPassword(password) });
      return res.status(200).json({ token: signToken(user.id), user: publicUser(user) });
    }
    if (b.action === "login") {
      const user = existing[0];
      if (!user || !checkPassword(password, user.pw_hash)) return res.status(401).json({ error: "That email and password don't match." });
      return res.status(200).json({ token: signToken(user.id), user: publicUser(user) });
    }
    return res.status(400).json({ error: "Unknown action." });
  } catch (e) {
    console.error(e);
    return res.status(503).json({ error: "Our database is unavailable right now. Please try again in a minute." });
  }
}
