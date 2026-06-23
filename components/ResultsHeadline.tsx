function formatChf(value: number): string {
  return new Intl.NumberFormat("de-CH", { maximumFractionDigits: 0 }).format(Math.round(value));
}

function Stat({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "good" | "bad" }) {
  const toneClass =
    tone === "good"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "bad"
        ? "text-rose-600 dark:text-rose-400"
        : "text-zinc-900 dark:text-zinc-50";
  return (
    <div className="rounded-2xl border border-zinc-200/70 bg-white/70 p-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</p>
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

  const verdict = feasible
    ? { label: "Plan trägt", emoji: "✅", grad: "from-emerald-500 to-teal-600" }
    : failedDuringBridge
      ? { label: "Lücke in der Brückenphase", emoji: "⚠️", grad: "from-amber-500 to-rose-600" }
      : { label: "Vermögen reicht nicht bis zum Horizont", emoji: "⚠️", grad: "from-amber-500 to-rose-600" };

  return (
    <div className="space-y-4">
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${verdict.grad} p-6 text-white shadow-lg sm:p-8`}>
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" aria-hidden="true" />
        <div className="absolute -bottom-12 -left-6 h-48 w-48 rounded-full bg-black/10" aria-hidden="true" />
        <div className="relative">
          <p className="text-sm font-medium uppercase tracking-wide text-white/80">Benötigtes Brücken-Kapital</p>
          <p className="mt-1 text-4xl font-extrabold tabular-nums sm:text-5xl">CHF {formatChf(bridgeCapitalRequired)}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold backdrop-blur">
            <span aria-hidden="true">{verdict.emoji}</span>
            {verdict.label}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat
          label="Steuerbares Vermögen bei FIRE"
          value={`CHF ${formatChf(taxableAtFire)}`}
          tone={coverage >= 1 ? "good" : "bad"}
        />
        <Stat
          label="Deckung des Brückenbedarfs"
          value={Number.isFinite(coverage) ? `${Math.round(coverage * 100)}%` : "—"}
          tone={coverage >= 1 ? "good" : "bad"}
        />
        {monteCarloSuccessRate !== undefined ? (
          <Stat
            label="Monte-Carlo Erfolgsquote"
            value={`${Math.round(monteCarloSuccessRate * 100)}%`}
            tone={monteCarloSuccessRate >= 0.8 ? "good" : monteCarloSuccessRate >= 0.5 ? "neutral" : "bad"}
          />
        ) : (
          <Stat label="Status bis Horizont" value={feasible ? "Tragfähig" : "Nicht tragfähig"} tone={feasible ? "good" : "bad"} />
        )}
      </div>
    </div>
  );
}
