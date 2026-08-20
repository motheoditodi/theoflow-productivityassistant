import type { ToolKey } from "./ai.schema";

/** Placeholder output used only when no AI key is configured. */
export function mockResponse(tool: ToolKey, vars: Record<string, string>) {
  switch (tool) {
    case "email":
      return `Subject: ${vars["purpose"] || "Following up"}\n\nHi ${vars["recipient"] || "[NAME]"},\n\nThis is a placeholder ${(vars["tone"] || "Formal").toLowerCase()} email generated without an AI connection.\n\n${vars["keyPoints"] || "- Key point one\n- Key point two"}\n\nBest regards,\n[YOUR NAME]`;
    case "notes":
      return `## Summary\nPlaceholder summary of the pasted meeting notes.\n\n## Action Items\n- [ ] Placeholder task - Owner: Unassigned - Due: TBC\n\n## Key Decisions & Deadlines\n- Placeholder decision`;
    case "planner":
      return `| Slot | Time | Task | Priority | Notes |\n| --- | --- | --- | --- | --- |\n| Morning | 09:00-10:30 | Placeholder task | High | Deep work |\n\n## Notes\n- Placeholder schedule rationale`;
    case "research":
      return `## Summary\nPlaceholder research summary.\n\n## Key Insights\n- **Insight:** placeholder\n\n## Recommendations\n- Placeholder recommendation`;
  }
}
