import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Wand2 } from "lucide-react";
import { PageHeader } from "@/components/tools/PageHeader";
import { InputCard } from "@/components/tools/InputCard";
import { OutputPanel } from "@/components/tools/OutputPanel";
import { useToolRun } from "@/hooks/useToolRun";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate professional emails from a recipient, purpose, key points and a chosen tone.",
      },
      { property: "og:title", content: "Smart Email Generator — AI Workplace Assistant" },
      { property: "og:description", content: "On-tone email drafts in seconds, fully editable." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState("Formal");
  const run = useToolRun("email");

  const disabled = !purpose.trim() || run.status === "loading";

  return (
    <div>
      <PageHeader
        eyebrow="Writing"
        title="Smart Email Generator"
        description="Describe who you're writing to and what needs saying. Tone, purpose and key points are passed to the model as separate variables so drafts stay consistent."
      />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <InputCard title="Email brief">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient / context</Label>
            <Input
              id="recipient"
              placeholder="e.g. Priya, procurement lead at a new supplier"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of the email</Label>
            <Input
              id="purpose"
              placeholder="e.g. Request updated pricing before Friday"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="points">Key points (one per line)</Label>
            <Textarea
              id="points"
              rows={6}
              placeholder={"- Current contract ends 30 June\n- Need volume pricing for 500 units\n- Ask for a call next week"}
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Formal", "Friendly", "Persuasive"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full"
            disabled={disabled}
            onClick={() => run.run({ recipient, purpose, keyPoints, tone })}
          >
            <Wand2 />
            {run.status === "loading" ? "Generating…" : "Generate email"}
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
          emptyHint="Add a purpose and a few key points, then generate a draft you can edit here."
        />
      </div>
    </div>
  );
}
