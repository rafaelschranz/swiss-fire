export function Disclaimer() {
  return (
    <div
      role="note"
      className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200"
    >
      <p className="font-semibold">Keine Finanzberatung</p>
      <p>
        Dieses Tool ist ausschliesslich zu Bildungszwecken gedacht. Es liefert keine persönliche
        Finanz-, Steuer- oder Anlageberatung und keine Empfehlung. Alle Ausgaben basieren
        ausschliesslich auf den von Ihnen eingegebenen Annahmen — &quot;hier ist die Rechnung
        basierend auf Ihren Angaben&quot;, nicht &quot;das sollten Sie tun&quot;. Alle Steuerangaben sind
        Schätzungen — bitte mit dem offiziellen ESTV- oder kantonalen Steuerrechner verifizieren.
        Ihre Eingaben verbleiben ausschliesslich in Ihrem Browser und werden nie an einen Server
        übertragen.
      </p>
    </div>
  );
}
