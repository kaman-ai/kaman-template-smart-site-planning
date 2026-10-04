"use client";
// Kaman's chat component, talking to the planner through this app's
// /api/chat — which asks the agent as the signed-in user and streams the
// answer back as it is written.
import * as React from "react";
import { ChatThread, useConversation } from "@kamanai/ui-chatbot";
import { appChatTransport } from "../lib/chatTransport";

const STARTERS = [
  "Which parcels are still to be acquired, and what do they cost?",
  "Where is the 100-year flood zone, and how much land does it take out?",
  "Plan the site: housing, water tanks, the STP and hospitals.",
];

export function PlannerChat() {
  const transport = React.useMemo(() => appChatTransport(), []);
  const { messages, busy, send, stop } = useConversation({ transport });
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <ChatThread
        messages={messages}
        onSend={send}
        busy={busy}
        onStop={stop}
        pattern="wide"
        placeholder="Ask the planner about the site…"
        emptyState={
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <h2 className="text-lg font-semibold">The site's planning analyst</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              It reads the site's data — terrain, soil, flood zones, water, demand and the planning norms — and computes
              every answer from it.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-border px-3 py-1.5 text-sm hover:bg-muted"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        }
      />
    </div>
  );
}
