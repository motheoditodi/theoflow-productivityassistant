import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { PageHeader } from "@/components/tools/PageHeader";
import { InputCard } from "@/components/tools/InputCard";
import { OutputPanel } from "@/components/tools/OutputPanel";
import { useToolRun } from "@/hooks/useToolRun";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into a summary, an owner-tagged action checklist and key decisions.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Summary, action items and decisions extracted from messy notes.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState("");
  const run = useToolRun("notes");

  return (
    <div>
      <PageHeader
        eyebrow="Meetings"
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript. You'll get a summary, an action-item checklist with owners and due dates, and the decisions and deadlines agreed."
      />
      <div className="space-y-5">
        <InputCard title="Raw meeting notes">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes or transcript</Label>
            <Textarea
              id="notes"
              rows={12}
              placeholder="Paste your notes here — bullet fragments, transcript lines, anything."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {notes.trim() ? `${notes.trim().split(/\s+/).length} words` : "No notes yet"} · never
              paste confidential material.
            </p>
          </div>
          <Button
            disabled={!notes.trim() || run.status === "loading"}
            onClick={() => run.run({ notes })}
          >
            <ListChecks />
            {run.status === "loading" ? "Summarising…" : "Summarise notes"}
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
          emptyHint="Paste your notes above to get a summary, action items and key decisions."
        />
      </div>
    </div>
  );
}
