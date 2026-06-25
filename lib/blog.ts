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

const POSTS_EN: Post[] = [
  {
    slug: "brueckenphase-frühpensionierung",
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
      { p: "“Bridge capital” is the amount you need liquid at exit to cover those years until the first pension withdrawal. That is exactly the figure the Vorzeit calculator works out first." },
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
      { p: "In the Vorzeit calculator you can set the number of 3a accounts and see directly how staggering affects the tax bill — with real ESTV figures for your municipality." },
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
      { p: "The contributions continue to secure contribution years and thus your later AHV pension; gaps would reduce it. So it is not lost money — but a cost factor that the bridge calculation has to account for. The Vorzeit calculator models the non-employed contributions including the employment exception." },
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
      { p: "In the Vorzeit calculator you set the withdrawal type and conversion rate and see the effect on taxes, liquidity and the reach of your wealth straight away." },
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
