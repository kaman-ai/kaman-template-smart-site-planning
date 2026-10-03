"use client";

// The planning desk: the land today, what the target year needs, and the
// plan — computed in the lake by the planner agent, signed off by the
// workflow. Everything comes through this app's own server routes, so the
// Kaman key never reaches the browser.
import { useCallback, useEffect, useState } from "react";
import { apiPath } from "./lib/apiPath";

type Overview = {
  wiring: { lake: string; targetYear: number };
  parcels: { status: string; parcels: number }[];
  demand: Record<string, number> | null;
  plan: Record<string, unknown>[];
  planError: string | null;
};

type PlanAnswer = { summary: string; placements: number; unmetNorms: string[] };

async function call<T>(path: string, method = "GET"): Promise<T> {
  const res = await fetch(apiPath(path), { method });
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error ?? `HTTP ${res.status}`);
  return body as T;
}

function Stat({ label, value, unit }: { label: string; value: unknown; unit?: string }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">
        {typeof value === "number" ? value.toLocaleString() : String(value ?? "—")}
        {unit ? <span className="ml-1 text-sm font-normal text-slate-500">{unit}</span> : null}
      </div>
    </div>
  );
}

export default function PlanningDesk() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"plan" | "signoff" | null>(null);
  const [answer, setAnswer] = useState<PlanAnswer | null>(null);
  const [signoff, setSignoff] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setOverview(await call<Overview>("/api/overview"));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  const plan = async () => {
    setBusy("plan");
    setError(null);
    try {
      setAnswer(await call<PlanAnswer>("/api/plan", "POST"));
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  };
  const signOff = async () => {
    setBusy("signoff");
    setError(null);
    try {
      const run = await call<{ state: string }>("/api/signoff", "POST");
      setSignoff(run.state);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  };

  const columns = overview?.plan[0] ? Object.keys(overview.plan[0]).filter((c) => !c.endsWith("_wkt")) : [];

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Nava Nagar planning desk</h1>
          <p className="text-slate-600">
            A greenfield city, planned from its land data
            {overview ? ` — lake ${overview.wiring.lake}, sized for ${overview.wiring.targetYear}` : ""}.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => void plan()}
            disabled={busy !== null}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {busy === "plan" ? "Planning… (a few minutes)" : "Plan the land"}
          </button>
          <button
            onClick={() => void signOff()}
            disabled={busy !== null || !overview?.plan.length}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {busy === "signoff" ? "Running…" : "Check and sign off"}
          </button>
        </div>
      </header>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div> : null}

      {overview ? (
        <>
          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Population" value={overview.demand?.population} />
            <Stat label="Households" value={overview.demand?.households} />
            <Stat label="Water" value={overview.demand?.water_mld} unit="MLD" />
            <Stat label="Power" value={overview.demand?.power_mw} unit="MW" />
          </section>

          <section className="rounded-xl border bg-white p-4">
            <h2 className="mb-2 font-medium">Land by acquisition status</h2>
            <div className="flex flex-wrap gap-2">
              {overview.parcels.map((p) => (
                <span key={p.status} className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                  {p.status}: <strong>{p.parcels}</strong> parcels
                </span>
              ))}
            </div>
          </section>

          {answer ? (
            <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
              <h2 className="mb-1 font-medium">The planner&apos;s answer</h2>
              <p>{answer.summary}</p>
              <p className="mt-2 text-slate-600">{answer.placements} placements written to master_plan.</p>
              {answer.unmetNorms.length ? (
                <ul className="mt-2 list-disc pl-5 text-amber-800">
                  {answer.unmetNorms.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}
          {signoff ? (
            <div className="rounded-lg border bg-white p-3 text-sm">Sign-off workflow: {signoff}</div>
          ) : null}

          <section className="rounded-xl border bg-white p-4">
            <h2 className="mb-2 font-medium">The plan</h2>
            {overview.plan.length === 0 ? (
              <p className="text-sm text-slate-500">
                No plan yet. Press <em>Plan the land</em>: the planner computes every placement from the data and
                writes it to <code>master_plan</code>.
              </p>
            ) : (
              <div className="max-h-[28rem] overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr>
                      {columns.map((c) => (
                        <th key={c} className="border-b px-2 py-1 font-medium">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {overview.plan.map((row, i) => (
                      <tr key={i} className="odd:bg-slate-50">
                        {columns.map((c) => (
                          <td key={c} className="px-2 py-1">
                            {String(row[c] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : !error ? (
        <p className="text-slate-500">Reading the lake…</p>
      ) : null}
    </main>
  );
}
