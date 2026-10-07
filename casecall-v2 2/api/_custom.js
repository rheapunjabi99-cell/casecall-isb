// AI-built practice cases, aimed at a student's weakest skills for their target role.
// Gemini writes the case, rubric and model answers; the server checks the shape before storing it on the attempt.
import { gemini, MODEL, clip } from "./_shared.js";
import { CASES, SKILLS } from "./_cases.js";

const MAX_OUTPUT_TOKENS = 8192;

const ROLE_BRIEF = {
  "Consulting": "a classic consulting case: profitability, market entry, growth strategy, pricing, operations or an M&A screen, for a client in India",
  "Product management": "a product management case: diagnosing a metric drop, prioritising features, reading an experiment, defining success metrics or a launch decision for an Indian app or digital product",
  "General management": "a general management case: running a business unit, a turnaround, a P&L trade-off, a channel or pricing call, or a people and stakeholder decision in an Indian company",
  "Not sure yet": "a business case that could appear in consulting, product or general management interviews, set in India",
};

const STAGE_RULES = {
  "Structuring": "Ask the student to structure their approach. The strong answer is a case-specific structure, not a textbook framework.",
  "Reading exhibits": "Give a table exhibit (3 to 6 rows) and ask what stands out. Include one row that changed a lot and at least one distractor row.",
  "Quant and maths": "Ask for one calculation using numbers already given in the intro, the exhibit or this prompt. The answer must be a specific number.",
  "Hypothesis-driven thinking": "Introduce a twist: new information or a constraint that rules out the obvious answer. Ask what they would look at and do now. You may add a small second exhibit.",
  "Synthesis and recommendation": "Ask for a one-minute recommendation to a named senior person (CEO, Head of Product, COO).",
};

const FOCUS_RULES = {
  "Structuring": "make the problem unusual enough that a generic framework fails, and make the structuring rubric demanding",
  "Reading exhibits": "make the stage 2 exhibit richer (5 or 6 rows) with a tempting distractor, so the key insight takes real reading",
  "Quant and maths": "make the maths stage a two-step calculation with lakh and crore conversions, and a sense-check",
  "Hypothesis-driven thinking": "make the twist reverse the most obvious conclusion from the earlier stages, so the student has to change course",
  "Synthesis and recommendation": "give the senior person a conflicting preference the student has to address, so the recommendation needs a clear trade-off",
};

export const WRITER_PROMPT = `You write practice case interviews for CASECALL, an app for MBA students at ISB (Indian School of Business) preparing for placements. You write one complete, original five-stage case as JSON.

Rules you must follow:
1. The company is fictional (invent a name that is not a real brand). The setting is India; money is in rupees, written with ₹ and lakh or crore.
2. Every number is internally consistent. Any number the maths stage needs appears in the intro, an exhibit or a prompt. Before writing the maths rubric and model answer, work the calculation step by step and double-check it. Use round, interview-friendly numbers.
3. The five stages come in this exact order and each tests one skill: Structuring, Reading exhibits, Quant and maths, Hypothesis-driven thinking, Synthesis and recommendation.
4. rubric_strong names the specific facts, numbers and insight a strong answer must contain, including the correct result of any calculation. rubric_weak names the typical traps.
5. model is what a strong candidate would say out loud: plain English, under 80 words, using the case's numbers.
6. Lengths: intro under 70 words; each prompt under 60 words; each rubric under 90 words.
7. Exhibits: exhibit_head is the column headers; each row in exhibit_rows has exactly one cell per header. A stage with no exhibit uses an empty exhibit_title, an empty exhibit_head and empty exhibit_rows.
8. Nothing about real people, politics, religion, medical advice or anything unsafe. Plain, specific, professional English.`;

const SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    company: { type: "STRING" },
    sector: { type: "STRING" },
    type: { type: "STRING" },
    intro: { type: "STRING" },
    stages: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          prompt: { type: "STRING" },
          exhibit_title: { type: "STRING" },
          exhibit_head: { type: "ARRAY", items: { type: "STRING" } },
          exhibit_rows: { type: "ARRAY", items: { type: "ARRAY", items: { type: "STRING" } } },
          rubric_strong: { type: "STRING" },
          rubric_weak: { type: "STRING" },
          model: { type: "STRING" },
        },
        required: ["title", "prompt", "exhibit_title", "exhibit_head", "exhibit_rows", "rubric_strong", "rubric_weak", "model"],
      },
    },
  },
  required: ["title", "company", "sector", "type", "intro", "stages"],
};

// One library case, in the same JSON shape, as a style and quality reference.
const EXAMPLE_FOR = { "Consulting": "zipkart", "Product management": "kosh", "General management": "saffron", "Not sure yet": "zipkart" };
function exampleJson(track) {
  const c = CASES.find((x) => x.id === EXAMPLE_FOR[track]) || CASES[0];
  return JSON.stringify({
    title: c.title, company: c.company, sector: c.sector, type: c.type, intro: c.intro,
    stages: c.stages.map((s) => ({
      title: s.title, prompt: s.prompt,
      exhibit_title: s.exhibit ? s.exhibit.title : "", exhibit_head: s.exhibit ? s.exhibit.head : [], exhibit_rows: s.exhibit ? s.exhibit.rows : [],
      rubric_strong: s.rubric.strong, rubric_weak: s.rubric.weak, model: s.model,
    })),
  });
}

function clean(raw, track, focus) {
  if (!raw || !Array.isArray(raw.stages) || raw.stages.length !== 5) throw new Error("Case did not have five stages");
  const stages = raw.stages.map((s, i) => {
    const head = (Array.isArray(s.exhibit_head) ? s.exhibit_head : []).map((h) => clip(h, 60)).filter(Boolean).slice(0, 6);
    const rows = (Array.isArray(s.exhibit_rows) ? s.exhibit_rows : []).slice(0, 8)
      .map((r) => head.map((_, j) => clip(Array.isArray(r) ? r[j] : "", 80)))
      .filter((r) => r.some(Boolean));
    const exhibit = head.length >= 2 && rows.length ? { title: clip(s.exhibit_title, 100) || `Exhibit ${i + 1}`, head, rows } : null;
    const out = {
      skill: SKILLS[i],
      title: clip(s.title, 60) || SKILLS[i],
      prompt: clip(s.prompt, 500),
      rubric: { strong: clip(s.rubric_strong, 900), weak: clip(s.rubric_weak, 500) },
      model: clip(s.model, 700),
    };
    if (exhibit) out.exhibit = exhibit;
    if (!out.prompt || !out.rubric.strong || !out.model) throw new Error(`Stage ${i + 1} was incomplete`);
    return out;
  });
  if (!stages[1].exhibit) throw new Error("The exhibit stage had no exhibit");
  return {
    title: clip(raw.title, 80) || "Custom case",
    company: clip(raw.company, 50) || "Custom case",
    sector: clip(raw.sector, 60),
    type: clip(raw.type, 40) || "Custom case",
    intro: clip(raw.intro, 700),
    domains: [track],
    focus,
    minutes: 20,
    difficulty: "Custom",
    stages,
    built: { track, focus, model: MODEL, at: new Date().toISOString() },
  };
}

export async function writeCustomCase({ track, focus, mode }) {
  const avoid = CASES.map((c) => `${c.company} (${c.sector})`).join("; ");
  const focusLines = focus.map((f) => `- ${f}: ${FOCUS_RULES[f]}`).join("\n");
  const stageLines = SKILLS.map((s, i) => `${i + 1}. ${s}: ${STAGE_RULES[s]}`).join("\n");
  const msg = `Write ${ROLE_BRIEF[track] || ROLE_BRIEF["Not sure yet"]}.

The student ${mode === "baseline" ? "is just starting and wants practice on" : mode === "stretch" ? "is already strong and wants a harder test of" : "is weakest at"} these skills, so make them the centre of the case:
${focusLines}

Stages:
${stageLines}

Don't reuse these companies or sectors from the library: ${avoid}.

Here is one library case in the exact JSON shape to return, as a reference for tone, length and rubric detail. Write a different case:
${exampleJson(track)}`;

  let lastErr;
  const started = Date.now();
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt && Date.now() - started > 25000) break; // stay inside the function time limit
    try {
      const g = await gemini(WRITER_PROMPT, msg, SCHEMA, MAX_OUTPUT_TOKENS, { temperature: 0.9 });
      const c = clean(g.parsed, track, focus);
      c.built.input_tokens = g.inputTokens; c.built.output_tokens = g.outputTokens; c.built.latency_ms = g.latencyMs;
      return c;
    } catch (e) { lastErr = e; }
  }
  throw lastErr;
}
