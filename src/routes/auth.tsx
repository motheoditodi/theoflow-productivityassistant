import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Monogram } from "@/components/layout/AppShell";
import { useAccounts, initials } from "@/hooks/useAccounts";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — TheoFlow" },
      {
        name: "description",
        content: "Sign in to TheoFlow to generate emails, meeting summaries, plans and research.",
      },
      { property: "og:title", content: "Sign in — TheoFlow" },
      { property: "og:description", content: "Access your TheoFlow AI productivity workspace." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    deleted: search.deleted === true || search.deleted === "true" ? true : undefined,
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { accounts, addAccount, switchAccount, hydrated } = useAccounts();
  const { deleted } = useSearch({ from: "/auth" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const signIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    addAccount({ name: name.trim(), email: email.trim(), role: "Member" });
    toast.success(`Signed in as ${email.trim()}`);
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <Monogram className="size-11 text-base" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to TheoFlow</h1>
        <p className="text-sm text-muted-foreground">
          {deleted
            ? "Your account has been deleted. Sign in with another account to continue."
            : "Sign in to your productivity assistant workspace."}
        </p>
      </div>

      {hydrated && accounts.length > 0 && (
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Continue as
          </p>
          <div className="flex flex-col gap-2">
            {accounts.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  switchAccount(a.id);
                  toast.success(`Signed in as ${a.email}`);
                  navigate({ to: "/" });
                }}
                className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-left transition-colors hover:bg-accent"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground">
                  {initials(a.name)}
                </span>
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate text-sm font-medium">{a.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{a.email}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={signIn} className="space-y-4 rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Use another account
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="auth-name">Full name</Label>
          <Input
            id="auth-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Molefe"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="auth-email">Email</Label>
          <Input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
          />
        </div>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </div>
  );
}
