import Link from "next/link";

import { BRAND, NAV } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-paper/10 bg-ink/95 text-paper backdrop-blur">
      <div className="col flex items-center justify-between gap-6 py-3.5">
        <Link href="/" className="flex items-baseline gap-2 no-underline">
          <span className="serif text-lg font-semibold tracking-tight text-paper">{BRAND}</span>
          <span className="eyebrow hidden text-brass-soft sm:inline">Schweizer FIRE</span>
        </Link>
        <nav className="flex items-center gap-5" aria-label="Hauptnavigation">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="eyebrow text-paper/70 no-underline transition hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/rechner"
            className="bg-brass px-3.5 py-2 text-xs font-semibold text-[#1a1205] no-underline transition hover:bg-brass-soft"
          >
            Jetzt rechnen
          </Link>
        </nav>
      </div>
    </header>
  );
}
