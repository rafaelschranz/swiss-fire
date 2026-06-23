function Marker({ label, age, color }: { label: string; age: number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{age}</span>
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
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
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Ihre Zeitlinie</p>
      <div className="relative h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="absolute h-2 rounded-full bg-amber-400/70 dark:bg-amber-600/60"
          style={{ left: pct(fireAge), width: `calc(${pct(firstUnlockAge)} - ${pct(fireAge)})` }}
          title="Brückenphase: kein Pillar-Zugriff"
        />
        <div
          className="absolute h-2 rounded-full bg-emerald-500/70 dark:bg-emerald-600/60"
          style={{ left: pct(firstUnlockAge), width: `calc(100% - ${pct(firstUnlockAge)})` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        <Marker label="Heute" age={currentAge} color="bg-zinc-400" />
        <Marker label="FIRE" age={fireAge} color="bg-blue-500" />
        <Marker label="3a frei" age={pillar3aUnlockAge} color="bg-emerald-500" />
        <Marker label="PK frei" age={earliestPkAge} color="bg-emerald-500" />
        <Marker label="AHV-Bezug" age={ahvClaimAge} color="bg-emerald-500" />
        <Marker label="Horizont" age={horizonAge} color="bg-zinc-400" />
      </div>
      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        Orange = Brückenphase ({fireAge}–{firstUnlockAge}): Spending muss vollständig aus dem
        steuerbaren Vermögen kommen, da Säule 3a/PK noch gesperrt sind.
      </p>
    </div>
  );
}
