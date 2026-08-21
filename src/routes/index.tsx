import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, NotebookPen, CalendarClock, Telescope, MessagesSquare } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — TheoFlow" },
      {
        name: "description",
        content:
          "Your AI workspace home: generate emails, summarise meetings, plan tasks, research topics and chat with an assistant.",
      },
      { property: "og:title", content: "Dashboard — TheoFlow" },
      {
        property: "og:description",
        content: "Five AI tools that automate everyday professional work in one clean workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    label: "Smart Email Generator",
    icon: Mail,
    blurb: "Draft on-tone emails from a purpose and a handful of key points.",
  },
  {
    to: "/meeting-notes",
    label: "Meeting Notes Summarizer",
    icon: NotebookPen,
    blurb: "Turn raw notes into a summary, action checklist and decisions.",
  },
  {
    to: "/task-planner",
    label: "AI Task Planner",
    icon: CalendarClock,
    blurb: "Time-block your tasks into a prioritised daily or weekly schedule.",
  },
  {
    to: "/research",
    label: "AI Research Assistant",
    icon: Telescope,
    blurb: "Summarise a topic or article into insights and recommendations.",
  },
  {
    to: "/chatbot",
    label: "AI Chatbot",
    icon: MessagesSquare,
    blurb: "Ask anything workplace-related in a running conversation.",
  },
] as const;

function Dashboard() {
  return (
    <div>
      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Welcome back</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Welcome to TheoFlow
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A single workspace for the writing, planning and research work that fills your day. Each
          tool follows the same flow — give it context, generate a draft, then edit the output until
          it sounds like you.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:brightness-110"
          >
            Draft an email <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/chatbot"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Open chatbot
          </Link>
        </div>
      </section>

      <h2 className="mt-10 mb-4 text-sm font-semibold text-foreground">Tools</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map(({ to, label, icon: Icon, blurb }) => (
          <div
            key={to}
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform duration-200 group-hover:scale-105">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 text-sm font-semibold text-foreground">{label}</h3>
            <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground">{blurb}</p>
            <Link
              to={to}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-soft transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Open
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}
