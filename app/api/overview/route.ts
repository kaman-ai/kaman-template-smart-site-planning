// The site at a glance, read from the lake: land by acquisition status,
// what the target year demands, and the plan if one has been computed.
import { failure, kaman, wiring } from "../../lib/kaman";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const k = kaman();
    const { lake, schema, targetYear } = wiring;
    const [parcels, demand] = await Promise.all([
      k.queryLakeObjects<{ status: string; parcels: number }>(
        lake,
        schema,
        "SELECT acquisition_status AS status, COUNT(*) AS parcels FROM land_parcels GROUP BY acquisition_status ORDER BY parcels DESC",
      ),
      k.queryLakeObjects<Record<string, number>>(
        lake,
        schema,
        `SELECT year, population, households, jobs, water_mld, power_mw FROM demand_projection WHERE year = ${targetYear}`,
      ),
    ]);
    // The plan exists once the planner has run; before that the table is
    // simply absent, which is not an error for this page.
    let plan: Record<string, unknown>[] = [];
    let planError: string | null = null;
    try {
      plan = await k.queryLakeObjects(lake, schema, "SELECT * FROM master_plan", 500);
    } catch (e) {
      planError = e instanceof Error ? e.message : String(e);
    }
    return Response.json({ wiring, parcels, demand: demand[0] ?? null, plan, planError });
  } catch (e) {
    return failure(e);
  }
}
