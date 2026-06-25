"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";

export function Disclaimer() {
  const { t } = useI18n();
  return (
    <div role="note" className="border-l-2 border-brass bg-paper p-5 text-sm leading-relaxed text-muted">
      <p className="eyebrow text-brass">{t.common.disclaimer.title}</p>
      <p className="mt-2 max-w-prose">{t.common.disclaimer.body}</p>
    </div>
  );
}
