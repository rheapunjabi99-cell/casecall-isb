// GET /api/cases  -> the case library (no rubrics or model answers) and the target roles
import { CASES, SKILLS, publicCase } from "./_cases.js";
import { TRACKS, TRACK_NAMES } from "./_profile.js";
export default function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  return res.status(200).json({
    cases: CASES.map(publicCase),
    skills: SKILLS,
    tracks: TRACK_NAMES.map((name) => ({ name, blurb: TRACKS[name].blurb })),
  });
}
