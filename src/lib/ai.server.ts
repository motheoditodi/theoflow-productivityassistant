import { streamText } from "ai";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "./ai-gateway.server";
import { buildPrompt } from "./prompts.server";
import type { ToolKey } from "./ai.schema";
import { mockResponse } from "./ai.mock";

export async function runTool(tool: ToolKey, variables: Record<string, string>) {
  const key = process.env["LOVABLE_API_KEY"];
  // No AI key configured yet: fall back to a structured mock so the UI stays usable.
  if (!key) return { text: mockResponse(tool, variables), mocked: true };

  const { system, prompt } = buildPrompt(tool, variables);
  const gateway = createLovableAiGatewayProvider(key);

  try {
    const result = streamText({ model: gateway(DEFAULT_MODEL), system, prompt });
    const text = await result.text;
    return { text, mocked: false };
  } catch (error) {
    const status = (error as { statusCode?: number; status?: number })?.statusCode ??
      (error as { status?: number })?.status;
    if (status === 429) throw new Error("Rate limit reached. Please wait a moment and try again.");
    if (status === 402)
      throw new Error("AI credits are exhausted. Add credits in Lovable to keep generating.");
    if (status === 403) throw new Error("AI access is blocked for this workspace.");
    throw new Error(
      (error as Error)?.message || "The AI service could not complete this request.",
    );
  }
}
