import type { AffiliateSlotConfig } from "@/lib/affiliates";

export function AffiliateSlot({ slot }: { slot: AffiliateSlotConfig }) {
  return (
    <aside
      aria-label="Werbung"
      className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm dark:border-zinc-700 dark:bg-zinc-900"
    >
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Werbung / Partner-Link
      </p>
      <p className="font-medium text-zinc-900 dark:text-zinc-100">{slot.name}</p>
      <p className="mb-2 text-zinc-600 dark:text-zinc-400">{slot.description}</p>
      <a
        href={slot.href}
        className="text-sm font-medium text-blue-700 underline-offset-2 hover:underline dark:text-blue-400"
      >
        Mehr erfahren →
      </a>
    </aside>
  );
}
