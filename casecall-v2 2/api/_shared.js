// Shared helpers for CASECALL's API. Files starting with "_" are not routes on Vercel.
// Secrets come ONLY from Vercel environment variables:
//   GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY  (optional: GEMINI_MODEL, ALLOWED_EMAIL_DOMAIN)
import crypto from "node:crypto";
import { normalizeTrack } from "./_profile.js";

export const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

/* ---------------- Requests ---------------- */
export function body(req) {
  let b = req.body || {};
  if (typeof b === "string") { try { b = JSON.parse(b || "{}"); } catch { b = {}; } }
  return b;
}
export function missingEnv(names) { return names.filter((k) => !process.env[k]); }

/* ---------------- Supabase (PostgREST) ---------------- */
const base = () => String(process.env.SUPABASE_URL || "").replace(/\/$/, "");
function sbHeaders(extra) {
  const key = process.env.SUPABASE_SERVICE_KEY || "";
  const h = { apikey: key, "Content-Type": "application/json", ...(extra || {}) };
  if (key.startsWith("eyJ")) h.Authorization = `Bearer ${key}`; // legacy service_role key
  return h;
}
async function sb(path, { method = "GET", body: payload, headers } = {}) {
  const r = await fetch(`${base()}/rest/v1/${path}`, {
    method, headers: sbHeaders(headers), body: payload === undefined ? undefined : JSON.stringify(payload),
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`Database error ${r.status}: ${t.slice(0, 200)}`);
  }
  if (method === "HEAD") return r;
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}
export const db = {
  select: (table, query) => sb(`${table}?${query}`),
  insert: (table, row) => sb(table, { method: "POST", body: row, headers: { Prefer: "return=representation" } }).then((x) => (Array.isArray(x) ? x[0] : x)),
  update: (table, filter, patch) => sb(`${table}?${filter}`, { method: "PATCH", body: patch, headers: { Prefer: "return=representation" } }).then((x) => (Array.isArray(x) ? x[0] : x)),
  async count(table, filter) {
    const r = await sb(`${table}?select=id${filter ? "&" + filter : ""}`, { method: "HEAD", headers: { Prefer: "count=exact" } });
    const range = r.headers.get("content-range") || "*/0";
    return parseInt(range.split("/")[1], 10) || 0;
  },
};
export const enc = encodeURIComponent;

/* ---------------- Accounts ---------------- */
// Signing secret derived from the server-only Supabase key, so no extra secret is needed.
const authSecret = () => crypto.createHash("sha256").update("casecall-auth|" + (process.env.SUPABASE_SERVICE_KEY || "")).digest();

export function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pw, salt, 32);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}
export function checkPassword(pw, stored) {
  const [alg, saltHex, hashHex] = String(stored || "").split("$");
  if (alg !== "scrypt" || !saltHex || !hashHex) return false;
  const hash = crypto.scryptSync(pw, Buffer.from(saltHex, "hex"), 32);
  const expected = Buffer.from(hashHex, "hex");
  return expected.length === hash.length && crypto.timingSafeEqual(hash, expected);
}
const b64u = (buf) => Buffer.from(buf).toString("base64url");
export function signToken(userId) {
  const payload = b64u(JSON.stringify({ uid: userId, exp: Date.now() + 30 * 24 * 3600 * 1000 }));
  const sig = b64u(crypto.createHmac("sha256", authSecret()).update(payload).digest());
  return `${payload}.${sig}`;
}
export function userIdFrom(req) {
  const h = String(req.headers.authorization || "");
  const tok = h.startsWith("Bearer ") ? h.slice(7) : "";
  const [payload, sig] = tok.split(".");
  if (!payload || !sig) return null;
  const expect = b64u(crypto.createHmac("sha256", authSecret()).update(payload).digest());
  if (sig.length !== expect.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) return null;
  try {
    const p = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!p.uid || p.exp < Date.now()) return null;
    return p.uid;
  } catch { return null; }
}
export const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, track: normalizeTrack(u.track), created_at: u.created_at });

/* ---------------- Gemini ---------------- */
// Keep "thinking" low so it doesn't eat the output budget. 2.5 models take a token budget, 3.x models a level.
// If a model rejects the setting, retry once without it.
function thinkingFor(model) {
  if (model.includes("2.5")) return { thinkingBudget: 0 };
  if (/gemini-[3-9]/.test(model)) return { thinkingLevel: "low" };
  return null;
}
export async function gemini(systemPrompt, userMsg, schema, maxTokens, opts = {}) {
  const started = Date.now();
  const call = async (withThinking) => {
    const generationConfig = { maxOutputTokens: maxTokens, temperature: opts.temperature ?? 0.3, responseMimeType: "application/json", responseSchema: schema };
    const t = withThinking ? thinkingFor(MODEL) : null;
    if (t) generationConfig.thinkingConfig = t;
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: systemPrompt }] }, contents: [{ role: "user", parts: [{ text: userMsg }] }], generationConfig }),
    });
    const data = await r.json().catch(() => ({}));
    return { r, data, usedThinking: !!t };
  };
  let { r, data, usedThinking } = await call(true);
  if (!r.ok && usedThinking && r.status === 400 && /thinking/i.test(data?.error?.message || "")) ({ r, data } = await call(false));
  if (!r.ok) throw new Error(data?.error?.message || `Gemini error ${r.status}`);
  const cand = data.candidates?.[0];
  if (cand?.finishReason === "MAX_TOKENS") throw new Error("Answer hit the token cap");
  if (cand?.finishReason === "SAFETY") throw new Error("Blocked by safety filter");
  const text = cand?.content?.parts?.filter((p) => !p.thought).map((p) => p.text || "").join("") || "";
  return {
    parsed: JSON.parse(text),
    inputTokens: data.usageMetadata?.promptTokenCount ?? null,
    outputTokens: data.usageMetadata?.candidatesTokenCount ?? null,
    latencyMs: Date.now() - started,
  };
}

export const clip = (s, n) => String(s || "").replace(/\s+/g, " ").trim().slice(0, n);
