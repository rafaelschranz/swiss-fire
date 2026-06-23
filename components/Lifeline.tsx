function Marker({ label, age, accent }: { label: string; age: number; accent?: "brass" | "petrol" }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span
        className={`h-2.5 w-2.5 ${accent === "brass" ? "bg-brass" : accent === "petrol" ? "bg-petrol" : "bg-stone"}`}
        aria-hidden="true"
      />
      <span className="num text-xs font-medium text-ink">{age}</span>
      <span className="eyebrow text-muted">{label}</span>
    </div>
  );
}

export function Lifeline({
  currentAge,
  fireAge,
  pillar3aUnlockAge,
  earliestPkAge,
  ahvClaimAge,
  horizonAge,
}: {
  currentAge: number;
  fireAge: number;
  pillar3aUnlockAge: number;
  earliestPkAge: number;
  ahvClaimAge: number;
  horizonAge: number;
}) {
  const firstUnlockAge = Math.min(pillar3aUnlockAge, earliestPkAge);
  const span = Math.max(1, horizonAge - currentAge);
  const pct = (age: number) => `${Math.min(100, Math.max(0, ((age - currentAge) / span) * 100))}%`;

  return (
    <div className="card p-5">
      <div className="relative h-2 bg-stone/40">
        {/* Bridge phase — the caution stretch, in brass */}
        <div
          className="absolute h-2 bg-brass"
          style={{ left: pct(fireAge), width: `calc(${pct(firstUnlockAge)} - ${pct(fireAge)})` }}
          title="Brückenphase: kein Vorsorge-Zugriff"
        />
        {/* Post-unlock — petrol */}
        <div
          className="absolute h-2 bg-petrol"
          style={{ left: pct(firstUnlockAge), width: `calc(100% - ${pct(firstUnlockAge)})` }}
        />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
        <Marker label="Heute" age={currentAge} />
        <Marker label="FIRE" age={fireAge} accent="brass" />
        <Marker label="3a frei" age={pillar3aUnlockAge} accent="petrol" />
        <Marker label="PK frei" age={earliestPkAge} accent="petrol" />
        <Marker label="AHV-Bezug" age={ahvClaimAge} accent="petrol" />
        <Marker label="Horizont" age={horizonAge} />
      </div>
      <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-muted">
        Brass markiert die Brückenphase ({fireAge}–{firstUnlockAge}): Die Ausgaben müssen vollständig
        aus dem steuerbaren Vermögen gedeckt werden, da Säule 3a und Pensionskasse noch gesperrt sind.
      </p>
    </div>
  );
}
