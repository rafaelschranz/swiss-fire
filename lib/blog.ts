/**
 * Blog content. Posts are structured data (no MDX toolchain needed) rendered by
 * a shared article layout. Educational only — figures are 2026 estimates "ohne
 * Gewähr", consistent with the calculator's documented model.
 */

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

export const POSTS: Post[] = [
  {
    slug: "brueckenphase-frühpensionierung",
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
      { p: "Das «Brückenkapital» ist der Betrag, den Sie zum Ausstieg liquide brauchen, um diese Jahre bis zum ersten Vorsorge-Bezug zu decken. Genau diese Zahl rechnet der Vorzeit-Rechner als Erstes aus." },
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
      { p: "Im Vorzeit-Rechner können Sie die Anzahl 3a-Konten einstellen und sehen direkt, wie sich die Staffelung auf die Steuerrechnung auswirkt — mit echten ESTV-Werten für Ihre Gemeinde." },
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
      { p: "Die Beiträge sichern weiterhin Beitragsjahre und damit die spätere AHV-Rente; Lücken würden die Rente kürzen. Es ist also kein verlorenes Geld — aber ein Kostenfaktor, den die Brückenrechnung berücksichtigen muss. Der Vorzeit-Rechner modelliert die Nichterwerbstätigen-Beiträge inklusive der Erwerbstätigen-Ausnahme." },
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
      { p: "Im Vorzeit-Rechner stellen Sie Bezugsart und Umwandlungssatz ein und sehen sofort die Auswirkung auf Steuern, Liquidität und Reichweite Ihres Vermögens." },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export const POSTS_SORTED = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
