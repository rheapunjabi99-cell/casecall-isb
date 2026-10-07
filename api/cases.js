// GET /api/cases  -> the case library (no rubrics or model answers)
import { CASES, publicCase } from "./_cases.js";
export default function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  return res.status(200).json({ cases: CASES.map(publicCase) });
}
