/**
 * Canonical German dictionary. This object's shape defines `Dictionary`
 * (see ../dictionaries.ts); the English dictionary must match it structurally.
 * Values are plain strings (no functions) so the dictionary can be serialised
 * across the server→client boundary. Runtime values use `{placeholder}` tokens
 * resolved with `tpl()` at the call site.
 */
export const de = {
  common: {
    skipToContent: "Zum Hauptinhalt springen",
    brandKicker: "Schweizer FIRE",
    tagline: "Frühpensionierung in der Schweiz, durchgerechnet.",
    ctaCalc: "Jetzt rechnen",
    menu: "Menü",
    you: "Sie",
    partner: "Partner:in",
    nav: {
      rechner: "Rechner",
      blog: "Blog",
      ratgeber: "Ratgeber",
      ueberUns: "Über uns",
    },
    legal: {
      impressum: "Impressum",
      datenschutz: "Datenschutz",
    },
    footer: {
      blurb:
        "Der unabhängige Schweizer Rechner für die Frühpensionierung — Brückenphase, Vorsorge und echte Steuern, transparent durchgerechnet.",
      navHeading: "Navigation",
      legalHeading: "Rechtliches",
      disclaimer:
        "Ausschliesslich zu Bildungszwecken. Keine Finanz-, Steuer- oder Anlageberatung. Alle Steuerangaben sind Schätzungen ohne Gewähr. Berechnungen laufen lokal im Browser; es werden keine Eingaben an einen Server übertragen.",
      rights: "Alle Rechte vorbehalten.",
    },
    langSwitch: "Sprache wechseln",
    disclaimer: {
      title: "Keine Finanzberatung",
      body:
        "Dieses Tool ist ausschliesslich zu Bildungszwecken gedacht. Es liefert keine persönliche Finanz-, Steuer- oder Anlageberatung und keine Empfehlung. Alle Ausgaben basieren ausschliesslich auf den von Ihnen eingegebenen Annahmen — «hier ist die Rechnung basierend auf Ihren Angaben», nicht «das sollten Sie tun». Alle Steuerangaben sind Schätzungen — bitte mit dem offiziellen ESTV- oder kantonalen Steuerrechner verifizieren. Ihre Eingaben verbleiben ausschliesslich in Ihrem Browser und werden nie an einen Server übertragen.",
    },
  },

  meta: {
    titleDefault: "Vorzeit | Frühpensionierung & Pensionskasse",
    titleTemplate: "%s | Vorzeit",
    description:
      "Vorzeit ist der kostenlose Schweizer Rechner für die Frühpensionierung: Brückenphase, Säule 3a, Pensionskasse, AHV und echte ESTV-Steuern pro Gemeinde. Bildungstool, keine Finanzberatung — alle Berechnungen laufen lokal im Browser.",
    keywords: [
      "FIRE Schweiz",
      "Frühpensionierung",
      "Brückenphase",
      "Säule 3a",
      "Pensionskasse",
      "BVG",
      "AHV",
      "Kapitalbezug Steuern",
      "finanzielle Unabhängigkeit",
    ],
  },

  home: {
    meta: {
      title: "Frühpensionierung in der Schweiz berechnen",
      description:
        "Vorzeit zeigt Ihnen in vier Schritten, ob Ihr Kapital für die Frühpensionierung reicht — Brückenphase, Säule 3a, Pensionskasse, AHV und echte ESTV-Steuern pro Gemeinde. Kostenlos und privat.",
    },
    hero: {
      kicker: "Vorzeit · Schweizer FIRE",
      h1: "Reicht Ihr Kapital für die Frühpensionierung?",
      body:
        "Vorzeit rechnet die Brücke zwischen Ihrem Ausstieg und dem Zugriff auf Säule 3a, Pensionskasse und AHV — inklusive echter ESTV-Steuern für Ihre Gemeinde. In vier Schritten, kostenlos und vollständig privat.",
      ctaPrimary: "Jetzt kostenlos rechnen →",
      ctaSecondary: "Zum Ratgeber",
      note: "Bildungstool, keine Finanzberatung · keine Anmeldung · keine Daten verlassen den Browser",
    },
    problem: {
      kicker: "Das Problem",
      h2: "Ihr Vorsorgevermögen ist gesperrt — genau dann, wenn Sie es brauchen.",
      body:
        "Wer früh aufhört, muss die Jahre bis 58–65 überbrücken, bevor die drei Säulen greifen. Diese Brückenphase entscheidet, ob die Frühpension trägt.",
      cards: [
        {
          k: "Brückenphase",
          v: "Ausstieg → 58/60",
          d: "Nur das frei verfügbare Vermögen steht zur Verfügung. Säule 3a und PK sind gesperrt.",
        },
        {
          k: "Vorsorge-Bezug",
          v: "ab 58–60",
          d: "Pensionskasse und Säule 3a werden zugänglich — gestaffelt geplant, spart das Steuern.",
        },
        {
          k: "AHV",
          v: "ab 63–65",
          d: "Die AHV-Rente setzt ein und reduziert den Bedarf aus dem eigenen Vermögen.",
        },
      ],
    },
    features: {
      kicker: "Was Vorzeit rechnet",
      h2: "Alles, was die Schweizer Frühpension ausmacht.",
      items: [
        {
          title: "Brückenkapital",
          body: "Wie viel liquides Vermögen Sie brauchen, um die Jahre bis zum ersten Vorsorge-Bezug zu überbrücken.",
        },
        {
          title: "Echte Steuern pro Gemeinde",
          body: "Einkommens-, Vermögens- und Kapitalsteuer mit realen ESTV-Werten 2026 — für jede der 2'110 Gemeinden.",
        },
        {
          title: "Säule 3a · PK · AHV",
          body: "Gestaffelter 3a-Bezug, Pensionskasse als Kapital oder Rente, AHV-Vorbezug und die AHV-Beiträge aufs Vermögen.",
        },
        {
          title: "Monte-Carlo mit echten Daten",
          body: "Wie robust ist der Plan? Simulation auf Basis realer Schweizer Aktien- und Obligationenrenditen seit 1900.",
        },
        {
          title: "Auch für Paare",
          body: "Zwei Profile mit eigenem Ausstiegsalter, eigener Vorsorge — als Haushalt durchgerechnet, inkl. AHV-Plafonierung.",
        },
        {
          title: "Lokal & privat",
          body: "Alle Berechnungen laufen in Ihrem Browser. Es werden keine Eingaben an einen Server übertragen.",
        },
      ],
    },
    steps: {
      kicker: "So funktioniert's",
      h2: "In vier Schritten zum Ergebnis.",
      cta: "Rechner öffnen →",
      items: [
        { n: "01", title: "Über Sie", body: "Alter, geplantes Ausstiegsalter, Kanton und Gemeinde." },
        { n: "02", title: "Vermögen & Einkommen", body: "Depot, Säule 3a, Pensionskasse, Salär und Sparrate." },
        { n: "03", title: "Ruhestand", body: "Ausgaben, Renten, Bezugsalter und Bezugsart der Vorsorge." },
        { n: "04", title: "Ergebnis", body: "Reicht das Kapital? Mit Zeitlinie, Steuern und Jahresverlauf." },
      ],
    },
    blogTeaser: {
      kicker: "Aus dem Blog",
      h2: "Wissen für die Frühpension.",
      all: "Alle Beiträge →",
      readingSuffix: "Min. Lesezeit",
    },
    faq: {
      kicker: "Häufige Fragen",
      h2: "Gut zu wissen.",
      items: [
        {
          q: "Was kostet Vorzeit?",
          a: "Nichts. Der Rechner ist kostenlos und ohne Anmeldung nutzbar. Es gibt keine kostenpflichtige Version.",
        },
        {
          q: "Werden meine Eingaben gespeichert?",
          a: "Nein. Sämtliche Berechnungen laufen lokal in Ihrem Browser. Es werden keine Finanzdaten an einen Server übertragen.",
        },
        {
          q: "Wie genau sind die Steuern?",
          a: "Die Kapital-, Einkommens- und Vermögenssteuer beruhen auf echten Werten des offiziellen ESTV-Steuerrechners (2026), pro Gemeinde skaliert. Die direkte Bundessteuer wird mit dem exakten Tarif berechnet. Es bleiben Vereinfachungen (z. B. Abzüge) — die Angaben sind Schätzungen ohne Gewähr.",
        },
        {
          q: "Ist das eine Finanzberatung?",
          a: "Nein. Vorzeit ist ein Bildungstool. Es ersetzt keine persönliche Finanz-, Steuer- oder Vorsorgeberatung.",
        },
      ],
    },
    finalCta: {
      h2: "Rechnen Sie Ihre Brücke durch.",
      body: "Kostenlos, in wenigen Minuten, ohne dass Daten Ihren Browser verlassen.",
      cta: "Jetzt starten →",
    },
  },

  calculator: {
    meta: {
      title: "Brückenrechner — Frühpensionierung berechnen",
      description:
        "Berechnen Sie in vier Schritten, ob Ihr Kapital für die Frühpensionierung reicht: Brückenphase, Säule 3a, Pensionskasse, AHV und echte ESTV-Steuern pro Gemeinde. Kostenlos, lokal im Browser.",
      ogTitle: "Brückenrechner — Frühpensionierung berechnen",
    },
    jsonLdName: "Vorzeit Brückenrechner",
    formHero: {
      kicker: "Schweizer Frühpensionierung · Brückenrechnung",
      h1: "Reicht Ihr Kapital bis zur Pension?",
      body:
        "In vier Schritten zur Brückenrechnung zwischen Frühpensionierung und dem Zugriff auf Säule 3a, Pensionskasse und AHV — inklusive Steuerschätzung pro Kanton.",
    },
    nav: { back: "← Zurück", next: "Weiter →", compute: "Ergebnis berechnen →" },
    formFootnote: "Bildungstool, keine Finanzberatung. Alle Berechnungen laufen lokal in Ihrem Browser.",
    results: {
      kicker: "Dossier · Ergebnis",
      h1: "Ihre Brückenrechnung",
      share: "Szenario teilen",
      shareDone: "Link kopiert ✓",
      edit: "Eingaben anpassen",
    },
    sections: {
      capital: "Vermögen bei FIRE",
      timeline: "Zeitlinie",
      balance: "Vermögensverlauf",
      outflow: "Mittelverwendung pro Jahr",
      monteCarlo: "Monte-Carlo",
      yearTable: "Jahresverlauf",
      assumptions: "Annahmen & Quellen",
      providers: "Anbieter",
    },
    capital: {
      body:
        "Zusammensetzung des projizierten Vermögens zum Ausstieg. In der Brückenphase steht nur das steuerbare Vermögen zur Verfügung — Säule 3a und Pensionskasse sind bis zum Bezugsalter gesperrt.",
      segTaxable: "Steuerbar",
      seg3a: "Säule 3a",
      segPk: "Pensionskasse",
    },
    balance: {
      partnerNote:
        "Gezeigt wird das gemeinsame Haushaltsvermögen auf Ihrer Alters-Achse. Mit «·P» markierte Meilensteine gehören zur Partner:in (in Steel), Ihre eigenen in Brass/Grau.",
    },
    outflow: {
      body:
        "Wie viel Geld wird im Ruhestand jährlich verbraucht und woraus es gedeckt wird. Standardmässig in heutiger Kaufkraft (real) — alle Berechnungen laufen real, daher beeinflusst die Teuerung nur die optionale nominale Darstellung. Die AHV-Rente reduziert ab Bezug den Eigenbedarf.",
    },
    monteCarlo: {
      groupAria: "Monte-Carlo-Modus",
      off: "Aus",
      parametric: "Parametrisch",
      historical: "Historisch",
      intro: "Wie robust ist der Plan gegenüber schwankenden Renditen?",
      introHistorical:
        " Der historische Modus zieht Renditen aus realen Langfristkennzahlen — Schweizer Aktien & Obligationen (Pictet) und globale Aktien (UBS/DMS) — gemischt nach Aktienquote und Ihrem Schweiz-/Global-Anteil.",
      introParametric: " Der parametrische Modus verwendet Ihre erwartete Rendite und Volatilität (lognormal).",
    },
    yearTable: {
      body:
        "Jedes Jahr im Detail — Vermögen je Topf, Renten, AHV-Beiträge und Steuern. Als CSV exportierbar zur Weiterverarbeitung in einer Tabellenkalkulation.",
    },
    barista: {
      kicker: "Der AHV-Hack",
      heading: "Barista-FIRE: die AHV aufs Vermögen umgehen",
      intro:
        "Wer ohne Erwerb früh in Rente geht, zahlt bis zum Referenzalter AHV nach Vermögen. Ein kleiner Nebenjob kann diesen Beitrag streichen — aber nur, wenn die AHV-Beiträge daraus (10,6 %) mindestens die Hälfte des sonst fälligen Beitrags erreichen (gesetzliche Halbierungsregel). Genau das rechnet dieses Feld ehrlich durch.",
      tileExposure: "AHV aufs Vermögen (Brücke)",
      tileExposureNote: "bis {peak}/Jahr",
      tileBreakEven: "Nötiges Nebeneinkommen",
      tileBreakEvenNote: "um sie ganz zu streichen",
      tileSaved: "Dadurch gespart",
      tileAtStake: "Auf dem Spiel",
      verdictOff:
        "Mit einem Nebenjob, der mindestens {breakEven}/Jahr einbringt, fällt diese Vermögens-AHV vollständig weg. Aktivieren Sie Barista-FIRE im Schritt «Ruhestand», um es durchzurechnen.",
      verdictShort:
        "Ihr Nebenjob ({income}) reicht noch nicht: Um die Vermögens-AHV in den teuersten Brückenjahren zu streichen, müssten Sie mindestens {breakEven}/Jahr verdienen.",
      verdictCoveredFull: "✓ Ihr Sackgeld-Job streicht die gesamte Vermögens-AHV über die Brücke — rund {savings} gespart.",
      verdictCoveredPartial:
        "✓ Ihr Sackgeld-Job streicht einen Teil der Vermögens-AHV (rund {savings}); in den vermögendsten Jahren reicht das Einkommen noch nicht ganz.",
      ruleNote:
        "Ehrlich gerechnet: Die populäre «CHF 514 genügt»-Behauptung stimmt nur bei bescheidenem Vermögen. Massgebend ist die Halbierungsregel (Art. 28bis AHVV) — bei hohem Vermögen braucht es ein entsprechend höheres Nebeneinkommen.",
      householdNote:
        "Im Haushalt befreit der Nebenjob jeder Person nur deren eigenen Vermögensbeitrag (keine gegenseitige Deckung). Gezeigt ist die gemeinsame Vermögens-AHV über die Brücke.",
    },
  },

  wizard: {
    progressAria: "Fortschritt",
    units: { years: "Jahre", perYear: "/Jahr", accounts: "Konten", chf: "CHF" },
    field: {
      estimatedOn: "Geschätzt ●",
      estimatedOff: "Schätzen ○",
      toggleAria: "{label} automatisch schätzen",
    },
    estimateLabels: {
      horizonAge: "Standard-Planungshorizont (95).",
      ahvReferenceAge: "Gesetzliches Referenzalter (65).",
      ahvClaimAge: "Bezug am Referenzalter angenommen.",
      pillar3aUnlockAge: "5 Jahre vor dem Referenzalter.",
      earliestPkAge: "Üblicher früheste PK-Bezug (58).",
      ahvAnnualPension: "Aus Referenzalter & Zivilstand geschätzt — bitte mit AHV-Auszug prüfen.",
      annualPillar3aContribution: "Maximalbeitrag mit Pensionskasse.",
      healthInsuranceAnnualPremium: "Grobe Pauschale pro Person.",
      pillar2ConversionRate: "BVG-Minimum 6,8 %, gekürzt um ~0,1 %-Pkt. je Jahr Vorbezug — Näherung, Reglement prüfen.",
      expectedReturn: "Aus Ihrer Allokation & realen Langfristkennzahlen (Pictet/UBS) berechnet.",
      volatility: "Portfolio-Volatilität aus der Allokation (reale Kennzahlen) berechnet.",
    },
    incomePhases: {
      phaseLabel: "Phase {n} · Alter {start}–{end}",
      fireEnd: "FIRE ({age})",
      remove: "Entfernen",
      fromAge: "Ab Alter",
      grossSalary: "Bruttosalär",
      taxableSavings: "Sparbetrag (steuerbar)",
      contribution3a: "3a-Einzahlung",
      add: "+ Phase hinzufügen",
    },
    oneOff: {
      empty: "Noch keine Zuflüsse. Fügen Sie z. B. eine erwartete Erbschaft oder einen Liegenschaftsverkauf hinzu.",
      label: "Zufluss {n}",
      remove: "Entfernen",
      atAge: "Im Alter",
      amount: "Betrag",
      add: "+ Zufluss hinzufügen",
    },
    steps: {
      you: {
        title: "Über Sie",
        subtitle: "Wann steigen Sie aus und wo wohnen Sie?",
        currentAge: "Aktuelles Alter",
        fireAge: "FIRE-Alter (Ausstieg)",
        horizonAge: "Planungshorizont",
        horizonHint: "Bis zu welchem Alter soll das Geld reichen?",
        maritalStatus: "Zivilstand",
        single: "Alleinstehend",
        married: "Verheiratet",
        canton: "Steuerkanton",
        cantonHint: "Einkommens-, Vermögens- und Kapitalsteuer: echte ESTV-Werte 2026.",
        gemeinde: "Gemeinde",
        gemeindeHint:
          "Echte ESTV-Steuerfüsse 2026; in % des Kantonshauptorts. Skaliert die kantonalen/kommunalen Steuern exakt auf Ihre Gemeinde.",
        confession: "Konfession (Kirchensteuer)",
        confessionNone: "Keine / konfessionslos",
        confessionProtestant: "Evangelisch-reformiert",
        confessionRoman: "Römisch-katholisch",
        confessionHint:
          "Bei Kirchenmitgliedschaft kommt die Kirchensteuer Ihrer Gemeinde hinzu (echter ESTV-Steuerfuss).",
        planTogether: "Gemeinsam planen",
        planTogetherAria: "Haushalt mit Partner:in",
        alone: "Alleine",
        withPartner: "Mit Partner:in",
        partnerAge: "Alter Partner:in",
        partnerFireAge: "FIRE-Alter Partner:in",
        partnerIntro:
          "Beziehen Sie eine zweite Person mit eigenem Salär, eigenen Säulen und eigenem Ausstiegsalter ein. Vermögen und Lebenshaltungskosten werden dann als Haushalt gerechnet.",
      },
      wealth: {
        title: "Vermögen & Einkommen",
        subtitle: "Aktuelle Guthaben sowie Salär und Sparrate bis zum Ausstieg.",
        householdBanner: "Haushaltsvermögen heute",
        taxableNow: "Steuerbares Vermögen heute",
        pillar3aNow: "Säule-3a-Guthaben heute",
        pillar2Now: "Pensionskasse-Guthaben heute",
        salarySavings: "Salär & Sparrate",
        incomeModeAria: "Einkommensmodus {who}",
        constant: "Konstant",
        phases: "Phasen",
        phasesLong: "Nach Altersphasen",
        grossSalary: "Bruttosalär",
        salaryGrowth: "Salärwachstum (real)",
        taxableSavings: "Sparbetrag (steuerbar)",
        contribution3a: "3a-Einzahlung",
        pkBuildupShort: "PK-Aufbau",
        pkBuildup: "Pensionskasse-Aufbau",
        pkModelAria: "Pensionskassen-Modell {who}",
        pkModelAriaSingle: "Pensionskassen-Modell",
        bvgMin: "BVG-Minimum",
        avgContribution: "Ø Sparbeitrag",
        avgPkContribution: "Ø PK-Sparbeitrag",
        avgPkContributionHint: "Anteil des versicherten Lohns pro Jahr.",
        insuredCeiling: "Versicherter Lohn bis",
        insuredCeilingHint: "Bis zu diesem Lohn versichert Ihre Kasse — über 90'720 nur bei überobligatorischer Vorsorge.",
        pkRateNote:
          "Ein durchschnittlicher jährlicher Sparbeitrag (Arbeitnehmer + Arbeitgeber) in % des versicherten Lohns — wird mit dem Einkommen mitskaliert.",
        pkBvgNote:
          "Gesetzliche Altersgutschriften (7–18 % je nach Alter) auf dem versicherten Lohn. Für höhere Einkommen mit überobligatorischer Vorsorge «Ø Sparbeitrag» wählen.",
        incomePhasesNote:
          "Definieren Sie Salär und Sparrate je Altersphase — ideal, wenn Ihr Einkommen über die Jahre stark steigt.",
        incomeSimpleNote:
          "Ein gleichbleibendes Salär mit realem Wachstum (siehe Feinabstimmung). Für stark steigende Einkommen auf «Nach Altersphasen» wechseln.",
        otherWealthHousehold: "Übriges Nettovermögen (Haushalt)",
        otherWealth: "Übriges Nettovermögen",
        otherWealthHint:
          "Z. B. Liegenschaft abzüglich Hypothek. Zählt für Vermögenssteuer & AHV aufs Vermögen, ist aber nicht liquide.",
        oneOffHeading: "Einmalige Zuflüsse (z. B. Erbschaft)",
        oneOffNoteHousehold:
          "Optionale Einmalbeträge, die in einem bestimmten Alter dem gemeinsamen steuerbaren Vermögen gutgeschrieben werden (auf der Alters-Zeitachse der ersten Person).",
        oneOffNote:
          "Optionale Einmalbeträge, die in einem bestimmten Alter dem steuerbaren Vermögen gutgeschrieben werden.",
      },
      retirement: {
        title: "Ruhestand",
        subtitle: "Ausgaben, Renten und ab wann die Säulen verfügbar sind.",
        livingHousehold: "Lebenshaltungskosten (Haushalt)",
        livingHouseholdHint: "Gemeinsame Ausgaben in heutiger Kaufkraft (Krankenkasse je Person separat unten).",
        living: "Lebenshaltungskosten",
        livingHint: "In heutiger Kaufkraft.",
        healthPremium: "Krankenkassenprämie",
        ahvPension: "Erwartete AHV-Rente",
        ahvPensionHint: "Bei Ehepaaren ist die Summe beider Renten auf 150 % der Maximalrente plafoniert.",
        ahvClaimAge: "AHV-Bezug ab",
        ahvReferenceAge: "AHV-Referenzalter",
        pillar3aUnlock: "Säule 3a verfügbar ab",
        pillar3aTranches: "Säule-3a-Konten (gestaffelt)",
        pillar3aTranchesHint:
          "Auf mehrere 3a-Konten verteilt und in getrennten Jahren bezogen — bricht die Progression der Kapitalauszahlungssteuer.",
        earliestPk: "Pensionskasse verfügbar ab",
        pkPayout: "Pensionskasse-Bezug",
        pkPayoutAria: "Pensionskassen-Bezugsart {who}",
        pkPayoutAriaSingle: "Pensionskassen-Bezugsart",
        capital: "Kapital",
        pension: "Rente",
        mixed: "Gemischt",
        conversionRate: "Umwandlungssatz",
        conversionRateHint: "BVG-Minimum 6,8 %; überobligatorisch oft tiefer.",
        capitalShare: "Kapitalanteil",
        capitalShareHint: "Anteil als Kapital; Rest wird verrentet.",
        payoutNoteCapital:
          "Das ganze PK-Guthaben wird als Kapital bezogen (einmalig zum reduzierten Kapitalsteuersatz) und ins frei verfügbare Vermögen überführt.",
        payoutNotePension:
          "Das ganze PK-Guthaben wird in eine lebenslange Rente umgewandelt (Guthaben × Umwandlungssatz pro Jahr). Die Rente ist steuerbares Einkommen.",
        payoutNoteMixed:
          "Ein Teil wird als Kapital bezogen, der Rest verrentet. Gesetzlich sind mindestens 25 % als Kapital beziehbar.",
        payoutNote3a: " Die Säule 3a wird gesetzlich immer als Kapital bezogen.",
        postFire: "Nach Ausstieg noch erwerbstätig?",
        postFireAria: "Erwerbstätigkeit nach FIRE",
        no: "Nein",
        partTime: "Teilzeit / Mandate",
        postFireNote:
          "Wer nach dem Ausstieg noch genug verdient, zahlt keine Nichterwerbstätigen-AHV («AHV aufs Vermögen»): Sind die AHV-Beiträge aus der Erwerbstätigkeit (10,6 %) mindestens halb so hoch wie der sonst fällige Nichterwerbstätigen-Beitrag, entfällt dieser. Das Erwerbseinkommen reduziert zudem den Kapitalbezug und wird als Einkommen besteuert.",
        postFireIncome: "Erwerbseinkommen (brutto)",
        postFireUntil: "Erwerbstätig bis Alter",
        barista: "Barista-FIRE: kleiner Nebenjob?",
        baristaAria: "Barista-FIRE Nebenjob",
        baristaYes: "Ja, Sackgeld-Job",
        baristaNote:
          "Der bekannte «Sackgeld-Job»-Hebel: Ein kleiner Nebenerwerb kann die Nichterwerbstätigen-AHV («AHV aufs Vermögen») streichen — aber nur, wenn die AHV-Beiträge daraus (10,6 %) mindestens die Hälfte des sonst fälligen Vermögensbeitrags erreichen. Bei viel Vermögen braucht es also ein höheres Einkommen als oft behauptet.",
        baristaIncome: "Nebeneinkommen (brutto)",
        baristaIncomeHint:
          "Gilt von der Frühpensionierung bis zum AHV-Referenzalter. Das Ergebnis zeigt, ob es die wealth-basierte AHV tatsächlich streicht.",
        baristaIncomeHintHousehold:
          "Sackgeld-Job dieser Person bis zum Referenzalter (0 = keiner). Befreit nur den eigenen Vermögensbeitrag (Halbierungsregel).",
      },
      assumptions: {
        title: "Feinabstimmung",
        subtitle: "Optional — sinnvolle Standardwerte sind bereits gesetzt.",
        expectedReturn: "Erwartete reale Rendite",
        expectedReturnHint: "Reale Portfolio-Rendite (real, nach Teuerung).",
        volatility: "Volatilität",
        volatilityHint: "Für die Monte-Carlo-Simulation.",
        equityShare: "Aktienanteil",
        equityShareHint: "Aktien vs. Obligationen. Bestimmt auch die geschätzte Rendite & Volatilität.",
        swissShare: "Schweiz-Anteil der Aktien",
        swissShareHint: "z. B. 40 % Schweiz / 60 % global. Rest = globale Aktien (reale Kennzahlen Pictet & UBS/DMS).",
        return3a: "Rendite Säule 3a",
        pkInterest: "PK-Verzinsung",
        pkInterestHint: "Ø Zins auf dem PK-Guthaben.",
        salaryGrowth: "Salärwachstum (real)",
        inflation: "Teuerung (Inflation)",
        inflationHint: "Nur für die nominale Darstellung der Jahresausgaben.",
      },
    },
  },

  charts: {
    realNominal: {
      real: "Real",
      nominal: "Nominal",
      realCaption: "in heutiger Kaufkraft (real)",
      nominalCaption: "nominal, inkl. {pct} % Teuerung",
      toggleAria: "Darstellung real oder nominal",
    },
    outflow: {
      caption: "Mittelverwendung pro Jahr",
      imgAlt:
        "Gestapeltes Balkendiagramm der jährlichen Ausgaben (Lebenshaltung, AHV-Beiträge, Steuern), mit AHV-Rente und – falls verrentet – PK-Rente als Linien.",
      living: "Lebenshaltung",
      ahvContrib: "AHV-Beiträge",
      taxes: "Steuern",
      ahvPension: "AHV-Rente",
      pkPension: "PK-Rente",
    },
    balance: {
      caption: "Vermögen je Topf",
      imgAlt:
        "Liniendiagramm des Gesamtvermögens sowie des steuerbaren Vermögens, der Säule 3a und der Pensionskasse über die Zeit, mit Markierungen für FIRE, PK-, 3a- und AHV-Bezug.",
      total: "Gesamt",
      taxable: "Steuerbar",
      pillar3a: "Säule 3a",
      pillar2: "Pensionskasse",
    },
    fan: {
      imgAlt:
        "Fächerdiagramm der Monte-Carlo-Simulation mit Median sowie dem Bereich zwischen 10. und 90. Perzentil des steuerbaren Vermögens über die Zeit.",
      p90: "90. Perzentil",
      median: "Median",
      p10: "10. Perzentil",
      band: "10.–90. Perzentil",
      ageLabel: "Alter {age}",
    },
    yearTable: {
      caption: "Jahresverlauf",
      csv: "CSV",
      csvFilename: "vorzeit-jahresverlauf.csv",
      headers: {
        age: "Alter",
        total: "Total",
        taxable: "Steuerbar",
        pillar3a: "3a",
        pillar2: "PK",
        ahvPension: "AHV-Rente",
        pkPension: "PK-Rente",
        employment: "Erwerb",
        withdrawal: "Portfolio-Bezug",
        ahvContrib: "AHV-Beitr.",
        taxes: "Steuern",
      },
      footnotePrefix: "Mittelherkunft pro Jahr: die Lebenshaltung wird aus ",
      footnoteWithdrawal: "Portfolio-Bezug",
      footnoteSuffix:
        " (Bezug aus dem investierten Vermögen), AHV-Rente, PK-Rente und ggf. Erwerb gedeckt. «Steuern» umfasst Einkommens-, Vermögens- und Kapitalauszahlungssteuer (Bund + Kanton/Gemeinde). Beträge gerundet; die CSV-Datei enthält die vollen Werte.",
    },
  },

  results: {
    verdict: "Beurteilung",
    enough: "● Ausreichend",
    notEnough: "● Noch nicht ausreichend",
    headlineFeasible: "Ihr Kapital reicht für die Frühpensionierung.",
    headlineBridgeFail: "Ihr Kapital reicht noch nicht für die Frühpensionierung.",
    headlineHorizonFail: "Ihr Kapital reicht — aber nicht bis zum Planungshorizont.",
    detailSurplus:
      "Das steuerbare Vermögen bei FIRE übersteigt den Brückenbedarf um {amount}. Der Plan trägt bis zum Planungshorizont.",
    detailFeasibleNoSurplus:
      "Der Plan trägt bis zum Planungshorizont — auch wenn dafür frühzeitig Vorsorgekapital bezogen wird.",
    detailBridgeFail:
      "Bis zum ersten Vorsorge-Bezug fehlen rund {amount}. So lange muss alles aus dem steuerbaren Vermögen kommen.",
    detailHorizonFail: "Die Brückenphase ist gedeckt, doch das Vermögen ist vor dem Planungshorizont aufgebraucht.",
    tileBridgeNeed: "Brücken-Kapitalbedarf",
    tileLiquid: "Liquide Mittel bei FIRE",
    tileBuffer: "Polster",
    tileGap: "Lücke",
    tileMonteCarlo: "Monte-Carlo Erfolg",
    tileCoverage: "Deckung Brückenbedarf",
  },

  lifeline: {
    today: "Heute",
    fire: "FIRE",
    unlock3a: "3a frei",
    unlockPk: "PK frei",
    ahvClaim: "AHV-Bezug",
    horizon: "Horizont",
    bridgeTitle: "Brückenphase: kein Vorsorge-Zugriff",
    footnote:
      "Brass markiert die Brückenphase ({fire}–{unlock}): Die Ausgaben müssen vollständig aus dem steuerbaren Vermögen gedeckt werden, da Säule 3a und Pensionskasse noch gesperrt sind.",
  },

  assumptions: {
    pillar3a: {
      title: "Säule 3a",
      maxContribution: "Max. Einzahlung (mit PK)",
      earliest: "Frühestmöglicher Bezug",
      earliestValue: "Referenzalter − {years} Jahre",
      staggered: "Gestaffelter Bezug",
      staggeredValue: "je Konto ein Jahr",
      staggeredNote:
        "Mehrere 3a-Konten in getrennten Kalenderjahren beziehen bricht die Progression der Kapitalauszahlungssteuer.",
    },
    pillar2: {
      title: "Pensionskasse (BVG-Minimum)",
      coordination: "Koordinationsabzug",
      minInterest: "Mindestzinssatz",
      minConversion: "Mindestumwandlungssatz",
      earliestAge: "Frühestes Bezugsalter (Standard)",
      earliestAgeNote: "Reglementsabhängig, individuell konfigurierbar.",
      payout: "Bezug",
      payoutValue: "Kapital / Rente / gemischt",
      payoutNote:
        "Die Säule 3a wird gesetzlich als Kapital bezogen; die PK wahlweise als Kapital, lebenslange Rente (Guthaben × Umwandlungssatz) oder Mischung. Rentenbezüge (AHV + PK) werden als Einkommen besteuert (siehe Einkommenssteuer).",
    },
    incomeTax: {
      title: "Einkommens- & Kapitalsteuer",
      federal: "Direkte Bundessteuer",
      federalValue: "Tarif {year}",
      federalNote:
        "Exakter eidgenössischer Tarif (ledig/verheiratet). Renten (AHV + PK) und Dividenden werden als Einkommen besteuert.",
      cantonal: "Kantonale/kommunale Einkommens- & Vermögenssteuer",
      cantonalValue: "ESTV 2026 (real)",
      cantonalNote:
        "Echte ESTV-Werte (Kantonshauptort, ledig/verheiratet, Renteneinkommen inkl. Standardabzüge); zwischen Stützpunkten interpoliert.",
      gemeinde: "Gemeinde",
      gemeindeNote:
        "Echter ESTV-Steuerfuss 2026 dieser Gemeinde, in % des Kantonshauptorts — skaliert die kantonalen/kommunalen Steuern exakt.",
      federalCapital: "Kapitalauszahlungssteuer Bund",
      federalCapitalValue: "⅕ des ordentlichen Tarifs",
      federalCapitalNote:
        "Art. 38 DBG, auf 3a-/PK-Kapitalbezügen — zusätzlich zur kantonalen/kommunalen Kapitalsteuer.",
    },
    market: {
      title: "Monte-Carlo — reale Marktdaten",
      equityCh: "Aktien Schweiz (real)",
      equityGlobal: "Aktien global (real)",
      equityGlobalNote:
        "UBS/DMS Welt-Index. Der Aktienteil wird nach Ihrem Schweiz-/Global-Anteil gemischt; Welt-Kennzahlen im Berichtswährungs-Basis (CHF-Stärke nicht abgebildet).",
      bondsCh: "Obligationen Schweiz (real)",
      correlations: "Korrelationen (Annahme)",
      correlationsValue: "Aktien/Obl. {eb} · CH/Welt {sw}",
      correlationsNote:
        "Modellannahmen, keine publizierten Einzelwerte. Der historische Modus zieht Renditen aus diesen Verteilungen.",
      source: "Quelle",
    },
    ahv: {
      title: "AHV",
      maxPension: "Maximale Vollrente",
      referenceAge: "Referenzalter (Standard)",
      claimWindow: "Bezugsfenster",
      reduction: "Kürzung bei Vorbezug",
      reductionNote:
        "Offizielle Sätze 2026: 6,8 % pro Vorbezugsjahr (13,6 % bei 2 Jahren). Der Aufschub folgt der amtlichen Aufschubstabelle (5,2–31,5 %, nicht symmetrisch). Einkommensabhängige Sätze gelten nur für Frauen der Übergangsgeneration (1961–1969).",
    },
    cantonTax: {
      title: "Steuern — {canton}",
      dividendYield: "Dividendenrendite-Annahme",
      dividendYieldValue: "{pct} %/Jahr",
      dividendYieldNote: "Annahme, nicht aus dem Projektbrief — typischer ETF-Mix.",
      noCapGains: "Keine Kapitalgewinnsteuer",
      yes: "Ja",
      no: "Nein",
      noCapGainsNote: "Für Privatanleger auf bewegliches Vermögen.",
      capitalTax: "Kapitalauszahlungssteuer",
      capitalTaxValue: "ESTV 2026 (real)",
      capitalTaxNote:
        "Echte ESTV-Referenzwerte (kantonal + kommunal, Kantonshauptort, ledig, ohne Kirchensteuer); zwischen den Stützpunkten interpoliert und über den Gemeinde-Steuerfaktor skaliert.",
      source: "Quelle",
      unverifiedNote:
        "Für {canton} ist die Kapitalauszahlungssteuer mit echten ESTV-Werten hinterlegt; die Vermögens- und ordentliche Einkommenssteuer beruhen jedoch noch auf einer generischen Näherung. Für exakte Werte den offiziellen ESTV-Steuerrechner nutzen.",
    },
    perYear: "/Jahr",
  },

  affiliate: {
    aria: "Werbung",
    label: "Werbung / Partner-Link",
    learnMore: "Mehr erfahren →",
    broker: {
      name: "Broker (Platzhalter)",
      description: "Ein Online-Broker zur Verwahrung des steuerbaren Brücken-Portfolios.",
    },
    pillar3a: {
      name: "3a-Anbieter (Platzhalter)",
      description: "Ein Säule-3a-Wertschriftenlösungsanbieter.",
    },
  },

  blog: {
    meta: {
      title: "Blog — Wissen zur Frühpensionierung",
      description:
        "Artikel zur Schweizer Frühpensionierung: Brückenphase, Säule 3a, Pensionskasse, AHV-Beiträge und Steuern — verständlich erklärt.",
    },
    index: {
      kicker: "Blog",
      h1: "Wissen zur Frühpensionierung",
      body: "Brückenphase, Vorsorge und Steuern — die Mechanik der Schweizer Frühpension, verständlich erklärt.",
      readingShort: "Min.",
    },
    post: {
      back: "← Blog",
      readingSuffix: "Min. Lesezeit",
      footnote: "Bildungstool, keine Finanz- oder Steuerberatung. Figuren sind 2026-Schätzungen ohne Gewähr.",
      cta: "Eigene Frühpension durchrechnen →",
      more: "Weiterlesen",
      breadcrumb: "Blog",
    },
  },

  ratgeber: {
    meta: {
      title: "Ratgeber: FIRE-Brückenphase, Säulen & Kapitalbezug",
      description:
        "Wie funktioniert die Brückenphase bei einer Frühpensionierung in der Schweiz? Säule 3a, Pensionskasse, AHV und die Steuer beim Kapitalbezug — verständlich erklärt.",
    },
    breadcrumbAria: "Brotkrümel",
    breadcrumbHome: "Rechner",
    breadcrumbCurrent: " / Ratgeber",
    h1: "Frühpensionierung in der Schweiz: die Brückenphase verstehen",
    intro:
      "Ein kompakter Überblick über die Mechanik zwischen FIRE-Ausstieg und dem Zugriff auf Säule 3a, Pensionskasse und AHV — die Grundlage hinter dem Rechner.",
    section1Title: "Die drei Säulen auf einen Blick",
    section1Body:
      "Das Schweizer Vorsorgesystem ruht auf drei Säulen: der staatlichen AHV (Säule 1), der beruflichen Vorsorge / Pensionskasse (Säule 2, BVG) und der gebundenen privaten Vorsorge (Säule 3a). Für eine Frühpensionierung ist entscheidend, dass alle drei erst ab einem bestimmten Alter Geld ausschütten — die Lücke davor muss aus eigenem, frei verfügbarem Vermögen überbrückt werden.",
    pillars: [
      ["Säule 1 — AHV", "Bezug flexibel ab 63, regulär ab Referenzalter 65. Ein Vorbezug reduziert die lebenslange Rente."],
      ["Säule 2 — Pensionskasse", "Kapital- oder Rentenbezug je nach Reglement oft ab 58–60. Ein Kapitalbezug wird einmalig besteuert."],
      ["Säule 3a", "Bezug frühestens fünf Jahre vor dem Referenzalter, also typischerweise ab rund 60. Mehrere 3a-Konten erlauben gestaffelte Bezüge."],
    ],
    section2Title: "Warum die Staffelung beim Bezug zählt",
    section2Body:
      "Kapitalbezüge aus Vorsorgegeldern werden im Bezugsjahr zusammengezählt und progressiv besteuert. Wer Säule 3a und Pensionskasse im selben Jahr bezieht, landet schnell in einer höheren Progressionsstufe. Eine Verteilung über mehrere Steuerjahre kann die gesamte Kapitalauszahlungssteuer spürbar senken. Der Rechner bildet diese Heuristik nach, indem er pro Jahr höchstens aus einer Säule bezieht.",
    section3Title: "Häufige Fragen",
    backToCalc: "← Zum Rechner",
    faq: [
      {
        q: "Was ist die FIRE-Brückenphase?",
        a: "Als Brückenphase bezeichnet man die Jahre zwischen dem frühen Ausstieg aus dem Erwerbsleben (FIRE) und dem Zeitpunkt, ab dem Vorsorgegelder verfügbar werden. Säule 3a und Pensionskasse können in der Regel frühestens rund fünf Jahre vor dem Referenzalter bezogen werden, die AHV ab 63. In der Brückenphase müssen die Lebenshaltungskosten vollständig aus frei verfügbarem (steuerbarem) Vermögen gedeckt werden.",
      },
      {
        q: "Ab welchem Alter kann ich Säule 3a und Pensionskasse beziehen?",
        a: "Säule-3a-Guthaben können frühestens fünf Jahre vor dem AHV-Referenzalter bezogen werden, also üblicherweise ab etwa 60. Pensionskassenkapital ist je nach Reglement oft ab 58 bis 60 beziehbar. Die genauen Altersgrenzen hängen von der Vorsorgeeinrichtung und dem Reglement ab.",
      },
      {
        q: "Wie wird der Kapitalbezug aus der Vorsorge besteuert?",
        a: "Kapitalbezüge aus Säule 3a und Pensionskasse werden getrennt vom übrigen Einkommen zu einem reduzierten Satz besteuert (Kapitalauszahlungssteuer). Der Satz ist progressiv und unterscheidet sich stark je nach Kanton und Wohngemeinde. Werden mehrere Bezüge im selben Steuerjahr getätigt, werden sie zusammengezählt — eine Staffelung über mehrere Jahre kann die Steuerlast deshalb senken.",
      },
      {
        q: "Muss ich nach dem Ausstieg AHV-Beiträge zahlen?",
        a: "Wer vor dem Referenzalter nicht mehr erwerbstätig ist, gilt als nichterwerbstätig und zahlt AHV-Beiträge basierend auf Vermögen und allfälligem Renteneinkommen. Die Beiträge bewegen sich zwischen einem Minimum und einem Maximum pro Jahr. Diese Kosten fallen in der Brückenphase zusätzlich an und sollten eingeplant werden.",
      },
      {
        q: "Rechnet dieses Tool in realen oder nominalen Werten?",
        a: "Die Berechnung erfolgt durchgehend in realen (inflationsbereinigten) Werten. Renditen, Ausgaben und Renten sind also in heutiger Kaufkraft zu verstehen. Das vereinfacht die Interpretation, weil Beträge über die Jahre vergleichbar bleiben.",
      },
    ],
  },

  about: {
    meta: {
      title: "Über uns",
      description:
        "Warum es Vorzeit gibt und wie der Rechner funktioniert: unabhängig, transparent und vollständig im Browser.",
    },
    kicker: "Über uns",
    h1: "Frühpensionierung, ehrlich durchgerechnet.",
    p1: "Vorzeit ist aus einer einfachen Beobachtung entstanden: Die meisten FIRE-Rechner ignorieren, was die Schweiz besonders macht — das Vorsorgevermögen ist die längste Zeit gesperrt, und die Steuern auf Kapitalbezüge, Einkommen und Vermögen unterscheiden sich von Gemeinde zu Gemeinde massiv.",
    p2: "Wir wollten ein Werkzeug, das diese Realität abbildet: die Brückenphase zwischen Ausstieg und Vorsorge-Bezug, den gestaffelten Säule-3a-Bezug, die Wahl zwischen Pensionskassen-Kapital und -Rente, die AHV-Beiträge der Nichterwerbstätigen — und echte Steuern für Ihre Gemeinde.",
    h2numbers: "Woher die Zahlen kommen",
    numbers1:
      "Die Steuerwerte stammen aus dem offiziellen Steuerrechner der Eidgenössischen Steuerverwaltung (ESTV, Steuerjahr 2026): die Kapitalauszahlungssteuer, die kantonale/kommunale Einkommens- und Vermögenssteuer sowie die Gemeinde-Steuerfüsse aller 2'110 Gemeinden. Die direkte Bundessteuer rechnen wir mit dem exakten gesetzlichen Tarif. AHV-, BVG- und Säule-3a-Kennzahlen folgen den offiziellen Werten 2026.",
    numbers2:
      "Es bleiben bewusste Vereinfachungen (etwa bei Abzügen und der Kirchensteuer). Alle Angaben sind Schätzungen ohne Gewähr und ersetzen keine persönliche Beratung.",
    h2privacy: "Ihre Daten bleiben bei Ihnen",
    privacy:
      "Sämtliche Berechnungen laufen lokal in Ihrem Browser. Es werden keine Finanzdaten an einen Server übertragen oder gespeichert. Geteilte Szenario-Links kodieren die Eingaben in der URL — auch sie verlassen Ihren Browser nicht.",
    h2independent: "Unabhängig & werbefinanziert",
    independent:
      "Vorzeit ist kostenlos und unabhängig. Allfällige Partner-Hinweise sind klar als Werbung gekennzeichnet und von den Berechnungsergebnissen getrennt.",
    cta: "Zum Rechner →",
  },

  impressum: {
    meta: { title: "Impressum", description: "Impressum und Anbieterkennzeichnung von Vorzeit." },
    kicker: "Rechtliches",
    h1: "Impressum",
    placeholder: "Platzhalter — vor der Veröffentlichung mit den realen Anbieterangaben ersetzen.",
    providerHeading: "Anbieter",
    providerLines: ["Vorzeit", "[Name / Firma]", "[Strasse Nr.]", "[PLZ Ort], Schweiz"],
    contactHeading: "Kontakt",
    contact: "E-Mail: [kontakt@example.ch]",
    liabilityHeading: "Haftungsausschluss",
    liability1:
      "Vorzeit ist ein Bildungstool und stellt keine Finanz-, Steuer- oder Anlageberatung dar. Alle Berechnungen und Steuerangaben sind Schätzungen ohne Gewähr. Für Entscheidungen auf Basis der Ergebnisse wird keine Haftung übernommen; massgebend sind die offiziellen Stellen (ESTV, Ausgleichskasse, Pensionskasse) und eine persönliche Beratung.",
    liability2:
      "Für Inhalte externer Links wird keine Haftung übernommen; verantwortlich sind ausschliesslich deren Betreiber.",
  },

  datenschutz: {
    meta: {
      title: "Datenschutz",
      description:
        "Datenschutzerklärung von Vorzeit: Alle Berechnungen laufen lokal im Browser, es werden keine Finanzdaten übertragen.",
    },
    kicker: "Rechtliches",
    h1: "Datenschutz",
    h2principle: "Grundsatz: keine Server-Verarbeitung Ihrer Eingaben",
    principle:
      "Vorzeit ist so gebaut, dass Ihre Finanzdaten Ihren Browser nicht verlassen. Alle Berechnungen (Vermögen, Vorsorge, Steuern) laufen vollständig lokal auf Ihrem Gerät. Es werden keine Eingabewerte an einen Server übertragen, gespeichert oder ausgewertet.",
    h2shared: "Geteilte Szenarien",
    shared:
      "Wenn Sie ein Szenario teilen, werden die Eingaben in den Link (URL-Fragment) kodiert. Dieses Fragment wird von Browsern üblicherweise nicht an den Server gesendet. Teilen Sie einen solchen Link nur mit Personen, denen Sie die enthaltenen Angaben anvertrauen möchten.",
    h2logs: "Server-Logs & Hosting",
    logs:
      "Beim Abruf der Seiten können beim Hosting-Anbieter technisch notwendige Server-Logs anfallen (z. B. IP-Adresse, Zeitpunkt, abgerufene Seite). Diese dienen dem Betrieb und der Sicherheit und enthalten keine von Ihnen eingegebenen Finanzdaten.",
    h2external: "Externe Inhalte",
    external:
      "Schriftarten werden über den Build ausgeliefert. Klar gekennzeichnete Partner-Links führen zu externen Anbietern mit eigenen Datenschutzbestimmungen.",
    h2contact: "Kontakt",
    contact:
      "Fragen zum Datenschutz: [kontakt@example.ch]. Diese Erklärung ist ein Platzhalter und vor der Veröffentlichung an die tatsächlichen Verhältnisse anzupassen.",
  },

  og: {
    kicker: "Private Dossier · Schweizer FIRE",
    h1: "Reicht Ihr Kapital bis zur Pension?",
    body:
      "Brückenrechnung zwischen Frühpensionierung und Säule 3a, Pensionskasse & AHV — inkl. echter ESTV-Steuern pro Gemeinde.",
    footerLeft: "Säule 3a · Pensionskasse · AHV · Steuern",
    footerRight: "Bildungstool — keine Finanzberatung",
  },
};
