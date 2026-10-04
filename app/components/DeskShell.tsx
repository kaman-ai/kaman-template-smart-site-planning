"use client";
// The desk around every screen: where you are, the one decision the desk
// exists for (plan the site and send it for sign-off), and signing out.
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { scenarios } from "../lib/scenarios";
import { apiPath } from "../lib/apiPath";
import { Toasts, useNotify } from "./Toasts";

const NAV = [
  { href: "/", label: "The brief" },
  { href: "/land", label: "The land" },
  { href: "/planner", label: "Ask the planner" },
];

export function DeskShell({ brief, targetYear, children }: { brief: string; targetYear: number; children: React.ReactNode }) {
  return (
    <Toasts>
      <div className="min-h-screen bg-background">
        <Header brief={brief} targetYear={targetYear} />
        <main className="mx-auto w-full max-w-7xl px-6 py-6">{children}</main>
      </div>
    </Toasts>
  );
}

function Header({ brief, targetYear }: { brief: string; targetYear: number }) {
  const path = usePathname();
  const notify = useNotify();
  const [starting, setStarting] = React.useState(false);

  // The sign-off is an action the brief scenario declares; Kaman starts the
  // workflow as the signed-in user and answers with the run at once — the
  // run itself (planning, the check, the chief planner) takes as long as it
  // takes, and is followed in Kaman's Runs.
  const startSignoff = async () => {
    setStarting(true);
    try {
      await scenarios.invokeAction(brief, "start_signoff", {});
      notify("The planner is planning the site; the chief planner will be asked to sign off.");
    } catch (e) {
      notify(`The sign-off could not start: ${e instanceof Error ? e.message : String(e)}`, "error");
    } finally {
      setStarting(false);
    }
  };

  return (
    <header className="border-b border-border bg-background/95">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-6 px-6 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold">Nava Nagar</span>
          <span className="text-sm text-muted-foreground">planning desk · {targetYear}</span>
        </div>
        <nav className="flex gap-1 text-sm" aria-label="Desk">
          {NAV.map((n) => {
            const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-1.5 ${active ? "bg-muted font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => void startSignoff()}
            disabled={starting}
            data-testid="start-signoff"
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {starting ? "Starting…" : "Plan and send for sign-off"}
          </button>
          <form method="post" action={apiPath("/api/auth/signout")}>
            <button type="submit" className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted" data-testid="sign-out">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
