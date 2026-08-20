import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, RefreshCw, Trash2, AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { RunStatus } from "@/hooks/useToolRun";

type Props = {
  status: RunStatus;
  output: string;
  onChange: (value: string) => void;
  error: string | null;
  onRegenerate: () => void;
  onClear: () => void;
  canRegenerate: boolean;
  emptyHint: string;
  minRows?: number;
};

export function OutputPanel({
  status,
  output,
  onChange,
  error,
  onRegenerate,
  onClear,
  canRegenerate,
  emptyHint,
  minRows = 16,
}: Props) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Output</h2>
          <p className="text-xs text-muted-foreground">
            Fully editable — refine before you copy or share.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {output && (
            <div className="mr-1 flex rounded-lg border border-border p-0.5">
              {(["edit", "preview"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                    tab === t
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          <Button variant="outline" size="sm" onClick={copy} disabled={!output}>
            {copied ? <Check /> : <Copy />}
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={!canRegenerate || status === "loading"}
          >
            <RefreshCw className={cn(status === "loading" && "animate-spin")} />
            Regenerate
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear} disabled={!output && !error}>
            <Trash2 />
            Clear
          </Button>
        </div>
      </div>

      {status === "loading" && (
        <div className="space-y-3">
          {[92, 100, 76, 88, 64, 96, 70].map((w, i) => (
            <Skeleton key={i} className="h-4" style={{ width: `${w}%` }} />
          ))}
          <p className="pt-2 text-xs text-muted-foreground">Generating your draft…</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div>
            <p className="font-medium text-foreground">Generation failed</p>
            <p className="mt-1 text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      {status === "idle" && !output && (
        <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-center">
          <p className="text-sm font-medium text-foreground">Nothing generated yet</p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">{emptyHint}</p>
        </div>
      )}

      {status === "ready" &&
        (tab === "edit" ? (
          <Textarea
            value={output}
            onChange={(e) => onChange(e.target.value)}
            rows={minRows}
            className="resize-y font-mono text-[13px] leading-relaxed"
          />
        ) : (
          <div className="prose prose-sm max-w-none rounded-xl border border-border bg-background p-4 text-sm text-foreground [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_li]:my-1 [&_p]:my-2 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:p-2 [&_th]:text-left [&_ul]:list-disc [&_ul]:pl-5">
            <ReactMarkdown>{output}</ReactMarkdown>
          </div>
        ))}
    </section>
  );
}
