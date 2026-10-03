// Run the template's "Plan, check and sign off" workflow.
import { failure, kaman, wiring } from "../../lib/kaman";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST() {
  try {
    const run = await kaman().runWorkflow(wiring.signoff, { target_year: wiring.targetYear, lake: wiring.lake });
    return Response.json(run);
  } catch (e) {
    return failure(e);
  }
}
