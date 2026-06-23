import { formatChf, formatPercent } from "@/lib/format";

function Tile({
  caption,
  value,
  inverted,
  accent,
}: {
  caption: string;
  value: string;
  inverted?: boolean;
  accent?: "petrol" | "brass";
}) {
  const valueTone = inverted
    ? "text-paper"
    : accent === "petrol"
      ? "text-petrol"
      : accent === "brass"
        ? "text-brass"
        : "text-ink";
  return (
    <div className={`p-5 ${inverted ? "bg-ink" : "bg-paper"}`}>
      <p className={`eyebrow ${inverted ? "text-brass-soft" : "text-muted"}`}>{caption}</p>
      <p className={`num mt-2 text-xl font-semibold sm:text-[22px] ${valueTone}`}>{value}</p>
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

  const statusLabel = feasible
    ? "Tragfähig"
    : failedDuringBridge
      ? "Lücke in Brückenphase"
      : "Nicht tragfähig bis Horizont";

  return (
    <div className="space-y-4">
      {/* KPI tiles separated by hairline gridlines; headline tile inverts to ink */}
      <div className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
        <Tile caption="Brücken-Kapitalbedarf" value={formatChf(bridgeCapitalRequired)} inverted />
        <Tile
          caption="Vermögen bei FIRE"
          value={formatChf(taxableAtFire)}
          accent={coverage >= 1 ? "petrol" : "brass"}
        />
        <Tile
          caption="Deckung Brückenbedarf"
          value={Number.isFinite(coverage) ? formatPercent(coverage) : "—"}
          accent={coverage >= 1 ? "petrol" : "brass"}
        />
        {monteCarloSuccessRate !== undefined ? (
          <Tile
            caption="Monte-Carlo Erfolg"
            value={formatPercent(monteCarloSuccessRate)}
            accent={monteCarloSuccessRate >= 0.8 ? "petrol" : "brass"}
          />
        ) : (
          <Tile caption="Status bis Horizont" value={statusLabel} accent={feasible ? "petrol" : "brass"} />
        )}
      </div>

      {/* Quiet verdict line — petrol for positive, brass for caution; never green/red */}
      <p className="flex items-center gap-2 text-sm">
        <span
          className={`inline-block h-2 w-2 ${feasible ? "bg-petrol" : "bg-brass"}`}
          aria-hidden="true"
        />
        <span className={feasible ? "text-petrol" : "text-brass"}>{statusLabel}</span>
        <span className="text-muted">
          {feasible
            ? "— das projizierte steuerbare Vermögen deckt die Brückenphase."
            : failedDuringBridge
              ? "— das steuerbare Vermögen reicht nicht durch die Brückenphase."
              : "— das Vermögen ist vor dem Planungshorizont aufgebraucht."}
        </span>
      </p>
    </div>
  );
}
