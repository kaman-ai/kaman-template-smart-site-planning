// The brief: what the plan must serve in the target year, and the land it
// has to work with, parcel by parcel — each parcel a question for the
// planner. A Kaman scenario, so the figures come from the lake and the
// page is the same one Kaman shows.
import { Scenario } from "../components/Scenario";
import { wiring } from "../lib/kaman";

export const dynamic = "force-dynamic";

export default function BriefPage() {
  return <Scenario id={wiring.brief} />;
}
