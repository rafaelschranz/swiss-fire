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
  const surplus = taxableAtFire - bridgeCapitalRequired;
  const positive = feasible;

  const headline = feasible
    ? "Ihr Kapital reicht für die Frühpensionierung."
    : failedDuringBridge
      ? "Ihr Kapital reicht noch nicht für die Frühpensionierung."
      : "Ihr Kapital reicht — aber nicht bis zum Planungshorizont.";

  const detail = feasible
    ? surplus >= 0
      ? `Das steuerbare Vermögen bei FIRE übersteigt den Brückenbedarf um ${formatChf(surplus)}. Der Plan trägt bis zum Planungshorizont.`
      : `Der Plan trägt bis zum Planungshorizont — auch wenn dafür frühzeitig Vorsorgekapital bezogen wird.`
    : failedDuringBridge
      ? `Bis zum ersten Vorsorge-Bezug fehlen rund ${formatChf(Math.abs(surplus))}. So lange muss alles aus dem steuerbaren Vermögen kommen.`
      : `Die Brückenphase ist gedeckt, doch das Vermögen ist vor dem Planungshorizont aufgebraucht.`;

  return (
    <div className="space-y-5">
      {/* Lead verdict — the clearest answer to "is the capital enough?" */}
      <div className={`card border-l-4 p-6 sm:p-7 ${positive ? "border-l-petrol" : "border-l-brass"}`}>
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow text-muted">Beurteilung</p>
          <span className={`eyebrow ${positive ? "text-petrol" : "text-brass"}`}>
            {positive ? "● Ausreichend" : "● Noch nicht ausreichend"}
          </span>
        </div>
        <h2 className={`serif mt-3 text-[clamp(22px,3.6vw,32px)] leading-tight ${positive ? "text-petrol" : "text-brass"}`}>
          {headline}
        </h2>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">{detail}</p>
      </div>

      {/* Supporting figures — headline need inverts to ink */}
      <div className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
        <Tile caption="Brücken-Kapitalbedarf" value={formatChf(bridgeCapitalRequired)} inverted />
        <Tile
          caption="Vermögen bei FIRE"
          value={formatChf(taxableAtFire)}
          accent={coverage >= 1 ? "petrol" : "brass"}
        />
        <Tile
          caption={surplus >= 0 ? "Polster" : "Lücke"}
          value={formatChf(Math.abs(surplus))}
          accent={surplus >= 0 ? "petrol" : "brass"}
        />
        {monteCarloSuccessRate !== undefined ? (
          <Tile
            caption="Monte-Carlo Erfolg"
            value={formatPercent(monteCarloSuccessRate)}
            accent={monteCarloSuccessRate >= 0.8 ? "petrol" : "brass"}
          />
        ) : (
          <Tile
            caption="Deckung Brückenbedarf"
            value={Number.isFinite(coverage) ? formatPercent(coverage) : "—"}
            accent={coverage >= 1 ? "petrol" : "brass"}
          />
        )}
      </div>
    </div>
  );
}
