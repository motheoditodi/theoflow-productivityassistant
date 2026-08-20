import { z } from "zod";

export const toolKeys = ["email", "notes", "planner", "research"] as const;
export type ToolKey = (typeof toolKeys)[number];

export const ToolInput = z.object({
  tool: z.enum(toolKeys),
  variables: z.record(z.string()),
});

export type ToolInput = z.infer<typeof ToolInput>;
