import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { Send, Trash2, AlertCircle, Bot } from "lucide-react";
import { PageHeader } from "@/components/tools/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — TheoFlow" },
      {
        name: "description",
        content: "A conversational AI assistant for everyday workplace questions and drafting.",
      },
      { property: "og:title", content: "AI Chatbot — TheoFlow" },
      { property: "og:description", content: "Chat with your AI workplace assistant." },
    ],
  }),
  component: ChatbotPage,
});

const SUGGESTIONS = [
  "Rewrite this update so it's clearer for execs",
  "Help me prepare an agenda for a project kickoff",
  "What questions should I ask in a vendor review?",
];

function ChatbotPage() {
  const [sessionId, setSessionId] = useState(() => `chat-${Date.now()}`);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, setMessages } = useChat({
    id: sessionId,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = (text: string) => {
    if (!text.trim() || isLoading) return;
    void sendMessage({ text: text.trim() });
    setInput("");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Assistant"
        title="AI Chatbot"
        description="A general workplace assistant that keeps context for this session. Clear the chat at any time to start fresh."
      />

      <div className="flex h-[62vh] min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Bot className="size-4" />
            </span>
            Session assistant
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={messages.length === 0}
            onClick={() => {
              setMessages([]);
              setSessionId(`chat-${Date.now()}`);
            }}
          >
            <Trash2 />
            Clear chat
          </Button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
          {messages.length === 0 && (
            <div className="mx-auto max-w-md py-10 text-center">
              <p className="text-sm font-medium text-foreground">Start a conversation</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Ask for drafts, checklists, explanations or next steps.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-xl border border-border bg-background px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const text = m.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("")
              .trim();
            if (!text) return null;
            return (
              <div
                key={m.id}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] text-sm leading-relaxed",
                    m.role === "user"
                      ? "rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground"
                      : "text-foreground [&_li]:my-1 [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
                  )}
                >
                  {m.role === "user" ? text : <ReactMarkdown>{text}</ReactMarkdown>}
                </div>
              </div>
            );
          })}

          {status === "submitted" && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
              <span className="ml-1 text-xs">Thinking…</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <span className="text-muted-foreground">
                {error.message || "The assistant could not respond. Try again shortly."}
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-border p-3">
          <div className="flex items-end gap-2">
            <Textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              placeholder="Ask your workplace assistant…"
              className="max-h-40 min-h-10 resize-none"
            />
            <Button size="icon" disabled={!input.trim() || isLoading} onClick={() => submit(input)}>
              <Send />
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            AI-generated responses — verify before use. Don't share confidential data.
          </p>
        </div>
      </div>
    </div>
  );
}
