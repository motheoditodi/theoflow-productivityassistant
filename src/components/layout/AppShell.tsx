import { useEffect, useState } from "react";
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
  PanelLeftClose,
  PanelLeftOpen,
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

export function Monogram({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-2 text-[13px] font-bold tracking-tight text-primary-foreground shadow-soft",
        className,
      )}
    >
      TF
    </span>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-2 py-1" aria-label="TheoFlow home">
      <Monogram />
      {!compact && (
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">TheoFlow</span>
          <span className="text-[11px] text-muted-foreground">Productivity Assistant</span>
        </span>
      )}
    </Link>
  );
}

function NavLinks({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
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
            title={collapsed ? label : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              collapsed && "justify-center px-0",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            {!collapsed && label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AccountCard({ collapsed = false }: { collapsed?: boolean }) {
  if (collapsed) {
    return (
      <div className="mb-2 flex justify-center" title="Motheo Ditodi">
        <span className="flex size-8 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground">
          MD
        </span>
      </div>
    );
  }
  return (
    <Link
      to="/settings"
      className="mb-2 flex items-center gap-3 rounded-xl border border-sidebar-border bg-card/60 px-3 py-2 transition-colors hover:bg-sidebar-accent/60"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground">
        MD
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-xs font-semibold text-foreground">Motheo Ditodi</span>
        <span className="truncate text-[11px] text-muted-foreground">motheo@theoflow.app</span>
      </span>
    </Link>
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
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem("theoflow-sidebar") === "collapsed");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      window.localStorage.setItem("theoflow-sidebar", c ? "expanded" : "collapsed");
      return !c;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-sidebar-border bg-sidebar px-3 py-4 transition-[width] duration-200 md:flex",
          collapsed ? "w-[4.5rem]" : "w-64",
        )}
      >
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
          <Brand compact={collapsed} />
          {!collapsed && (
            <button
              aria-label="Hide sidebar"
              onClick={toggleCollapsed}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <PanelLeftClose className="size-4" />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            aria-label="Show sidebar"
            onClick={toggleCollapsed}
            className="mx-auto mt-3 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <PanelLeftOpen className="size-4" />
          </button>
        )}
        <div className="mt-6 flex-1">
          <NavLinks collapsed={collapsed} />
        </div>
        <AccountCard collapsed={collapsed} />
        {!collapsed && (
          <p className="px-3 text-[11px] text-muted-foreground">Review AI output before use.</p>
        )}
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
            <div className="mt-6 flex-1">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
            <AccountCard />
          </div>
        </div>
      )}

      <main className={cn("transition-[padding] duration-200", collapsed ? "md:pl-[4.5rem]" : "md:pl-64")}>
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
