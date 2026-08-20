import { useCallback, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateWithTool } from "@/lib/ai.functions";
import type { ToolKey } from "@/lib/ai.schema";

export type RunStatus = "idle" | "loading" | "ready" | "error";

export function useToolRun(tool: ToolKey) {
  const generate = useServerFn(generateWithTool);
  const [status, setStatus] = useState<RunStatus>("idle");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lastVars, setLastVars] = useState<Record<string, string> | null>(null);

  const run = useCallback(
    async (variables: Record<string, string>) => {
      setStatus("loading");
      setError(null);
      setLastVars(variables);
      try {
        const result = await generate({ data: { tool, variables } });
        setOutput(result.text);
        setStatus("ready");
      } catch (e) {
        setError((e as Error)?.message || "Something went wrong while generating.");
        setStatus("error");
      }
    },
    [generate, tool],
  );

  const regenerate = useCallback(() => {
    if (lastVars) void run(lastVars);
  }, [lastVars, run]);

  const clear = useCallback(() => {
    setOutput("");
    setError(null);
    setStatus("idle");
  }, []);

  return { status, output, setOutput, error, run, regenerate, clear, canRegenerate: !!lastVars };
}
