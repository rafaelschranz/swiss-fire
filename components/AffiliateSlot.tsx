import type { AffiliateSlotConfig } from "@/lib/affiliates";

export function AffiliateSlot({ slot }: { slot: AffiliateSlotConfig }) {
  return (
    <aside aria-label="Werbung" className="border border-dashed border-line-2 bg-paper p-5 text-sm">
      <p className="eyebrow text-muted">Werbung / Partner-Link</p>
      <p className="serif mt-2 text-lg text-ink">{slot.name}</p>
      <p className="mt-1 leading-relaxed text-muted">{slot.description}</p>
      <a
        href={slot.href}
        rel="sponsored noopener"
        target="_blank"
        className="eyebrow mt-3 inline-block text-brass transition hover:text-ink"
      >
        Mehr erfahren →
      </a>
    </aside>
  );
}
