import { formatChf, formatPercent } from "@/lib/format";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { tpl } from "@/lib/i18n/tpl";

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
  const { t } = useI18n();
  const r = t.results;
  const coverage = bridgeCapitalRequired > 0 ? taxableAtFire / bridgeCapitalRequired : Infinity;
  const surplus = taxableAtFire - bridgeCapitalRequired;
  const positive = feasible;

  const headline = feasible
    ? r.headlineFeasible
    : failedDuringBridge
      ? r.headlineBridgeFail
      : r.headlineHorizonFail;

  const detail = feasible
    ? surplus >= 0
      ? tpl(r.detailSurplus, { amount: formatChf(surplus) })
      : r.detailFeasibleNoSurplus
    : failedDuringBridge
      ? tpl(r.detailBridgeFail, { amount: formatChf(Math.abs(surplus)) })
      : r.detailHorizonFail;

  return (
    <div className="space-y-5">
      {/* Lead verdict — the clearest answer to "is the capital enough?" */}
      <div className={`card border-l-4 p-6 sm:p-7 ${positive ? "border-l-petrol" : "border-l-brass"}`}>
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow text-muted">{r.verdict}</p>
          <span className={`eyebrow ${positive ? "text-petrol" : "text-brass"}`}>
            {positive ? r.enough : r.notEnough}
          </span>
        </div>
        <h2 className={`serif mt-3 text-[clamp(22px,3.6vw,32px)] leading-tight ${positive ? "text-petrol" : "text-brass"}`}>
          {headline}
        </h2>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">{detail}</p>
      </div>

      {/* Supporting figures — headline need inverts to ink */}
      <div className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
        <Tile caption={r.tileBridgeNeed} value={formatChf(bridgeCapitalRequired)} inverted />
        <Tile
          caption={r.tileLiquid}
          value={formatChf(taxableAtFire)}
          accent={coverage >= 1 ? "petrol" : "brass"}
        />
        <Tile
          caption={surplus >= 0 ? r.tileBuffer : r.tileGap}
          value={formatChf(Math.abs(surplus))}
          accent={surplus >= 0 ? "petrol" : "brass"}
        />
        {monteCarloSuccessRate !== undefined ? (
          <Tile
            caption={r.tileMonteCarlo}
            value={formatPercent(monteCarloSuccessRate)}
            accent={monteCarloSuccessRate >= 0.8 ? "petrol" : "brass"}
          />
        ) : (
          <Tile
            caption={r.tileCoverage}
            value={Number.isFinite(coverage) ? formatPercent(coverage) : "—"}
            accent={coverage >= 1 ? "petrol" : "brass"}
          />
        )}
      </div>
    </div>
  );
}
