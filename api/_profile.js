// Target-role profiles, the reading list, and the logic that turns a student's case history
// into strengths, gaps and recommendations. Not a route (file starts with "_").
import { CASES, SKILLS } from "./_cases.js";

/* ---------------- Target roles ---------------- */
// target = the score (out of 100) we treat as "at the bar" for that role.
// weight = how much the skill counts toward overall readiness for that role.
// lens   = what interviewers for that role look for in this skill.
export const TRACKS = {
  "Consulting": {
    blurb: "MBB and tier-2 firms. Heavy on structure, exhibits and fast, accurate maths.",
    skills: {
      "Structuring":                  { target: 85, weight: 1.3, lens: "A MECE, case-specific structure in the first two minutes." },
      "Reading exhibits":             { target: 80, weight: 1.0, lens: "Pull the 'so what' from a chart or table in seconds." },
      "Quant and maths":              { target: 85, weight: 1.3, lens: "Clean mental maths, lakh vs crore, and a sense-check." },
      "Hypothesis-driven thinking":   { target: 80, weight: 1.0, lens: "Lead with a hypothesis and change course when the data says so." },
      "Synthesis and recommendation": { target: 80, weight: 1.0, lens: "Answer first, then reasons, risks and next steps." },
    },
  },
  "Product management": {
    blurb: "PM and APM roles. Heavy on problem solving, metrics and making a clear call.",
    skills: {
      "Structuring":                  { target: 75, weight: 0.9, lens: "Turn a fuzzy product problem into users, goals and metrics." },
      "Reading exhibits":             { target: 80, weight: 1.1, lens: "Read funnels, dashboards and experiment results correctly." },
      "Quant and maths":              { target: 65, weight: 0.7, lens: "Quick estimates of impact; no need for consulting-level speed." },
      "Hypothesis-driven thinking":   { target: 85, weight: 1.3, lens: "Problem solving: form a hypothesis about user behaviour and test it." },
      "Synthesis and recommendation": { target: 80, weight: 1.0, lens: "Make a clear call on trade-offs and bring engineering and leadership along." },
    },
  },
  "General management": {
    blurb: "GM, strategy and leadership programmes. Heavy on judgement, trade-offs and a clear plan.",
    skills: {
      "Structuring":                  { target: 75, weight: 0.9, lens: "Frame the business problem, including people and stakeholders." },
      "Reading exhibits":             { target: 70, weight: 0.8, lens: "Spot what the P&L or channel data is really saying." },
      "Quant and maths":              { target: 70, weight: 0.8, lens: "Size the prize and the cost of each option." },
      "Hypothesis-driven thinking":   { target: 80, weight: 1.2, lens: "Diagnose the root cause before acting under constraints." },
      "Synthesis and recommendation": { target: 85, weight: 1.3, lens: "A decisive plan with owners, risks and what you won't do." },
    },
  },
  "Not sure yet": {
    blurb: "A balanced bar across all five skills until you pick a role.",
    skills: Object.fromEntries(SKILLS.map((s) => [s, { target: 80, weight: 1, lens: "" }])),
  },
};
export const TRACK_NAMES = Object.keys(TRACKS);
const LEGACY = { "Product": "Product management", "Strategy and general management": "General management", "Strategy": "General management" };
export function normalizeTrack(t) {
  const v = LEGACY[t] || t;
  return TRACKS[v] ? v : "Not sure yet";
}

/* ---------------- Reading list ----------------
   Links were checked in October 2026. `tracks` limits an item to those roles; no `tracks` = everyone. */
export const READINGS = {
  "Structuring": [
    { title: "Interviewing at McKinsey: sample cases", source: "McKinsey", kind: "Guide", url: "https://www.mckinsey.com/careers/interviewing", tracks: ["Consulting", "General management", "Not sure yet"] },
    { title: "Case in Point", source: "Marc Cosentino", kind: "Book", tracks: ["Consulting", "Not sure yet"] },
    { title: "Decode and Conquer", source: "Lewis C. Lin", kind: "Book", tracks: ["Product management"] },
    { title: "What Is Strategy?", source: "Michael E. Porter, HBR", kind: "Article", url: "https://hbr.org/1996/11/what-is-strategy", tracks: ["General management"] },
  ],
  "Reading exhibits": [
    { title: "A complete guide to analysing case interview graphs and charts", source: "Hacking the Case Interview", kind: "Guide", url: "https://hackingthecaseinterview.com/pages/case-interview-graphs-charts" },
    { title: "North Star Playbook", source: "Amplitude", kind: "Guide", url: "https://amplitude.com/books/north-star", tracks: ["Product management"] },
    { title: "Storytelling with Data", source: "Cole Nussbaumer Knaflic", kind: "Book" },
  ],
  "Quant and maths": [
    { title: "How to do case interview mental math", source: "Victor Cheng, CaseInterview.com", kind: "Guide", url: "https://caseinterview.com/mental-math" },
    { title: "Case interview math: the complete guide", source: "Hacking the Case Interview", kind: "Guide", url: "https://hackingthecaseinterview.com/pages/consulting-case-interview-math" },
    { title: "Case Interview Secrets", source: "Victor Cheng", kind: "Book", tracks: ["Consulting", "Not sure yet"] },
  ],
  "Hypothesis-driven thinking": [
    { title: "How to develop product sense", source: "Lenny's Newsletter", kind: "Article", url: "https://www.lennysnewsletter.com/p/how-to-develop-product-sense", tracks: ["Product management"] },
    { title: "How to master the seven-step problem-solving process", source: "McKinsey podcast", kind: "Podcast", url: "https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/how-to-master-the-seven-step-problem-solving-process" },
    { title: "Prioritisation and trade-off interview questions", source: "IGotAnOffer", kind: "Guide", url: "https://igotanoffer.com/blogs/product-manager/prioritization-and-trade-off-interview-questions", tracks: ["Product management"] },
    { title: "Bulletproof Problem Solving", source: "Charles Conn and Robert McLean", kind: "Book" },
  ],
  "Synthesis and recommendation": [
    { title: "The Pyramid Principle", source: "Barbara Minto", kind: "Book" },
    { title: "Pyramid Principle for consulting: how to deliver a case synthesis", source: "Road to Offer", kind: "Guide", url: "https://www.roadtooffer.com/blog/pyramid-principle", tracks: ["Consulting", "General management", "Not sure yet"] },
    { title: "Cracking the PM Interview", source: "Gayle Laakmann McDowell and Jackie Bavaro", kind: "Book", tracks: ["Product management"] },
    { title: "Good Strategy Bad Strategy", source: "Richard Rumelt", kind: "Book", tracks: ["General management"] },
  ],
};
export function readingsFor(skill, track, n = 3) {
  const all = READINGS[skill] || [];
  const mine = all.filter((r) => r.tracks && r.tracks.includes(track));
  const general = all.filter((r) => !r.tracks);
  return [...mine, ...general].slice(0, n).map(({ tracks, ...r }) => r);
}

export const PRACTICE_TIP = {
  "Structuring": "Before answering, take 30 seconds to lay out three or four branches specific to the case, and say which you'd check first.",
  "Reading exhibits": "When an exhibit appears, find the one or two numbers that changed most and say what they mean before anything else.",
  "Quant and maths": "Say each step out loud, keep track of lakh vs crore, and sense-check the final number against the size of the business.",
  "Hypothesis-driven thinking": "When the case twists, restate the new constraint, then build your answer around it instead of defending your first idea.",
  "Synthesis and recommendation": "Lead with the answer in one line, then two reasons with numbers, one risk, and a next step.",
};

/* ---------------- Case picks ---------------- */
// Cases that train `skill`, best first: in the student's role, not done yet, then lowest past score on that skill.
export function casesForSkill(skill, track, done, n = 2) {
  // done: { caseId: { best: overall, skill: { name: score } } }
  const rank = (c) => {
    const inTrack = track === "Not sure yet" || c.domains.includes(track) ? 0 : 1;
    const d = done[c.id];
    const tried = d ? 1 : 0;
    const past = d && d.skills && typeof d.skills[skill] === "number" ? d.skills[skill] : 0;
    return [inTrack, tried, past];
  };
  return CASES.filter((c) => c.focus.includes(skill))
    .map((c) => ({ c, r: rank(c) }))
    .sort((a, b) => a.r[0] - b.r[0] || a.r[1] - b.r[1] || a.r[2] - b.r[2])
    .slice(0, n)
    .map(({ c }) => ({
      caseId: c.id, title: `${c.company}: ${c.title}`, type: c.type, difficulty: c.difficulty, minutes: c.minutes,
      domains: c.domains, focus: c.focus, done: !!done[c.id], best: done[c.id] ? done[c.id].best : null,
      offTrack: !(track === "Not sure yet" || c.domains.includes(track)),
    }));
}

/* ---------------- Profile ---------------- */
// attempts: completed cc_attempts rows (oldest first), each with skills {name: 0-100} and overall.
export function buildProfile(completed, trackName) {
  const track = normalizeTrack(trackName);
  const T = TRACKS[track];

  const done = {};
  for (const a of completed) {
    if (a.case_id === "custom") continue;
    const d = done[a.case_id] || { best: 0, skills: {} };
    d.best = Math.max(d.best, a.overall || 0);
    for (const [k, v] of Object.entries(a.skills || {})) d.skills[k] = Math.max(d.skills[k] || 0, v);
    done[a.case_id] = d;
  }

  const skills = SKILLS.map((name) => {
    const scores = completed.map((a) => a.skills && a.skills[name]).filter((v) => typeof v === "number");
    const recent = scores.slice(-3);
    const avg = recent.length ? Math.round(recent.reduce((x, y) => x + y, 0) / recent.length) : null;
    const { target, weight, lens } = T.skills[name];
    const gap = avg == null ? null : target - avg;
    let status = "Not started";
    if (avg != null) status = gap <= 0 ? (recent.length >= 2 ? "At the bar" : "At the bar, 1 case") : gap <= 10 ? "Close" : "Gap";
    return { name, avg, target, weight, lens, gap, status, reps: scores.length, trend: scores.slice(-8) };
  });

  const measured = skills.filter((s) => s.avg != null);
  const wsum = measured.reduce((a, s) => a + s.weight, 0);
  const readiness = measured.length ? Math.round((measured.reduce((a, s) => a + s.weight * Math.min(1, s.avg / s.target), 0) / wsum) * 100) : null;

  const strengths = measured.filter((s) => s.gap <= 0).sort((a, b) => a.gap - b.gap).map((s) => s.name);
  const gaps = measured.filter((s) => s.gap > 0).sort((a, b) => b.gap * b.weight - a.gap * a.weight).map((s) => s.name);

  // What to work on: biggest weighted gaps; if everything is at the bar, the relatively weakest skills.
  let focus = gaps.slice(0, 2);
  let mode = "gap";
  if (!measured.length) {
    mode = "baseline";
    focus = Object.entries(T.skills).sort((a, b) => b[1].weight - a[1].weight).slice(0, 2).map(([n]) => n);
  } else if (!focus.length) {
    mode = "stretch";
    focus = [...measured].sort((a, b) => (a.avg - a.target) - (b.avg - b.target)).slice(0, 2).map((s) => s.name);
  }

  const recommendations = focus.map((name) => {
    const s = skills.find((x) => x.name === name);
    const why = mode === "baseline"
      ? `${track === "Not sure yet" ? "A core skill" : `One of the skills ${track} interviews weigh most`}. Do a case to set your baseline.`
      : mode === "stretch"
        ? `You're at the ${track} bar here (${s.avg}/100). Keep it sharp with a harder case.`
        : `You're at ${s.avg}/100 against a ${track} bar of ${s.target}, a gap of ${s.gap} points.`;
    return { skill: name, avg: s.avg, target: s.target, gap: s.gap, why, tip: PRACTICE_TIP[name], cases: casesForSkill(name, track, done), readings: readingsFor(name, track) };
  });

  return { track, trackBlurb: T.blurb, skills, readiness, strengths, gaps, focusMode: mode, recommendations, done };
}
