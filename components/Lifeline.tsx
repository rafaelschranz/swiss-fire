import { useI18n } from "@/lib/i18n/I18nProvider";
import { tpl } from "@/lib/i18n/tpl";

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
  title,
}: {
  currentAge: number;
  fireAge: number;
  pillar3aUnlockAge: number;
  earliestPkAge: number;
  ahvClaimAge: number;
  horizonAge: number;
  /** Optional heading shown above the track (e.g. "Sie" / "Partner:in"). */
  title?: string;
}) {
  const { t } = useI18n();
  const l = t.lifeline;
  const firstUnlockAge = Math.min(pillar3aUnlockAge, earliestPkAge);
  const span = Math.max(1, horizonAge - currentAge);
  const pct = (age: number) => `${Math.min(100, Math.max(0, ((age - currentAge) / span) * 100))}%`;

  return (
    <div className="card p-5">
      {title && <p className="eyebrow mb-4 text-brass">{title}</p>}
      <div className="relative h-2 bg-stone/40">
        {/* Bridge phase — the caution stretch, in brass */}
        <div
          className="absolute h-2 bg-brass"
          style={{ left: pct(fireAge), width: `calc(${pct(firstUnlockAge)} - ${pct(fireAge)})` }}
          title={l.bridgeTitle}
        />
        {/* Post-unlock — petrol */}
        <div
          className="absolute h-2 bg-petrol"
          style={{ left: pct(firstUnlockAge), width: `calc(100% - ${pct(firstUnlockAge)})` }}
        />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
        <Marker label={l.today} age={currentAge} />
        <Marker label={l.fire} age={fireAge} accent="brass" />
        <Marker label={l.unlock3a} age={pillar3aUnlockAge} accent="petrol" />
        <Marker label={l.unlockPk} age={earliestPkAge} accent="petrol" />
        <Marker label={l.ahvClaim} age={ahvClaimAge} accent="petrol" />
        <Marker label={l.horizon} age={horizonAge} />
      </div>
      <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-muted">
        {tpl(l.footnote, { fire: fireAge, unlock: firstUnlockAge })}
      </p>
    </div>
  );
}
