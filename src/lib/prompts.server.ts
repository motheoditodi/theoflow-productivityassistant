import type { ToolKey } from "./ai.schema";

type Vars = Record<string, string>;

const BASE_GUARDRAIL =
  "You are part of a workplace productivity suite. Never invent confidential facts. " +
  "If information is missing, use clearly marked placeholders like [DATE] or [NAME]. " +
  "Return clean Markdown only, with no preamble or meta commentary.";

const v = (vars: Vars, key: string, fallback = "Not specified") =>
  (vars[key] ?? "").trim() || fallback;

export function buildPrompt(tool: ToolKey, vars: Vars): { system: string; prompt: string } {
  switch (tool) {
    case "email":
      return {
        system: `${BASE_GUARDRAIL}\nRole: expert business email writer. Produce ONE email only: a subject line ("Subject: ...") followed by the body. Match the requested TONE precisely: Formal = polished and impersonal; Friendly = warm, contracted, human; Persuasive = benefit-led with a clear call to action. Cover every KEY POINT exactly once. Keep under 220 words unless the points demand more.`,
        prompt: [
          `RECIPIENT / CONTEXT: ${v(vars, "recipient")}`,
          `PURPOSE: ${v(vars, "purpose")}`,
          `TONE: ${v(vars, "tone", "Formal")}`,
          `KEY POINTS:\n${v(vars, "keyPoints", "- (none supplied)")}`,
        ].join("\n\n"),
      };
    case "notes":
      return {
        system: `${BASE_GUARDRAIL}\nRole: meeting analyst. Output EXACTLY these three Markdown H2 sections in order and nothing else:\n"## Summary" - 3-5 tight sentences.\n"## Action Items" - a Markdown checklist, one line per item: "- [ ] <task> - Owner: <name or Unassigned> - Due: <date or TBC>".\n"## Key Decisions & Deadlines" - bullets of decisions made and hard dates. Only use facts present in the notes.`,
        prompt: `RAW MEETING NOTES:\n"""\n${v(vars, "notes")}\n"""`,
      };
    case "planner":
      return {
        system: `${BASE_GUARDRAIL}\nRole: scheduling strategist. Output ONLY a Markdown table with the columns | Slot | Time | Task | Priority | Notes |. Priority must be exactly High, Medium or Low. For DAILY view, Slot is the day part and Time is a clock range inside the available window. For WEEKLY view, Slot is the weekday (Mon-Fri) and Time is the block within that day. Time-block realistically, front-load High priority work, include short breaks, and never exceed the available hours. After the table add a single "## Notes" section with 2-3 bullets of scheduling rationale.`,
        prompt: [
          `VIEW: ${v(vars, "view", "Daily")}`,
          `AVAILABLE HOURS / TIME WINDOW: ${v(vars, "hours")}`,
          `PRIORITY HINTS: ${v(vars, "priorities", "None")}`,
          `TASKS (one per line):\n${v(vars, "tasks")}`,
        ].join("\n\n"),
      };
    case "research":
      return {
        system: `${BASE_GUARDRAIL}\nRole: research analyst. Output EXACTLY these three Markdown H2 sections in order: "## Summary" (one concise paragraph), "## Key Insights" (3-5 bullets, each starting with a bolded label), "## Recommendations" (3-5 practical, actionable bullets). Flag uncertainty explicitly rather than guessing.`,
        prompt: `TOPIC / QUESTION / SOURCE TEXT:\n"""\n${v(vars, "topic")}\n"""`,
      };
  }
}

export const CHAT_SYSTEM_PROMPT = `${BASE_GUARDRAIL}
Role: an AI workplace assistant for busy professionals. Be concise, practical and structured: short paragraphs, bullets and headings where useful. Ask a clarifying question when the request is ambiguous. Decline to handle confidential or personal data and remind the user not to paste it.`;
