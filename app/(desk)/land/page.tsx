// The land today, on the map: parcels by acquisition status over the flood
// zones, constraints, water and infrastructure.
import { Scenario } from "../../components/Scenario";
import { wiring } from "../../lib/kaman";

export const dynamic = "force-dynamic";

export default function LandPage() {
  return <Scenario id={wiring.land} />;
}
