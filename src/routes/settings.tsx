import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/tools/PageHeader";
import { InputCard } from "@/components/tools/InputCard";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — TheoFlow" },
      {
        name: "description",
        content: "Workspace preferences and responsible AI guidance for your assistant.",
      },
      { property: "og:title", content: "Settings — TheoFlow" },
      { property: "og:description", content: "Manage workspace preferences and AI safeguards." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [prefs, setPrefs] = useState({ compact: false, autoCopy: false, preview: true });
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Preferences for how the assistant behaves across tools."
      />
      <div className="space-y-4">
        <InputCard title="Appearance">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="text-sm">Dark mode</Label>
              <p className="text-xs text-muted-foreground">
                Switch TheoFlow between light and dark themes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="size-4 text-muted-foreground" />
              <Switch
                aria-label="Toggle dark mode"
                checked={theme === "dark"}
                onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
              />
              <Moon className="size-4 text-muted-foreground" />
            </div>
          </div>
        </InputCard>

        <InputCard title="Output preferences">

          {[
            { key: "compact", label: "Compact drafts", hint: "Prefer shorter, tighter output." },
            {
              key: "autoCopy",
              label: "Copy on generate",
              hint: "Place new output on the clipboard automatically.",
            },
            {
              key: "preview",
              label: "Show formatted preview",
              hint: "Enable the preview tab alongside the editor.",
            },
          ].map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-4">
              <div>
                <Label className="text-sm">{row.label}</Label>
                <p className="text-xs text-muted-foreground">{row.hint}</p>
              </div>
              <Switch
                checked={prefs[row.key as keyof typeof prefs]}
                onCheckedChange={(v) => setPrefs((p) => ({ ...p, [row.key]: v }))}
              />
            </div>
          ))}
        </InputCard>

        <InputCard
          title="Responsible AI"
          description="These safeguards apply to every tool in the workspace."
        >
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>All outputs are AI-generated and may contain inaccuracies.</li>
            <li>Every draft is editable — review before sending, sharing or acting on it.</li>
            <li>Never enter confidential, personal or regulated data.</li>
            <li>Verify research output independently before relying on it.</li>
          </ul>
        </InputCard>
      </div>
    </div>
  );
}
