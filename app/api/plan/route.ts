// Ask the planner agent to plan the land. It computes every placement in
// the lake, writes master_plan, and answers in the shape below.
import { failure, kaman, wiring } from "../../lib/kaman";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST() {
  try {
    const answer = await kaman().askAgentStructured<{
      summary: string;
      placements: number;
      unmetNorms: string[];
    }>(
      wiring.planner,
      {
        type: "object",
        properties: {
          summary: { type: "string", description: "What the plan places where, and why, in a few sentences." },
          placements: { type: "number", description: "Rows written to master_plan." },
          unmetNorms: { type: "array", items: { type: "string" }, description: "Planning norms the plan does not meet." },
        },
        required: ["summary", "placements", "unmetNorms"],
      },
      `Plan the land for ${wiring.targetYear} in the lake ${wiring.lake}, following the site-master-planning skill. Write the plan into master_plan.`,
      { idleTimeoutMs: 240_000 },
    );
    return Response.json(answer);
  } catch (e) {
    return failure(e);
  }
}
