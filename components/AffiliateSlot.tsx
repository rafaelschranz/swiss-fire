"use client";

import type { AffiliateSlotConfig } from "@/lib/affiliates";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function AffiliateSlot({ slot }: { slot: AffiliateSlotConfig }) {
  const { t } = useI18n();
  const a = t.affiliate;
  // Localised copy keyed by slot id, with the centralised config as fallback.
  const localized: Record<string, { name: string; description: string }> = {
    broker: a.broker,
    pillar3a: a.pillar3a,
  };
  const name = localized[slot.id]?.name ?? slot.name;
  const description = localized[slot.id]?.description ?? slot.description;
  return (
    <aside aria-label={a.aria} className="border border-dashed border-line-2 bg-paper p-5 text-sm">
      <p className="eyebrow text-muted">{a.label}</p>
      <p className="serif mt-2 text-lg text-ink">{name}</p>
      <p className="mt-1 leading-relaxed text-muted">{description}</p>
      <a
        href={slot.href}
        rel="sponsored noopener"
        target="_blank"
        className="eyebrow mt-3 inline-block text-brass transition hover:text-ink"
      >
        {a.learnMore}
      </a>
    </aside>
  );
}
