export function Disclaimer() {
  return (
    <div role="note" className="border-l-2 border-brass bg-paper p-5 text-sm leading-relaxed text-muted">
      <p className="eyebrow text-brass">Keine Finanzberatung</p>
      <p className="mt-2 max-w-prose">
        Dieses Tool ist ausschliesslich zu Bildungszwecken gedacht. Es liefert keine persönliche
        Finanz-, Steuer- oder Anlageberatung und keine Empfehlung. Alle Ausgaben basieren
        ausschliesslich auf den von Ihnen eingegebenen Annahmen — «hier ist die Rechnung basierend auf
        Ihren Angaben», nicht «das sollten Sie tun». Alle Steuerangaben sind Schätzungen — bitte mit dem
        offiziellen ESTV- oder kantonalen Steuerrechner verifizieren. Ihre Eingaben verbleiben
        ausschliesslich in Ihrem Browser und werden nie an einen Server übertragen.
      </p>
    </div>
  );
}
