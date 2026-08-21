# AI Productivity Hub

Build a modern, responsive web application called AI Workplace Productivity Assistant — a SaaS-style dashboard that helps professionals automate everyday workplace tasks using AI.

Overall structure:

- Dashboard layout with a persistent left sidebar for navigation and a main content area on the right.

- Sidebar items: Dashboard (home), Email Generator, Meeting Notes Summarizer, Task Planner, Research Assistant, Chatbot, Settings.

- Dashboard home should show a welcome message, a short product description, quick-access cards linking to each of the five tools, and a Responsible AI disclaimer footer visible across all pages.

- Fully responsive: sidebar collapses into a bottom nav or hamburger menu on mobile, content reflows to single-column on small screens.

- Clean, modern, professional visual style similar to a SaaS platform (e.g. Linear, Notion, or Vercel): generous white space, soft shadows, rounded corners, a restrained colour palette (one primary accent colour, neutral greys), clear typography hierarchy, and subtle micro-interactions (hover states, loading skeletons, smooth transitions).

Build all five of the following tools as separate pages/routes:

1. Smart Email Generator

Input fields: recipient/context, purpose of email, key points (bullet input), and a tone selector (Formal, Friendly, Persuasive).

Output section shows the generated email in an editable text area with "Copy," "Regenerate," and "Clear" actions.

Structure the underlying AI prompt to explicitly pass tone, purpose, and key points as separate variables so outputs stay consistent and on-tone.

2. Meeting Notes Summarizer

Large input textarea (or paste area) for raw meeting notes.

Output shows three clearly separated sections: Summary, Action Items (with owner + due date if mentioned), and Key Decisions & Deadlines.

Output should be editable and copyable, and structured as a checklist for action items where possible.

3. AI Task Planner / Scheduler

Input: list of tasks (free text or one-per-line), available hours/time window, and priority hints (optional).

Output: a generated daily or weekly schedule, presented as a visual timeline or table, with tasks ranked by priority (High/Medium/Low) and time-blocked.

Include a toggle between "Daily" and "Weekly" view.

4. AI Research Assistant

Input: a topic, question, or pasted article text.

Output: a concise summary, 3–5 key insights, and practical recommendations, each in its own labelled sub-section.

Include a disclaimer that outputs are AI-generated and should be independently verified for accuracy.

5. AI Chatbot Interface

A conversational chat UI (message bubbles, input box, send button, typing/loading indicator) acting as a general AI workplace assistant.

Should maintain conversation history within the session and allow the user to clear the chat.

Cross-cutting requirements:

Every tool follows the same input → generate → editable output pattern, with a visible loading state while the AI response is generating.

All AI-generated outputs must be editable by the user before copying/exporting, never locked or read-only.

Include a persistent, clearly visible "Responsible AI" disclaimer (footer or modal) stating that: content is AI-generated, may contain inaccuracies, should be reviewed before use, and no confidential/personal data should be entered.

Use structured, well-engineered prompts internally for each AI call (system instructions + clearly labelled variables), not a single generic prompt reused across tools.

Include empty states, error states, and loading states for every tool.

Use placeholder/mock AI responses if no AI API is connected yet, but structure the code so a real AI call can be swapped in easily.

Design should feel like a professional, trustworthy productivity tool a company would actually adopt — not a demo or prototype.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d49419dc-be0a-44d1-9a37-558f5e4cd177).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
