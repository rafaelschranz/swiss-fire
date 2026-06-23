function formatChf(value: number): string {
  return new Intl.NumberFormat("de-CH", { maximumFractionDigits: 0 }).format(Math.round(value));
}

function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "bad";
}) {
  const toneClass =
    tone === "good"
      ? "text-emerald-700 dark:text-emerald-400"
      : tone === "bad"
        ? "text-red-700 dark:text-red-400"
        : "text-zinc-900 dark:text-zinc-100";
  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${toneClass}`}>{value}</p>
    </div>
  );
}

export function ResultsHeadline({
  bridgeCapitalRequired,
  taxableAtFire,
  feasible,
  failedDuringBridge,
  monteCarloSuccessRate,
}: {
  bridgeCapitalRequired: number;
  taxableAtFire: number;
  feasible: boolean;
  failedDuringBridge: boolean;
  monteCarloSuccessRate?: number;
}) {
  const coverage = bridgeCapitalRequired > 0 ? taxableAtFire / bridgeCapitalRequired : Infinity;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Brücken-Kapitalbedarf (PV)" value={`CHF ${formatChf(bridgeCapitalRequired)}`} />
      <StatCard
        label="Steuerbares Vermögen bei FIRE"
        value={`CHF ${formatChf(taxableAtFire)}`}
        tone={coverage >= 1 ? "good" : "bad"}
      />
      <StatCard
        label="Deterministisch tragfähig"
        value={feasible ? "Ja" : failedDuringBridge ? "Nein (Brücke)" : "Nein"}
        tone={feasible ? "good" : "bad"}
      />
      {monteCarloSuccessRate !== undefined && (
        <StatCard
          label="Monte-Carlo Erfolgsquote"
          value={`${Math.round(monteCarloSuccessRate * 100)}%`}
          tone={monteCarloSuccessRate >= 0.8 ? "good" : monteCarloSuccessRate >= 0.5 ? "neutral" : "bad"}
        />
      )}
    </div>
  );
}
