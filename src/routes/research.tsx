import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Telescope, Info } from "lucide-react";
import { PageHeader } from "@/components/tools/PageHeader";
import { InputCard } from "@/components/tools/InputCard";
import { OutputPanel } from "@/components/tools/OutputPanel";
import { useToolRun } from "@/hooks/useToolRun";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Summarise a topic, question or pasted article into key insights and practical recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant — AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Summary, key insights and recommendations for any topic or article.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const run = useToolRun("research");

  return (
    <div>
      <PageHeader
        eyebrow="Research"
        title="AI Research Assistant"
        description="Enter a topic, a question or paste an article. You'll get a concise summary, three to five key insights and practical recommendations."
      />
      <div className="space-y-5">
        <InputCard title="What are you researching?">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic, question or article text</Label>
            <Textarea
              id="topic"
              rows={10}
              placeholder="e.g. What are the operational risks of adopting a four-day work week? — or paste an article."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <span>
              Research output is AI-generated and may be incomplete or out of date. Verify claims,
              figures and sources independently before using them in any decision or document.
            </span>
          </div>
          <Button
            disabled={!topic.trim() || run.status === "loading"}
            onClick={() => run.run({ topic })}
          >
            <Telescope />
            {run.status === "loading" ? "Researching…" : "Run research"}
          </Button>
        </InputCard>

        <OutputPanel
          status={run.status}
          output={run.output}
          onChange={run.setOutput}
          error={run.error}
          onRegenerate={run.regenerate}
          onClear={run.clear}
          canRegenerate={run.canRegenerate}
          minRows={20}
          emptyHint="Enter a topic or paste an article to get a summary, key insights and recommendations."
        />
      </div>
    </div>
  );
}
