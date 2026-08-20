import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  CalendarClock,
  Telescope,
  MessagesSquare,
  Settings,
  Menu,
  ShieldAlert,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meeting-notes", label: "Meeting Notes", icon: NotebookPen },
  { to: "/task-planner", label: "Task Planner", icon: CalendarClock },
  { to: "/research", label: "Research Assistant", icon: Telescope },
  { to: "/chatbot", label: "Chatbot", icon: MessagesSquare },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-2 py-1">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
        AW
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight">AI Workplace</span>
        <span className="text-[11px] text-muted-foreground">Productivity Assistant</span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function ResponsibleAiFooter() {
  return (
    <footer className="mt-10 border-t border-border pt-5 pb-24 md:pb-6">
      <div className="flex gap-3 rounded-xl border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          <span className="font-semibold text-foreground">Responsible AI notice — </span>
          Content in this workspace is AI-generated and may contain inaccuracies or omissions.
          Always review and edit outputs before sending, sharing or acting on them. Do not enter
          confidential, personal or regulated data.
        </p>
      </div>
    </footer>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-3 py-4 md:flex">
        <Brand />
        <div className="mt-6 flex-1">
          <NavLinks />
        </div>
        <p className="px-3 text-[11px] text-muted-foreground">Review AI output before use.</p>
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/85 px-4 py-2.5 backdrop-blur md:hidden">
        <Brand />
        <button
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Menu className="size-5" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-sidebar px-3 py-4 shadow-lift animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-accent"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-6">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <main className="md:pl-64">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-10">
          {children}
          <ResponsibleAiFooter />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = NAV_ITEMS.filter((i) => i.to !== "/settings");
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      {items.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="size-5" />
            <span className="truncate px-0.5">{label.split(" ")[0]}</span>
          </Link>
        );
      })}
    </div>
  );
}
