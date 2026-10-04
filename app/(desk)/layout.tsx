// Every screen of the desk, inside its shell. Who may see it is decided in
// middleware.ts (signed out → the login screen) and, for the data, by Kaman.
import { DeskShell } from "../components/DeskShell";
import { wiring } from "../lib/kaman";

export default function DeskLayout({ children }: { children: React.ReactNode }) {
  return (
    <DeskShell brief={wiring.brief} targetYear={wiring.targetYear}>
      {children}
    </DeskShell>
  );
}
