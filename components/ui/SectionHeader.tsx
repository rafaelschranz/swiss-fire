import type { ReactNode } from "react";

/** Mono index number (brass) + serif title, opening a section. */
export function SectionHeader({
  index,
  title,
  action,
}: {
  index: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
      <div className="flex items-baseline gap-3">
        <span className="eyebrow text-brass">{index}</span>
        <h2 className="serif text-2xl text-ink">{title}</h2>
      </div>
      {action}
    </div>
  );
}
