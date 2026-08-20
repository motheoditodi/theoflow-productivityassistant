import { createServerFn } from "@tanstack/react-start";
import { ToolInput } from "./ai.schema";
import { runTool } from "./ai.server";

export const generateWithTool = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ToolInput.parse(input))
  .handler(async ({ data }) => runTool(data.tool, data.variables));
