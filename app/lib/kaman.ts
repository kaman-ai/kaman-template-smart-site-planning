// Server-side only: the Kaman client and what this app is wired to.
//
// kaman.app.json names the agent, workflow and lake this app uses. When the
// Smart Site Planning template is installed, Kaman rewrites it to point at
// YOUR copies — your planner agent, your sign-off workflow, your lake — so
// nothing here hard-codes an id.
import { kamanApp } from "@yoctotta/kaman-sdk/app";
import manifest from "../../kaman.app.json";

export const wiring = {
  planner: manifest.agents.planner,
  signoff: manifest.workflows.signoff,
  lake: manifest.lake,
  schema: manifest.schema,
  targetYear: Number(manifest.targetYear) || 2040,
};

/** Reads KAMAN_BASE_URL + KAMAN_API_KEY, which a Kaman preview injects. */
export function kaman() {
  return kamanApp();
}

/** A failure as JSON, with the reason — never a bare 500. */
export function failure(e: unknown, status = 502) {
  const message = e instanceof Error ? e.message : String(e);
  return Response.json({ error: message }, { status });
}
