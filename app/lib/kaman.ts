// Server-side only: how this app reaches Kaman, and what it is wired to.
//
// THE RULE: the app acts as its SIGNED-IN USER. Every call a person's
// click causes goes out with their token (`auth.session(req)`), so Kaman
// applies their permissions and their organisation. The app's API key
// (`KAMAN_API_KEY`) is used for exactly one thing here: signing a new
// person up (`auth.signup`). Scheduled or back-end jobs would be the other.
//
// kaman.app.json names the agent, workflow, scenarios and lake this app
// uses. When the Smart Site Planning template is installed, Kaman rewrites
// it to point at YOUR copies, so nothing here hard-codes an id.
import { createKamanAuth } from "@yoctotta/kaman-sdk/app-auth";
import manifest from "../../kaman.app.json";

export const wiring = {
  planner: manifest.agents.planner,
  signoff: manifest.workflows.signoff,
  /** What the plan must serve, and the land, parcel by parcel. */
  brief: manifest.scenarios.brief,
  /** The land today, on a map. */
  land: manifest.scenarios.land,
  lake: manifest.lake,
  schema: manifest.schema,
  targetYear: Number(manifest.targetYear) || 2040,
};

/**
 * Sign-in for this app. Reads KAMAN_APP_CLIENT_ID, KAMAN_BASE_URL and
 * KAMAN_PREVIEW_BASE (a Kaman preview injects all three), and KAMAN_API_KEY
 * for signup.
 */
export const auth = createKamanAuth();

/** A failure as JSON, with the reason — never a bare 500. */
export function failure(e: unknown, status = 502) {
  const message = e instanceof Error ? e.message : String(e);
  return Response.json({ error: message }, { status });
}
