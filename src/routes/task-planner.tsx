import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/tools/PageHeader";
import { InputCard } from "@/components/tools/InputCard";
import { OutputPanel } from "@/components/tools/OutputPanel";
import { useToolRun } from "@/hooks/useToolRun";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn a task list and available hours into a prioritised, time-blocked daily or weekly schedule.",
      },
      { property: "og:title", content: "AI Task Planner — AI Workplace Assistant" },
      { property: "og:description", content: "Prioritised, time-blocked plans for your week." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("");
  const [priorities, setPriorities] = useState("");
  const [view, setView] = useState<"Daily" | "Weekly">("Daily");
  const run = useToolRun("planner");

  return (
    <div>
      <PageHeader
        eyebrow="Planning"
        title="AI Task Planner & Scheduler"
        description="List what needs doing and how much time you have. The planner ranks tasks High, Medium or Low and time-blocks them into a schedule you can edit."
      />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <InputCard title="Plan inputs">
          <div className="space-y-2">
            <Label>View</Label>
            <div className="flex rounded-lg border border-border p-1">
              {(["Daily", "Weekly"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    view === v
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tasks">Tasks (one per line)</Label>
            <Textarea
              id="tasks"
              rows={8}
              placeholder={"Finish Q3 board deck\nReview supplier contract\n1:1 with Sam\nInbox triage"}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hours">Available hours / time window</Label>
            <Input
              id="hours"
              placeholder="e.g. 09:00–17:00, 6 focused hours per day"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priorities">Priority hints (optional)</Label>
            <Input
              id="priorities"
              placeholder="e.g. board deck is due tomorrow"
              value={priorities}
              onChange={(e) => setPriorities(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            disabled={!tasks.trim() || run.status === "loading"}
            onClick={() => run.run({ tasks, hours, priorities, view })}
          >
            <CalendarClock />
            {run.status === "loading" ? "Building schedule…" : `Generate ${view.toLowerCase()} plan`}
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
          minRows={18}
          emptyHint="Add your tasks and available hours to generate a time-blocked schedule. Switch to Preview to see it as a table."
        />
      </div>
    </div>
  );
}
