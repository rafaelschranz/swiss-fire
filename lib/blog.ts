/**
 * Blog content. Posts are structured data (no MDX toolchain needed) rendered by
 * a shared article layout. Educational only — figures are 2026 estimates without
 * warranty, consistent with the calculator's documented model.
 *
 * Posts are keyed by locale and share the same slugs across languages, so the
 * language switcher can map an article 1:1 between `/de/blog/<slug>` and
 * `/en/blog/<slug>`.
 */
import type { Locale } from "@/lib/i18n/config";

export type Block =
  | { h2: string }
  | { p: string }
  | { ul: string[] }
  | { callout: string };

export interface Post {
  slug: string;
  title: string;
  description: string;
  /** ISO date. */
  date: string;
  readingMinutes: number;
  tag: string;
  body: Block[];
}

const POSTS_DE: Post[] = [
  {
    slug: "brueckenphase-fruehpensionierung",
    title: "Die Brückenphase: das Loch zwischen Frühpension und Vorsorge",
    description:
      "Wer vor 58–65 aufhört zu arbeiten, muss eine Lücke überbrücken, bevor Säule 3a, Pensionskasse und AHV greifen. Was diese Brückenphase kostet — und wie viel Kapital sie wirklich braucht.",
    date: "2026-06-02",
    readingMinutes: 6,
    tag: "Grundlagen",
    body: [
      { p: "FIRE — «Financial Independence, Retire Early» — klingt nach einem einzigen grossen Ziel: genug Vermögen, um nicht mehr arbeiten zu müssen. In der Schweiz ist das aber nur die halbe Wahrheit. Denn Ihr Vorsorgevermögen ist die meiste Zeit gesperrt." },
      { h2: "Drei Töpfe, drei Zeitpunkte" },
      { p: "Ihr Alterskapital liegt in drei Säulen, die zu unterschiedlichen Zeitpunkten zugänglich werden:" },
      {
        ul: [
          "Säule 3a: frühestens fünf Jahre vor dem AHV-Referenzalter, also typischerweise ab 60.",
          "Pensionskasse (2. Säule): je nach Reglement ab 58–60.",
          "AHV (1. Säule): regulär ab 65, vorbezogen ab 63 (mit Kürzung).",
        ],
      },
      { p: "Wer mit 50 aufhört, hat also bis zu zehn Jahre, in denen kein einziger dieser Töpfe etwas abwirft. Diese Zeit ist die Brückenphase — und sie muss vollständig aus dem frei verfügbaren, steuerbaren Vermögen finanziert werden." },
      { h2: "Was die Brücke kostet" },
      { p: "In der Brückenphase laufen die Kosten weiter: Lebenshaltung, Krankenkassenprämien und — oft übersehen — die AHV-Beiträge für Nichterwerbstätige. Letztere bemessen sich nach dem Vermögen und können mehrere tausend Franken pro Jahr betragen." },
      { p: "Das «Brückenkapital» ist der Betrag, den Sie zum Ausstieg liquide brauchen, um diese Jahre bis zum ersten Vorsorge-Bezug zu decken. Genau diese Zahl rechnet der Pillar-Zero-Rechner als Erstes aus." },
      { callout: "Faustregel: Je früher der Ausstieg, desto länger die Brücke — und desto mehr liquides (nicht gesperrtes) Vermögen brauchen Sie zusätzlich zum Vorsorgekapital." },
      { h2: "Warum «genug Vermögen» nicht reicht" },
      { p: "Zwei Personen mit identischem Gesamtvermögen können völlig unterschiedlich dastehen: Wer den Grossteil in der Pensionskasse hat, kommt in der Brückenphase nicht daran — wer dasselbe Geld im Wertschriftendepot hält, schon. Die Aufteilung zwischen liquidem und gesperrtem Vermögen entscheidet, ob Ihre Frühpension trägt." },
      { p: "Rechnen Sie Ihre persönliche Brücke durch und sehen Sie Jahr für Jahr, woraus die Ausgaben gedeckt werden." },
    ],
  },
  {
    slug: "saeule-3a-gestaffelt-beziehen",
    title: "Säule 3a gestaffelt beziehen: so brechen Sie die Steuerprogression",
    description:
      "Die Kapitalauszahlungssteuer ist progressiv und wird pro Jahr auf den gesamten Bezug berechnet. Wer mehrere 3a-Konten in verschiedenen Jahren auflöst, zahlt deutlich weniger.",
    date: "2026-06-09",
    readingMinutes: 5,
    tag: "Steuern",
    body: [
      { p: "Beim Bezug der Säule 3a wird das Kapital nicht zum normalen Einkommen geschlagen, sondern separat und zu einem reduzierten Satz besteuert — der Kapitalauszahlungssteuer. Diese Steuer ist progressiv: je grösser der Betrag in einem Kalenderjahr, desto höher der Prozentsatz." },
      { h2: "Der Trick: mehrere Konten, mehrere Jahre" },
      { p: "Ein einzelnes 3a-Konto muss immer vollständig aufgelöst werden — Teilbezüge sind nicht möglich. Wer aber von Anfang an mehrere 3a-Konten führt, kann sie in unterschiedlichen Kalenderjahren schliessen und so den steuerbaren Betrag pro Jahr klein halten." },
      { p: "Weil die Steuer pro Jahr auf der Summe aller Kapitalbezüge berechnet wird, senkt diese Staffelung die Progression spürbar. Drei Konten à 100'000 Franken über drei Jahre kosten deutlich weniger Steuern als 300'000 Franken auf einen Schlag." },
      { callout: "Bezüge dürfen ab fünf Jahren vor dem Referenzalter starten — das gibt ein Fenster von rund fünf Jahren, um die Konten zu staffeln." },
      { h2: "Vorsicht: alles im selben Jahr summiert sich" },
      { p: "Der Effekt funktioniert nur, wenn die Bezüge in verschiedene Jahre fallen. Wer 3a und einen Pensionskassen-Kapitalbezug im gleichen Kalenderjahr tätigt, wird auf der Summe besteuert — und landet wieder in der hohen Progression. Auch Ehepaare werden in vielen Kantonen gemeinsam veranlagt." },
      { h2: "Der Bund will es ändern" },
      { p: "Es gibt politische Bestrebungen, die Bundessteuer auf Kapitalbezüge zu vereinheitlichen und die Staffelung weniger attraktiv zu machen. Bis dahin bleibt sie eines der wirksamsten und legalen Steuerinstrumente der Frühpensionierung." },
      { p: "Im Pillar-Zero-Rechner können Sie die Anzahl 3a-Konten einstellen und sehen direkt, wie sich die Staffelung auf die Steuerrechnung auswirkt — mit echten ESTV-Werten für Ihre Gemeinde." },
    ],
  },
  {
    slug: "ahv-beitraege-nichterwerbstaetige",
    title: "AHV-Beiträge für Nichterwerbstätige: die unterschätzten Kosten der Frühpension",
    description:
      "Wer nicht mehr arbeitet, zahlt trotzdem AHV — und zwar nach Vermögen. Bei vermögenden Frührentnern können das bis zu 26'500 Franken pro Person und Jahr sein.",
    date: "2026-06-16",
    readingMinutes: 6,
    tag: "AHV",
    body: [
      { p: "Ein weit verbreiteter Irrtum: «Wenn ich nicht mehr arbeite, zahle ich keine AHV mehr.» Das Gegenteil ist der Fall. Wer vor dem Referenzalter aufhört zu arbeiten, gilt als nichterwerbstätig — und muss weiter AHV-, IV- und EO-Beiträge leisten, bis zum Referenzalter." },
      { h2: "Bemessung nach Vermögen" },
      { p: "Die Beiträge der Nichterwerbstätigen richten sich nach dem Vermögen plus dem zwanzigfachen jährlichen Renteneinkommen. Für eine Person, die rein vom Wertschriftenvermögen lebt, zählt also das Vermögen — Bezüge aus dem Depot sind kein «Renteneinkommen»." },
      {
        ul: [
          "Minimum: 530 Franken pro Jahr.",
          "Maximum: 26'500 Franken pro Jahr (erreicht bei rund 8,4 Mio. Franken massgebendem Vermögen).",
          "Dazwischen steigt der Beitrag mit dem Vermögen an.",
        ],
      },
      { callout: "Bei Ehepaaren wird jeder Ehegatte einzeln auf der Hälfte des gemeinsamen Vermögens veranlagt — beide zahlen, im Extremfall bis zu 53'000 Franken zusammen." },
      { h2: "Die Ausnahme: «genügend erwerbstätig»" },
      { p: "Es gibt einen wichtigen Hebel: Wer weiterhin erwerbstätig ist und dabei AHV-Beiträge von mindestens der Hälfte des sonst fälligen Nichterwerbstätigen-Beitrags leistet, ist von diesem befreit. Schon ein Teilzeitpensum oder regelmässige Mandate können also die «AHV aufs Vermögen» vermeiden." },
      { p: "Bei Paaren genügt es, wenn ein Partner genügend erwerbstätig ist — das befreit auch den nichterwerbstätigen Partner." },
      { h2: "Nicht vergessen — und gut nutzen" },
      { p: "Die Beiträge sichern weiterhin Beitragsjahre und damit die spätere AHV-Rente; Lücken würden die Rente kürzen. Es ist also kein verlorenes Geld — aber ein Kostenfaktor, den die Brückenrechnung berücksichtigen muss. Der Pillar-Zero-Rechner modelliert die Nichterwerbstätigen-Beiträge inklusive der Erwerbstätigen-Ausnahme." },
    ],
  },
  {
    slug: "pensionskasse-kapital-oder-rente",
    title: "Pensionskasse: Kapital, Rente oder Mischung?",
    description:
      "Beim Pensionskassen-Bezug entscheiden Sie einmalig zwischen lebenslanger Rente, Kapital — oder einer Mischung. Die Wahl prägt Steuern, Flexibilität und Sicherheit für den Rest des Lebens.",
    date: "2026-06-23",
    readingMinutes: 7,
    tag: "Pensionskasse",
    body: [
      { p: "Wenn das Pensionskassen-Guthaben fällig wird, treffen Sie eine der folgenreichsten Entscheidungen der ganzen Pensionsplanung: Rente, Kapital oder eine Kombination. Sie ist in der Regel unwiderruflich." },
      { h2: "Die Rente: planbar und lebenslang" },
      { p: "Die Rente wird aus dem Guthaben mit dem Umwandlungssatz berechnet (gesetzliches BVG-Minimum 6,8 %, im überobligatorischen Bereich oft tiefer). Sie ist lebenslang garantiert und schützt vor dem Risiko, das Kapital zu überleben — wird aber voll als Einkommen besteuert." },
      { h2: "Das Kapital: flexibel und vererbbar" },
      { p: "Der Kapitalbezug wird einmalig zum reduzierten Satz besteuert (kantonal/kommunal plus ein Fünftel des ordentlichen Bundestarifs). Das Geld bleibt Ihres — flexibel investierbar und vererbbar —, aber Sie tragen das Anlage- und das Langlebigkeitsrisiko selbst." },
      {
        ul: [
          "Rente: maximale Sicherheit, volle Einkommenssteuer, nicht vererbbar.",
          "Kapital: maximale Flexibilität, einmalige Kapitalsteuer, Anlage- & Langlebigkeitsrisiko.",
          "Mischung: gesetzlich sind mindestens 25 % als Kapital beziehbar — viele kombinieren eine Grundsicherung per Rente mit einem flexiblen Kapitalteil.",
        ],
      },
      { callout: "Es gibt keine allgemein richtige Antwort. Gesundheit, übriges Vermögen, Familiensituation und Risikobereitschaft entscheiden — eine persönliche Beratung lohnt sich." },
      { h2: "Was die Frühpension besonders macht" },
      { p: "Bei einem frühen Bezug ist der Umwandlungssatz tiefer (die Rente muss länger reichen), und das Guthaben hatte weniger Zeit zu wachsen. Gleichzeitig kann ein Kapitalbezug die liquide Brücke füllen, die Sie ohnehin brauchen. Beide Effekte sprechen oft für einen (Teil-)Kapitalbezug — aber eben nicht immer." },
      { p: "Im Pillar-Zero-Rechner stellen Sie Bezugsart und Umwandlungssatz ein und sehen sofort die Auswirkung auf Steuern, Liquidität und Reichweite Ihres Vermögens." },
    ],
  },
  {
    slug: "fruehpensionierung-schweiz",
    title: "Frühpensionierung in der Schweiz: der vollständige Leitfaden",
    description:
      "Frühpensionierung in der Schweiz bedeutet mehr als «genug Geld». Brückenkapital, AHV-Beiträge, Pensionskassen-Timing und Steuern müssen zusammenspielen.",
    date: "2026-06-28",
    readingMinutes: 8,
    tag: "Grundlagen",
    body: [
      { p: "In keinem anderen Land der Welt hat das Dreisäulensystem so direkten Einfluss auf den Zeitpunkt und die Kosten der Frühpensionierung wie in der Schweiz. Wer vor 65 aufhört zu arbeiten, muss nicht bloss «genug Geld» haben — er muss wissen, wo dieses Geld liegt, wann er darauf zugreifen kann und welche laufenden Kosten unabhängig vom Arbeitspensum anfallen." },
      { h2: "Was Frühpensionierung in der Schweiz bedeutet" },
      { p: "Frühpensionierung bedeutet den Austritt aus dem Erwerbsleben, bevor die drei Säulen zu fliessen beginnen. Das AHV-Referenzalter liegt seit der AHV21-Reform für Männer und Frauen bei 65. Die Pensionskasse zahlt je nach Reglement ab 58–60, die Säule 3a frühestens fünf Jahre vor dem Referenzalter. Wer mit 50 aufhört, überbrückt also bis zu zwölf Jahre ohne Vorsorgebezüge." },
      { h2: "Die drei Säulen und wann sie fliessen" },
      {
        ul: [
          "AHV (1. Säule): regulär ab 65, vorzeitig ab 63 mit dauerhafter Kürzung von 6,8 % pro Vorbezugsjahr.",
          "Pensionskasse (2. Säule): je nach Reglement ab 58–60, Kapitalbezug einmalig besteuert.",
          "Säule 3a: frühestens ab 60 (fünf Jahre vor dem Referenzalter), vollständiger Kontobezug je Konto.",
        ],
      },
      { h2: "Die fünf grössten Kostenfaktoren" },
      { p: "Die Planungsrechnung muss fünf Kostenblöcke enthalten, die alle parallel laufen:" },
      {
        ul: [
          "Lebenshaltungskosten inkl. Inflation — die Basis jeder Kalkulation.",
          "Krankenkassenprämien — ab der Frühpension ohne Arbeitgeberanteil, je nach Kanton CHF 300–600 pro Monat.",
          "AHV-Beiträge für Nichterwerbstätige — nach Vermögen, zwischen CHF 530 und CHF 26'500 pro Jahr.",
          "Steuern — Einkommens- und Vermögenssteuer; bei hohen Kapitalerträgen ein erheblicher Faktor.",
          "Einmalige Kapitalbezugssteuern — bei PK- und 3a-Bezügen, stark kantonsabhängig.",
        ],
      },
      { h2: "Wie viel Kapital braucht eine Frühpension?" },
      { p: "Als konservative Faustregel gilt in der Schweiz eine Entnahmerate von 3,0–3,5 % des Gesamtvermögens pro Jahr. Bei jährlichen Ausgaben von CHF 80'000 ergibt das ein Zielkapital von etwa CHF 2,3–2,7 Millionen." },
      { callout: "Wichtig: Dieses Kapital muss zum richtigen Teil liquid sein. Wer den Grossteil in der Pensionskasse hat, kommt in der Brückenphase nicht daran. Das freie Brückenkapital hängt direkt vom Ausstiegsalter ab." },
      { h2: "Häufige Fehler bei der Planung" },
      {
        ul: [
          "AHV-Nichterwerbstätigen-Beiträge vergessen: Sie fallen ab dem ersten Tag der Nichterwerbstätigkeit an.",
          "Zu wenig freies Kapital: Wer zu viel in der PK hat und zu wenig im Depot, bleibt in der Brückenphase stecken.",
          "Optimistische Entnahmerate: Eine Rate über 4 % birgt bei 30+ Jahren erhebliches Depletionsrisiko.",
          "Krankenkasse nicht neu beurteilen: Nach der Kündigung ändert sich die Ausgangslage oft deutlich.",
        ],
      },
      { h2: "Die nächsten Schritte" },
      {
        ul: [
          "Vermögensinventar: Wie viel ist frei, wie viel gesperrt (PK, 3a)?",
          "Pensionskassen-Reglement prüfen: Ab wann ist der Bezug möglich, wie hoch ist der Umwandlungssatz?",
          "Steuern vergleichen: Kantone unterscheiden sich bei der Kapitalbezugssteuer massiv.",
          "Simulation durchführen: Alle Faktoren gemeinsam modellieren, inklusive Inflation und Sequence-of-Returns-Risiko.",
        ],
      },
      { p: "Der Pillar-Zero-Rechner ist der einzige Schweizer FIRE-Rechner, der AHV-Beiträge, alle drei Säulen und die Brückenphase in einem Modell zusammenführt." },
    ],
  },
  {
    slug: "barista-fire-schweiz",
    title: "Barista-FIRE in der Schweiz: wie ein Teilzeitjob die AHV-Last beseitigt",
    description:
      "Ein kleines Erwerbseinkommen im frühen Ruhestand klingt nach einem Kompromiss — ist aber in der Schweiz ein steuerlicher Turbo: Es eliminiert die vermögensbasierte AHV.",
    date: "2026-06-30",
    readingMinutes: 6,
    tag: "Strategien",
    body: [
      { p: "Im angelsächsischen FIRE-Raum bezeichnet «Barista-FIRE» eine Strategie, bei der man mit einem etwas kleineren Kapitalstock in den Ruhestand geht und ein Teilzeitpensum übernimmt — ursprünglich anspielend auf Baristas bei Starbucks, die Krankenversicherung über ihren Arbeitgeber erhalten. In der Schweiz hat diese Strategie einen eigenen, besonders starken Hebel: die AHV-Halbierungsregel." },
      { h2: "Das AHV-Problem der reinen Frühpension" },
      { p: "Wer nicht mehr erwerbstätig ist, zahlt AHV nach Vermögen — progressiv und unabhängig vom tatsächlichen Konsum. Bei einem Vermögen von CHF 1,5 Millionen sind das rund CHF 3'740 pro Jahr, bei CHF 3 Millionen bereits CHF 7'954. Diese Beiträge laufen von der Frühpension bis zum Referenzalter 65 — bei einem Ausstieg mit 50 sind das fünfzehn Jahre." },
      { h2: "Die Halbierungsregel (Art. 28bis AHVV)" },
      { p: "Das Gesetz kennt eine präzise Ausnahme: Wer erwerbstätig ist und dabei AHV-Beiträge von mindestens der Hälfte des sonst fälligen Nichterwerbstätigen-Beitrags entrichtet, ist von der vermögensbasierten AHV vollständig befreit." },
      { callout: "Rechenbeispiel: Vermögen CHF 1,5 Mio. → Nichterwerbstätigen-Beitrag ca. CHF 3'740/Jahr → Mindest-AHV-Beitrag aus Erwerbstätigkeit: CHF 1'870 → entspricht einem Brutto-Erwerbseinkommen von rund CHF 17'600/Jahr (10,6 % Beitragssatz). Ein kleines Teilzeitpensum reicht aus." },
      { h2: "Was als Erwerbseinkommen zählt" },
      {
        ul: [
          "Angestellt auf Abruf, auch wenige Stunden pro Woche.",
          "Selbständige Beratungs- oder Freelance-Mandate.",
          "Verwaltungsratsmandate mit Entschädigung.",
          "Honorare für Vorträge, Schreiben, Coaching.",
          "Mieteinnahmen aus Immobilien zählen nicht als Erwerbseinkommen.",
        ],
      },
      { h2: "Die Portfolioauswirkung" },
      { p: "Der Effekt ist erheblich: Ohne Barista-Einkommen fliessen über fünfzehn Jahre rund CHF 56'100 in die vermögensbasierte AHV (bei CHF 1,5 Mio., inflationsbereinigt). Mit einem kleinen Erwerbseinkommen sinken diese Kosten auf die normal-AHV-Beiträge des Arbeitgebers und Arbeitnehmers — oft weniger als CHF 600 pro Jahr eigener Anteil." },
      { h2: "Mehr als nur eine Steueroptimierung" },
      { p: "Studien zur Rentenzufriedenheit zeigen konsistent: strukturierte Aktivität und soziale Einbindung erhöhen das Wohlbefinden im Ruhestand. Ein 20%-Pensum als Berater oder der Aufbau eines kleinen Nebenprojekts lässt sich mit Reisen und Freiheit kombinieren — und sichert gleichzeitig Beitragsjahre für die spätere AHV-Rente." },
      { p: "Im Pillar-Zero-Rechner können Sie den Barista-FIRE-Modus aktivieren: Der Rechner zeigt den Break-even-Lohn für Ihre konkrete Vermögenssituation und berechnet die Auswirkung auf die Portfolioreichweite." },
    ],
  },
  {
    slug: "vier-prozent-regel-schweiz",
    title: "Die 4%-Regel: Fundament des FIRE — und wo die Schweiz abweicht",
    description:
      "Die 4%-Regel ist das meistzitierte Prinzip des FIRE. Sie stammt aus US-Daten — Schweizer Anleger müssen Vermögenssteuer, CHF-Inflation und die Brückenphase einkalkulieren.",
    date: "2026-07-01",
    readingMinutes: 7,
    tag: "Grundlagen",
    body: [
      { p: "«Nehmen Sie jährlich 4 % Ihres Ausgangsportfolios heraus und passen Sie den Betrag für die Inflation an — das Kapital reicht mindestens 30 Jahre.» Diese Schlussfolgerung aus der Trinity Study (1998) ist das meistzitierte Prinzip des FIRE. Doch die Studie basiert auf US-Aktien und US-Anleihen, gemessen in US-Dollar. Für Schweizer Anleger gibt es wichtige Anpassungen." },
      { h2: "Was die 4%-Regel besagt" },
      { p: "William Bengen analysierte 1994 historische US-Marktrenditen und stellte fest: Wer jedes Jahr maximal 4 % seines Startportfolios entnimmt (inflationsangepasst), hat in praktisch keinem historischen 30-Jahres-Zeitraum den Geldhahn zudrehen müssen. Die Trinity Study bestätigte dies mit einem Aktien/Anleihen-Mix von 50/50 bis 75/25." },
      { callout: "Die Studie definierte «Erfolg» als: Portfolio überlebt 30 Jahre. Sie sagt nichts darüber aus, was nach 30 Jahren übrig ist — und nichts über 40- oder 50-jährige Phasen, wie sie bei einer Frühpension mit 40 entstehen können." },
      { h2: "Warum US-Daten nicht direkt übertragbar sind" },
      { p: "Die USA hatten historisch aussergewöhnlich hohe Aktienmarktrenditen im globalen Vergleich. Eine global diversifizierte Anlage — wie sie für Schweizer Anleger sinnvoll ist — zeigt langfristig etwas tiefere Renditen. Gleichzeitig ist die Schweizer Inflation historisch niedriger (1,5–2 % vs. 3–4 % in den USA), was die reale Rendite teilweise kompensiert." },
      { h2: "Was die Schweiz besonders macht" },
      {
        ul: [
          "Vermögenssteuer: Je nach Kanton 0,1–0,7 % des Nettovermögens pro Jahr — ein direkter Abzug von der Entnahmekapazität.",
          "Krankenkassenprämien: CHF 3'600–7'200 pro Jahr ohne Arbeitgeberbeitrag, inflationsexponiert.",
          "AHV-Beiträge für Nichterwerbstätige: bis CHF 26'500/Jahr, abhängig vom Vermögen.",
          "Brückenphase: Die ersten Jahre ohne AHV/PK/3a erfordern höhere Entnahmen — die Entnahmerate ist nicht gleichmässig über die Zeit.",
        ],
      },
      { h2: "Die «Swiss FIRE Rate»: 3,0–3,5 %" },
      { p: "Viele Schweizer FIRE-Planer arbeiten mit einer konservativeren Entnahmerate von 3,0–3,5 %. Das berücksichtigt Vermögenssteuer, die höheren Fixkosten in der Brückenphase und Pensionierungen, die 40–50 Jahre dauern können. Die 3,5%-Rate überlebt historisch auch 40-jährige Perioden bei global diversifizierten Portfolios nahezu immer." },
      { h2: "Sequence-of-Returns-Risiko" },
      { p: "Die grösste Gefahr für ein FIRE-Portfolio ist nicht die Durchschnittsrendite — es ist ein starker Crash in den ersten Jahren der Pensionierung. Wenn das Portfolio sinkt, während gleichzeitig Entnahmen stattfinden, entsteht ein Ratchet-Effekt: Man verkauft günstig und profitiert kaum von der Erholung. Monte-Carlo-Simulationen modellieren dieses Risiko explizit." },
      { callout: "Faustregel: Je länger die geplante Pensionierung (bei Frühpension oft 40+ Jahre), desto konservativer sollte die Entnahmerate liegen — und desto wichtiger ist eine Cashreserve für Crash-Jahre." },
      { p: "Der Pillar Zero Rechner zeigt Ihre persönliche nachhaltige Entnahmerate — inklusive AHV-Zeitplan, Kapitalsteuern und Monte-Carlo-Simulation über 10'000 Szenarien." },
    ],
  },
  {
    slug: "ahv-rente-vorbeziehen",
    title: "AHV-Rente vorbeziehen oder aufschieben: was rechnet sich?",
    description:
      "Die AHV kann ab 63 vorzeitig bezogen oder bis 70 aufgeschoben werden. Der Vorbezug kürzt die Rente dauerhaft, der Aufschub erhöht sie. Wann lohnt sich welche Variante?",
    date: "2026-07-01",
    readingMinutes: 5,
    tag: "AHV",
    body: [
      { p: "Mit der AHV21-Reform gilt seit 2024 für Männer und Frauen ein einheitliches Referenzalter von 65. Gleichzeitig wurde die Flexibilität ausgebaut: Die AHV-Rente kann zwischen dem 63. und dem 70. Lebensjahr bezogen werden — zwei Jahre vor dem Referenzalter bis fünf Jahre danach." },
      { h2: "Vorbezug: früher kassieren, dauerhaft weniger" },
      { p: "Wer die AHV ein oder zwei Jahre vor dem Referenzalter bezieht, erhält die Rente früher — aber dauerhaft gekürzt. Die Kürzungssätze:" },
      {
        ul: [
          "1 Jahr früher (ab 64): dauerhaft −6,8 %.",
          "2 Jahre früher (ab 63): dauerhaft −13,6 %.",
        ],
      },
      { callout: "Beispiel: CHF 2'450 Monatsrente regulär → bei 2 Jahren Vorbezug dauerhaft CHF 2'117 (−CHF 333/Monat). Über zwanzig Rentenjahre ergibt das einen Unterschied von rund CHF 80'000." },
      { h2: "Aufschub: weniger zu Beginn, mehr für immer" },
      { p: "Wer die AHV über das Referenzalter hinausschiebt, erhält eine dauerhaft erhöhte Rente. Die offiziellen Aufschubzuschläge aus Merkblatt 3.04 (AHV21):" },
      {
        ul: [
          "1 Jahr Aufschub (bis 66): +5,2 %.",
          "2 Jahre (bis 67): +10,8 %.",
          "3 Jahre (bis 68): +17,1 %.",
          "4 Jahre (bis 69): +24,0 %.",
          "5 Jahre (bis 70): +31,5 %.",
        ],
      },
      { h2: "Die Break-even-Rechnung" },
      { p: "Break-even beim Aufschub: Wie lange muss man leben, um die entgangenen Renten der Aufschubjahre mit der erhöhten Rente zu kompensieren? Bei einem Jahr Aufschub (ab 66, +5,2 %): rund 15 Jahre — Break-even bei ca. 81. Bei fünf Jahren Aufschub (ab 70, +31,5 %): Break-even bei etwa 83." },
      { h2: "Die FIRE-Perspektive" },
      { p: "Für Frührentner, die bereits über Brückenkapital verfügen, ist der Aufschub oft attraktiv: Das Portfolio wird weniger belastet, wenn die AHV-Rente später, aber höher einsetzt. Wer dagegen auf die AHV angewiesen ist, um das Portfolio nicht zu überlasten, wählt den Vorbezug — trotz Kürzung." },
      { callout: "Wichtig: Vorbezug und Aufschub sind unwiderruflich. Die Entscheidung sollte im Kontext des Gesamtplans getroffen werden — inklusive Pensionskassen- und 3a-Timing, Steuern und Lebenserwartungseinschätzung." },
      { p: "Der Pillar-Zero-Rechner modelliert das gewählte AHV-Bezugsalter mit den offiziellen Anpassungssätzen und zeigt, wie die Entscheidung das Portfolio Jahr für Jahr beeinflusst." },
    ],
  },
];

const POSTS_EN: Post[] = [
  {
    slug: "brueckenphase-fruehpensionierung",
    title: "The bridge phase: the gap between early retirement and your pension",
    description:
      "Stop working before 58–65 and you have to bridge a gap before Säule 3a, Pensionskasse and AHV kick in. What this bridge phase costs — and how much capital it really takes.",
    date: "2026-06-02",
    readingMinutes: 6,
    tag: "Basics",
    body: [
      { p: "FIRE — “Financial Independence, Retire Early” — sounds like one single big goal: enough wealth never to have to work again. In Switzerland, though, that is only half the truth, because your pension capital is locked away most of the time." },
      { h2: "Three pots, three points in time" },
      { p: "Your retirement capital sits in three pillars that become accessible at different times:" },
      {
        ul: [
          "Säule 3a: at the earliest five years before the AHV reference age, so typically from 60.",
          "Pensionskasse (pillar 2): depending on the scheme, from 58–60.",
          "AHV (pillar 1): regularly from 65, drawn early from 63 (with a reduction).",
        ],
      },
      { p: "Retire at 50 and you face up to ten years in which not a single one of these pots pays out. That stretch is the bridge phase — and it has to be financed entirely from your freely available, taxable wealth." },
      { h2: "What the bridge costs" },
      { p: "During the bridge phase, costs carry on: living expenses, health insurance premiums and — often overlooked — the AHV contributions for the non-employed. The latter are based on wealth and can run to several thousand francs a year." },
      { p: "“Bridge capital” is the amount you need liquid at exit to cover those years until the first pension withdrawal. That is exactly the figure the Pillar Zero calculator works out first." },
      { callout: "Rule of thumb: the earlier you exit, the longer the bridge — and the more liquid (unlocked) wealth you need on top of your pension capital." },
      { h2: "Why “enough wealth” isn't enough" },
      { p: "Two people with identical total wealth can be in completely different positions: whoever holds the bulk in the Pensionskasse cannot touch it during the bridge phase — whoever holds the same money in a securities account can. The split between liquid and locked wealth decides whether your early retirement holds up." },
      { p: "Work out your own bridge and see, year by year, where your spending is covered from." },
    ],
  },
  {
    slug: "saeule-3a-gestaffelt-beziehen",
    title: "Drawing Säule 3a in stages: how to break the tax progression",
    description:
      "The lump-sum withdrawal tax is progressive and is calculated each year on the total withdrawal. Closing several 3a accounts in different years costs significantly less.",
    date: "2026-06-09",
    readingMinutes: 5,
    tag: "Taxes",
    body: [
      { p: "When you draw Säule 3a, the capital is not added to your normal income but taxed separately, at a reduced rate — the lump-sum withdrawal tax. This tax is progressive: the larger the amount in a single calendar year, the higher the percentage." },
      { h2: "The trick: several accounts, several years" },
      { p: "A single 3a account always has to be closed in full — partial withdrawals are not possible. But if you keep several 3a accounts from the start, you can close them in different calendar years and so keep the taxable amount per year small." },
      { p: "Because the tax is computed each year on the sum of all capital withdrawals, staggering noticeably lowers the progression. Three accounts of CHF 100,000 over three years cost considerably less tax than CHF 300,000 in one go." },
      { callout: "Withdrawals may start five years before the reference age — that gives a window of about five years to stagger the accounts." },
      { h2: "Careful: everything in the same year adds up" },
      { p: "The effect only works if the withdrawals fall in different years. Draw your 3a and a Pensionskasse capital payout in the same calendar year and you are taxed on the sum — landing back in the high progression. Married couples are also assessed jointly in many cantons." },
      { h2: "The federal government wants to change it" },
      { p: "There are political efforts to harmonise the federal tax on capital withdrawals and make staggering less attractive. Until then it remains one of the most effective and entirely legal tax tools of early retirement." },
      { p: "In the Pillar Zero calculator you can set the number of 3a accounts and see directly how staggering affects the tax bill — with real ESTV figures for your municipality." },
    ],
  },
  {
    slug: "ahv-beitraege-nichterwerbstaetige",
    title: "AHV contributions for the non-employed: the underestimated cost of early retirement",
    description:
      "Stop working and you still pay AHV — based on wealth. For wealthy early retirees that can be up to CHF 26,500 per person per year.",
    date: "2026-06-16",
    readingMinutes: 6,
    tag: "AHV",
    body: [
      { p: "A widespread misconception: “Once I stop working, I no longer pay AHV.” The opposite is true. Anyone who stops working before the reference age counts as non-employed — and must keep paying AHV, IV and EO contributions until the reference age." },
      { h2: "Assessed on wealth" },
      { p: "The contributions of the non-employed are based on wealth plus twenty times annual pension income. For someone living purely off a securities portfolio, it is therefore wealth that counts — withdrawals from the account are not “pension income”." },
      {
        ul: [
          "Minimum: CHF 530 per year.",
          "Maximum: CHF 26,500 per year (reached at around CHF 8.4 million of relevant wealth).",
          "In between, the contribution rises with wealth.",
        ],
      },
      { callout: "For married couples each spouse is assessed individually on half of the joint wealth — both pay, in the extreme up to CHF 53,000 together." },
      { h2: "The exception: “sufficiently employed”" },
      { p: "There is an important lever: anyone who remains employed and thereby pays AHV contributions of at least half the otherwise-due non-employed contribution is exempt from it. Even a part-time role or regular mandates can therefore avoid the “AHV on wealth”." },
      { p: "For couples it is enough if one partner is sufficiently employed — that also exempts the non-employed partner." },
      { h2: "Don't forget it — and use it well" },
      { p: "The contributions continue to secure contribution years and thus your later AHV pension; gaps would reduce it. So it is not lost money — but a cost factor that the bridge calculation has to account for. The Pillar Zero calculator models the non-employed contributions including the employment exception." },
    ],
  },
  {
    slug: "pensionskasse-kapital-oder-rente",
    title: "Pensionskasse: capital, pension or a mix?",
    description:
      "When you draw your Pensionskasse you decide, once, between a lifelong pension, capital — or a mix. The choice shapes taxes, flexibility and security for the rest of your life.",
    date: "2026-06-23",
    readingMinutes: 7,
    tag: "Pensionskasse",
    body: [
      { p: "When your Pensionskasse balance falls due, you make one of the most consequential decisions in all of retirement planning: pension, capital or a combination. It is usually irreversible." },
      { h2: "The pension: predictable and lifelong" },
      { p: "The pension is calculated from the balance using the conversion rate (statutory BVG minimum 6.8%, often lower in the supplementary range). It is guaranteed for life and protects against the risk of outliving your capital — but is taxed in full as income." },
      { h2: "The capital: flexible and inheritable" },
      { p: "The capital withdrawal is taxed once at a reduced rate (cantonal/communal plus a fifth of the ordinary federal tariff). The money stays yours — freely investable and inheritable — but you bear the investment and longevity risk yourself." },
      {
        ul: [
          "Pension: maximum security, full income tax, not inheritable.",
          "Capital: maximum flexibility, a one-off capital tax, investment & longevity risk.",
          "Mix: by law at least 25% can be taken as capital — many combine a basic income via pension with a flexible capital portion.",
        ],
      },
      { callout: "There is no universally right answer. Health, other wealth, family situation and risk appetite decide — personal advice is worth it." },
      { h2: "What makes early retirement special" },
      { p: "With an early withdrawal the conversion rate is lower (the pension has to last longer), and the balance had less time to grow. At the same time, a capital withdrawal can fill the liquid bridge you need anyway. Both effects often argue for a (partial) capital withdrawal — but not always." },
      { p: "In the Pillar Zero calculator you set the withdrawal type and conversion rate and see the effect on taxes, liquidity and the reach of your wealth straight away." },
    ],
  },
  {
    slug: "fruehpensionierung-schweiz",
    title: "Early retirement in Switzerland: the complete guide",
    description:
      "Early retirement in Switzerland means more than 'enough money'. Bridge capital, AHV contributions, Pensionskasse timing and taxes all have to work together.",
    date: "2026-06-28",
    readingMinutes: 8,
    tag: "Basics",
    body: [
      { p: "In no other country does the three-pillar system have such a direct impact on the timing and cost of early retirement as in Switzerland. Anyone who stops working before 65 must not merely have 'enough money' — they need to know where that money sits, when they can access it, and which ongoing costs arise regardless of employment status." },
      { h2: "What early retirement in Switzerland means" },
      { p: "Early retirement means leaving the workforce before the three pillars begin to pay out. The AHV reference age has been 65 for both men and women since the AHV21 reform. The Pensionskasse pays out depending on its scheme from 58–60, and Säule 3a at the earliest five years before the reference age. Someone stopping at 50 bridges up to twelve years with no pension income at all." },
      { h2: "The three pillars and when they flow" },
      {
        ul: [
          "AHV (pillar 1): regularly from 65, early draw from 63 with a permanent 6.8% cut per year of early draw.",
          "Pensionskasse (pillar 2): depending on the scheme from 58–60; capital withdrawal taxed as a one-off.",
          "Säule 3a: from 60 at the earliest (five years before reference age); full account closure per account.",
        ],
      },
      { h2: "The five biggest cost factors" },
      { p: "The planning calculation must include five cost blocks, all running in parallel:" },
      {
        ul: [
          "Living costs including inflation — the base of any calculation.",
          "Health insurance premiums — without employer contribution from early retirement, CHF 300–600/month depending on canton.",
          "AHV contributions for the non-employed — based on wealth, between CHF 530 and CHF 26,500 per year.",
          "Taxes — income and wealth tax; a significant factor with high capital income.",
          "One-off capital withdrawal taxes — on Pensionskasse and 3a withdrawals, heavily canton-dependent.",
        ],
      },
      { h2: "How much capital does early retirement need?" },
      { p: "A conservative rule of thumb in Switzerland is a withdrawal rate of 3.0–3.5% of total wealth per year. At annual expenses of CHF 80,000 that gives a target capital of roughly CHF 2.3–2.7 million." },
      { callout: "Important: this capital must be liquid in the right proportion. Whoever holds the bulk in the Pensionskasse cannot access it during the bridge phase. The required free bridge capital depends directly on the exit age." },
      { h2: "Common planning mistakes" },
      {
        ul: [
          "Forgetting AHV non-employed contributions: they fall due from the first day of non-employment.",
          "Too little free capital: too much in the Pensionskasse and too little in the brokerage account leaves you stuck in the bridge phase.",
          "Optimistic withdrawal rate: a rate above 4% carries significant depletion risk over 30+ years.",
          "Not reassessing health insurance: the situation often changes significantly after giving notice.",
        ],
      },
      { h2: "Next steps" },
      {
        ul: [
          "Wealth inventory: how much is free, how much locked (Pensionskasse, 3a)?",
          "Check your Pensionskasse rules: from when is a withdrawal possible, what is the conversion rate?",
          "Compare taxes: cantons differ enormously on capital withdrawal tax.",
          "Run a simulation: model all factors together, including inflation and sequence-of-returns risk.",
        ],
      },
      { p: "The Pillar Zero calculator is the only Swiss FIRE calculator that brings AHV contributions, all three pillars and the bridge phase together in one model." },
    ],
  },
  {
    slug: "barista-fire-schweiz",
    title: "Barista-FIRE in Switzerland: how a part-time job eliminates the wealth-based AHV",
    description:
      "A small employment income in early retirement sounds like a compromise — but in Switzerland it is a tax turbo: it eliminates the wealth-based AHV contribution entirely.",
    date: "2026-06-30",
    readingMinutes: 6,
    tag: "Strategies",
    body: [
      { p: "In the Anglo-Saxon FIRE world, Barista-FIRE describes a strategy in which you retire early with a slightly smaller capital base and take on a part-time role — originally alluding to baristas at Starbucks who receive health insurance through their employer. In Switzerland the strategy has a distinct and particularly powerful lever: the AHV half-rule." },
      { h2: "The AHV problem of pure early retirement" },
      { p: "Anyone who is no longer employed pays AHV based on wealth — progressively and independently of actual consumption. At a wealth of CHF 1.5 million that is around CHF 3,740 per year; at CHF 3 million already CHF 7,954. These contributions run from early retirement to reference age 65 — fifteen years if you exit at 50." },
      { h2: "The half-rule (Art. 28bis AHVV)" },
      { p: "The law contains a precise exception: anyone who is employed and thereby pays AHV contributions of at least half the otherwise-due non-employed contribution is fully exempt from the wealth-based AHV." },
      { callout: "Example: wealth CHF 1.5 million → non-employed contribution approx. CHF 3,740/year → minimum AHV contribution from employment: CHF 1,870 → corresponds to a gross employment income of about CHF 17,600/year (10.6% contribution rate). A small part-time role is enough." },
      { h2: "What counts as employment income" },
      {
        ul: [
          "On-call employment, even a few hours per week.",
          "Independent consulting or freelance mandates.",
          "Board of directors mandates with compensation.",
          "Honoraria for talks, writing, coaching.",
          "Rental income from real estate does not count as employment income.",
        ],
      },
      { h2: "The portfolio impact" },
      { p: "The effect is significant: without Barista income, roughly CHF 56,100 flows into the wealth-based AHV over fifteen years (at CHF 1.5 million, inflation-adjusted). With a small employment income, these costs drop to the ordinary employer/employee AHV contributions — often less than CHF 600 per year in your own share." },
      { h2: "More than just tax optimisation" },
      { p: "Studies on retirement satisfaction consistently show that structured activity and social engagement improve wellbeing in retirement. A 20% mandate as a consultant or building a small side project can be combined with travel and freedom — while also securing contribution years for the later AHV pension." },
      { p: "In the Pillar Zero calculator you can activate Barista-FIRE mode: the calculator shows the break-even income for your specific wealth situation and works out the impact on portfolio longevity." },
    ],
  },
  {
    slug: "vier-prozent-regel-schweiz",
    title: "The 4% rule: foundation of FIRE — and where Switzerland diverges",
    description:
      "The 4% rule is the most-cited principle in FIRE. It comes from US data — Swiss investors must factor in wealth tax, CHF inflation and the bridge phase.",
    date: "2026-07-01",
    readingMinutes: 7,
    tag: "Basics",
    body: [
      { p: "\"Withdraw 4% of your starting portfolio each year, adjust for inflation — and the capital lasts at least 30 years.\" This conclusion from the Trinity Study (1998) is the most-cited principle in FIRE. But the study is based on US equities and US bonds, measured in US dollars. For Swiss investors, there are important adjustments." },
      { h2: "What the 4% rule says" },
      { p: "William Bengen analysed historical US market returns in 1994 and found: anyone withdrawing at most 4% of their starting portfolio per year (inflation-adjusted) has essentially never run out of money over any historical 30-year period. The Trinity Study confirmed this with a 50/50 to 75/25 equity/bond mix." },
      { callout: "The study defined 'success' as: portfolio survives 30 years. It says nothing about what is left after 30 years — and nothing about 40- or 50-year periods, as can arise from retiring early at 40." },
      { h2: "Why US data cannot be transferred directly" },
      { p: "The US has had historically exceptional equity market returns by global standards. A globally diversified portfolio — sensible for Swiss investors — shows somewhat lower long-run returns. At the same time, Swiss inflation has historically been lower (1.5–2% vs. 3–4% in the US), which partially compensates the real return." },
      { h2: "What makes Switzerland special" },
      {
        ul: [
          "Wealth tax: depending on canton 0.1–0.7% of net wealth per year — a direct deduction from withdrawal capacity.",
          "Health insurance premiums: CHF 3,600–7,200 per year without employer contribution, inflation-exposed.",
          "AHV contributions for the non-employed: up to CHF 26,500/year, depending on wealth.",
          "Bridge phase: the first years without AHV/Pensionskasse/3a require higher withdrawals — the rate is not uniform over time.",
        ],
      },
      { h2: "The 'Swiss FIRE Rate': 3.0–3.5%" },
      { p: "Many Swiss FIRE planners work with a more conservative withdrawal rate of 3.0–3.5%. This accounts for wealth tax, the higher fixed costs during the bridge phase, and retirements that can last 40–50 years. The 3.5% rate survives historically even 40-year periods with a globally diversified portfolio almost without exception." },
      { h2: "Sequence-of-returns risk" },
      { p: "The biggest danger to a FIRE portfolio is not the average return — it is a severe crash in the early years of retirement. When the portfolio falls while withdrawals are happening simultaneously, a ratchet effect arises: you sell cheaply and barely benefit from the recovery. Monte Carlo simulations model this risk explicitly." },
      { callout: "Rule of thumb: the longer the planned retirement (often 40+ years for early retirees), the more conservative the withdrawal rate should be — and the more important a cash reserve for crash years." },
      { p: "The Pillar Zero calculator shows your personal sustainable withdrawal rate — including the AHV timeline, capital taxes, and a Monte Carlo simulation over 10,000 scenarios." },
    ],
  },
  {
    slug: "ahv-rente-vorbeziehen",
    title: "Drawing or deferring the AHV pension: what pays off?",
    description:
      "The AHV can be drawn early from 63 or deferred until 70. Early draw cuts the pension permanently; deferral increases it. When is which variant worth it?",
    date: "2026-07-01",
    readingMinutes: 5,
    tag: "AHV",
    body: [
      { p: "With the AHV21 reform, a uniform reference age of 65 for men and women has applied since 2024. At the same time, flexibility was expanded: the AHV pension can be drawn between age 63 and 70 — two years before the reference age until five years after." },
      { h2: "Early draw: collect sooner, permanently less" },
      { p: "Anyone drawing the AHV one or two years before the reference age receives the pension earlier — but permanently reduced. The reduction rates:" },
      {
        ul: [
          "1 year early (from 64): permanently −6.8%.",
          "2 years early (from 63): permanently −13.6%.",
        ],
      },
      { callout: "Example: CHF 2,450 monthly pension at reference age → with 2 years of early draw permanently CHF 2,117 (−CHF 333/month). Over twenty pension years that is a difference of around CHF 80,000." },
      { h2: "Deferral: less at first, more forever" },
      { p: "Anyone deferring the AHV beyond the reference age receives a permanently higher pension. The official deferral supplements from Merkblatt 3.04 (AHV21):" },
      {
        ul: [
          "1 year deferral (to 66): +5.2%.",
          "2 years (to 67): +10.8%.",
          "3 years (to 68): +17.1%.",
          "4 years (to 69): +24.0%.",
          "5 years (to 70): +31.5%.",
        ],
      },
      { h2: "The break-even calculation" },
      { p: "Break-even for deferral: how long must you live to compensate the foregone pension income of the deferral years with the higher pension? For one year of deferral (from 66, +5.2%): roughly 15 years — i.e. break-even at around 81. For five years of deferral (from 70, +31.5%): break-even at approximately 83." },
      { h2: "The FIRE perspective" },
      { p: "For early retirees who already have bridge capital, deferral is often attractive: the portfolio is less burdened when the AHV pension starts later but higher. Whoever relies on the AHV to avoid overloading the portfolio chooses early draw — despite the cut." },
      { callout: "Important: early draw and deferral are irrevocable. The decision should be made in the context of the overall plan — including Pensionskasse and 3a timing, taxes and life-expectancy assumptions." },
      { p: "The Pillar Zero calculator models the chosen AHV draw age with the official adjustment rates and shows how the decision affects the portfolio year by year." },
    ],
  },
];

const POSTS_BY_LOCALE: Record<Locale, Post[]> = { de: POSTS_DE, en: POSTS_EN };

/** All posts for a locale, newest first. */
export function postsSorted(locale: Locale): Post[] {
  return [...POSTS_BY_LOCALE[locale]].sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** All slugs (locale-independent — slugs are shared across languages). */
export function allSlugs(): string[] {
  return POSTS_DE.map((p) => p.slug);
}

export function getPost(locale: Locale, slug: string): Post | undefined {
  return POSTS_BY_LOCALE[locale].find((p) => p.slug === slug);
}
