(function () {
  "use strict";
  var D = window.DEMO_DATEN;
  var TEXT = {
    de: {
      locale: "de-DE", seitentitel: "Werkstattdaten Demo",
      skip: "Zum Inhalt", repo: "Quellcode auf GitHub",
      marke: "Lernprojekt · synthetische Daten",
      titel: "Werkstattdaten: Datenqualität und Kennzahlen",
      einleitung: "Anwendungsfall: Eine Werkstatt exportiert ihre Bestellungen als CSV. Bevor daraus ein Umsatz berechnet wird, soll feststehen, welche Zeilen verlässlich sind und warum andere abgelehnt werden. Diese Seite zeigt den echten Ablauf des Projekts: CSV prüfen, in SQLite laden, drei SQL-Auswertungen ausführen.",
      h_eingabe: "Eingabe wählen",
      eingabe_text: "Wähle eine CSV-Datei. Das Projekt wurde auf jeder dieser Dateien wirklich ausgeführt; die Seite zeigt die aufgezeichneten Ergebnisse.",
      h_pruefung: "Prüfung jeder CSV-Zeile",
      siegel: "Ausgabe eines echten Laufs des Projekts",
      lab_csv: "CSV-Zeilen mit Prüfergebnis, horizontal scrollbar", cap_csv: "CSV-Zeilen mit Prüfergebnis",
      th_zeile: "Zeile", th_inhalt: "Inhalt der CSV", th_urteil: "Ergebnis", th_meldung: "Meldung des Programms",
      meldungen_hinweis: "Die Meldungen stammen unverändert vom Programm.",
      kopfzeile: "Kopfzeile", urteil_ok: "übernommen", urteil_nein: "abgelehnt",
      z_gelesen: "Zeilen gelesen", z_uebernommen: "übernommen", z_abgelehnt: "abgelehnt",
      h_sql: "SQLite und drei SQL-Auswertungen",
      sql_text: "Übernommene Zeilen landen in der SQLite-Tabelle bestellungen, Beträge als ganze Cent. Abgelehnte Zeilen bleiben mit Originalwerten und Gründen in abgelehnte_zeilen erhalten. Die drei Abfragen stammen aus dem Ordner sql/.",
      k_gesamt: "Gesamtumsatz", k_monat: "Umsatz je Monat", k_kategorie: "Umsatz je Kategorie",
      sql_zeigen: "SQL anzeigen",
      anzahl_bestellungen: function (n) { return n === 1 ? "1 Bestellung" : n + " Bestellungen"; },
      keine_daten: "Keine Bestellung übernommen. Die Summe ist 0 €, nicht leer.",
      kat: { ersatzteile: "Ersatzteile", wartung: "Wartung" },
      gespeichert: "Gespeicherte Tabellen in der Datenbank",
      t_bestellungen: "Tabelle bestellungen (übernommen)", t_abgelehnt: "Tabelle abgelehnte_zeilen",
      lab_best: "Tabelle bestellungen, horizontal scrollbar", cap_best: "Übernommene Bestellungen",
      lab_abg: "Tabelle abgelehnte_zeilen, horizontal scrollbar", cap_abg: "Abgelehnte Zeilen",
      keine_zeilen: "Keine Zeilen.",
      h_erklaerung: "Das Projekt in vier Punkten",
      e_aufgabe_h: "Aufgabe", e_daten_h: "Daten", e_ergebnis_h: "Ergebnis", e_grenzen_h: "Grenzen",
      e_aufgabe: "Bestellungen einer Werkstatt enthalten Dubletten und fehlerhafte Beträge. Das Projekt prüft jede CSV-Zeile gegen feste Regeln (Pflichtwerte, eindeutige Kennung, gültiges Datum, bekannte Kategorie, Betrag mit höchstens zwei Nachkommastellen), lehnt Fehlerzeilen mit Grund ab und wertet nur die übrigen in SQLite aus. Beträge werden als ganze Cent gespeichert, damit zum Beispiel 0,10 € plus 0,20 € genau 0,30 € ergibt.",
      e_daten: "Zwölf synthetische Bestellungen in beispieldaten/bestellungen.csv: zehn gültige, eine Wiederholung der Kennung B10 und eine Zeile ohne Kennung und Betrag. Die drei anderen Dateien dieser Demo (bereinigt, typische Fehler, nur Kopfzeile) liegen in demo/beispiel/. Sie wurden für diese Seite ergänzt und vom echten Code geprüft.",
      e_ergebnis: "Beispieldatei: 12 Zeilen gelesen, 10 übernommen, 2 abgelehnt; Gesamtumsatz 820 €, Januar 340 €, Februar 480 €. Die sechs Unit-Tests des Projekts laufen durch.",
      e_grenzen: "Lernprojekt mit synthetischen Daten, mit KI-Unterstützung entwickelt und geprüft. Öffentlich ist Phase 2 von 4: CSV-Prüfung und SQLite-Auswertung. Der Power-BI-Bericht und der Excel/VBA-Abgleich sind im Repository noch nicht enthalten und kommen hier nicht vor. Kein Cloud-BI, keine Echtdaten.",
      h_ehrlich: "Was wirklich ausgeführt wurde",
      a_lief: "Ausgeführt", a_nicht: "Nicht ausgeführt, nicht enthalten",
      lief: function (d) { return [
        "src/aufbereiten.py und src/arbeitsdatenbank.py, je als Kommandozeile, auf " + d.laeufe.length + " CSV-Dateien",
        "Die drei SQL-Dateien aus sql/ gegen die erzeugte SQLite-Datenbank",
        "Die Unit-Tests des Projekts (" + d.tests.anzahl + " Tests)",
        "Python " + d.versionen.python + ", SQLite " + d.versionen.sqlite + ", Projektstand " + d.projekt_commit + ", Lauf am " + new Date(d.erzeugt_am).toLocaleDateString("de-DE", { timeZone: "UTC" })
      ]; },
      nicht: [
        "Power-BI-Bericht mit Power Query und DAX (Phase 3, noch nicht im Repository)",
        "Excel/VBA und der Abgleich aller sieben Kennzahlen (Phase 4, noch nicht im Repository)",
        "Diese Seite rechnet nichts selbst: Sie zeigt die aufgezeichneten Ausgaben der echten Läufe"
      ],
      tests_titel: function (d) { return d.tests.anzahl + " Unit-Tests, Ergebnis: " + (d.tests.erfolgreich ? "alle bestanden" : "Fehler"); },
      nachbau: "Neu erzeugen im Projektordner (schreibt demo/daten.js):",
      fuss: "Eigenes Lernprojekt, mit KI-Unterstützung entwickelt und geprüft. Keine Aussage über Berufserfahrung oder praktischen Einsatz.",
      varianten: {
        original: ["Beispieldatei des Projekts", "12 Zeilen, beispieldaten/bestellungen.csv", "Die Beispieldatei des Projekts mit einer wiederholten Kennung (B10) und einer unvollständigen Zeile."],
        bereinigt: ["Bereinigt", "10 Zeilen, ohne die Problemzeilen", "Dieselbe Datei ohne die zwei Problemzeilen. Die Summe bleibt gleich, weil die abgelehnten Zeilen ohnehin nicht zählten."],
        fehler: ["Typische Fehler", "10 Zeilen, für diese Demo ergänzt", "Negativer Betrag, unmögliches Datum (30. Februar), unbekannte Kategorie, drei Nachkommastellen, zusätzlicher Wert, Text als Betrag. Dazu gültige Cent-Beträge (0,10 und 0,20)."],
        leer: ["Nur Kopfzeile", "0 Zeilen, für diese Demo ergänzt", "Eine CSV ohne Bestellungen. Die Auswertung liefert 0 Cent statt eines Fehlers."]
      },
      meldung: function (m) { return null; }
    },
    fr: {
      locale: "fr-FR", seitentitel: "Démo données d'atelier",
      skip: "Aller au contenu", repo: "Code source sur GitHub",
      marke: "Projet d'apprentissage · données synthétiques",
      titel: "Données d'atelier : qualité des données et indicateurs",
      einleitung: "Cas d'usage : un atelier exporte ses commandes en CSV. Avant de calculer un chiffre d'affaires, il faut savoir quelles lignes sont fiables et pourquoi d'autres sont rejetées. Cette page montre le déroulement réel du projet : vérifier le CSV, le charger dans SQLite, exécuter trois requêtes SQL.",
      h_eingabe: "Choisir l'entrée",
      eingabe_text: "Choisissez un fichier CSV. Le projet a vraiment été exécuté sur chacun de ces fichiers ; la page affiche les résultats enregistrés.",
      h_pruefung: "Vérification de chaque ligne CSV",
      siegel: "Sortie d'une exécution réelle du projet",
      lab_csv: "Lignes CSV avec résultat de la vérification, défilement horizontal", cap_csv: "Lignes CSV avec résultat de la vérification",
      th_zeile: "Ligne", th_inhalt: "Contenu du CSV", th_urteil: "Résultat", th_meldung: "Message du programme",
      meldungen_hinweis: "Les messages viennent tels quels du programme (en allemand). La traduction française est ajoutée en dessous.",
      kopfzeile: "En-tête", urteil_ok: "retenue", urteil_nein: "rejetée",
      z_gelesen: "lignes lues", z_uebernommen: "retenues", z_abgelehnt: "rejetées",
      h_sql: "SQLite et trois requêtes SQL",
      sql_text: "Les lignes retenues vont dans la table SQLite bestellungen, les montants en centimes entiers. Les lignes rejetées sont conservées avec leurs valeurs d'origine et leurs motifs dans abgelehnte_zeilen. Les trois requêtes viennent du dossier sql/.",
      k_gesamt: "Chiffre d'affaires total", k_monat: "Chiffre d'affaires par mois", k_kategorie: "Chiffre d'affaires par catégorie",
      sql_zeigen: "Afficher le SQL",
      anzahl_bestellungen: function (n) { return n <= 1 ? n + " commande" : n + " commandes"; },
      keine_daten: "Aucune commande retenue. La somme vaut 0 €, elle n'est pas vide.",
      kat: { ersatzteile: "Pièces détachées", wartung: "Maintenance" },
      gespeichert: "Tables enregistrées dans la base",
      t_bestellungen: "Table bestellungen (retenues)", t_abgelehnt: "Table abgelehnte_zeilen",
      lab_best: "Table bestellungen, défilement horizontal", cap_best: "Commandes retenues",
      lab_abg: "Table abgelehnte_zeilen, défilement horizontal", cap_abg: "Lignes rejetées",
      keine_zeilen: "Aucune ligne.",
      h_erklaerung: "Le projet en quatre points",
      e_aufgabe_h: "Objectif", e_daten_h: "Données", e_ergebnis_h: "Résultat", e_grenzen_h: "Limites",
      e_aufgabe: "Les commandes d'un atelier contiennent des doublons et des montants erronés. Le projet vérifie chaque ligne CSV selon des règles fixes (valeurs obligatoires, identifiant unique, date valide, catégorie connue, montant avec au plus deux décimales), rejette les lignes en erreur en indiquant le motif et n'exploite que les autres dans SQLite. Les montants sont stockés en centimes entiers, de sorte que 0,10 € plus 0,20 € donne exactement 0,30 €.",
      e_daten: "Douze commandes synthétiques dans beispieldaten/bestellungen.csv : dix valides, une répétition de l'identifiant B10 et une ligne sans identifiant ni montant. Les trois autres fichiers de cette démo (nettoyé, erreurs typiques, en-tête seul) sont dans demo/beispiel/. Ils ont été ajoutés pour cette page et vérifiés par le vrai code.",
      e_ergebnis: "Fichier d'exemple : 12 lignes lues, 10 retenues, 2 rejetées ; chiffre d'affaires total 820 €, janvier 340 €, février 480 €. Les six tests unitaires du projet passent.",
      e_grenzen: "Projet d'apprentissage avec données synthétiques, développé et vérifié avec l'aide d'une IA. Seule la phase 2 sur 4 est publique : vérification CSV et exploitation SQLite. Le rapport Power BI et la comparaison Excel/VBA ne sont pas encore dans le dépôt et n'apparaissent pas ici. Pas de BI cloud, pas de données réelles.",
      h_ehrlich: "Ce qui a vraiment été exécuté",
      a_lief: "Exécuté", a_nicht: "Non exécuté, non inclus",
      lief: function (d) { return [
        "src/aufbereiten.py et src/arbeitsdatenbank.py, chacun en ligne de commande, sur " + d.laeufe.length + " fichiers CSV",
        "Les trois fichiers SQL de sql/ contre la base SQLite générée",
        "Les tests unitaires du projet (" + d.tests.anzahl + " tests)",
        "Python " + d.versionen.python + ", SQLite " + d.versionen.sqlite + ", version du projet " + d.projekt_commit + ", exécution du " + new Date(d.erzeugt_am).toLocaleDateString("fr-FR", { timeZone: "UTC" })
      ]; },
      nicht: [
        "Rapport Power BI avec Power Query et DAX (phase 3, pas encore dans le dépôt)",
        "Excel/VBA et comparaison des sept indicateurs (phase 4, pas encore dans le dépôt)",
        "Cette page ne calcule rien elle-même : elle affiche les sorties enregistrées des exécutions réelles"
      ],
      tests_titel: function (d) { return d.tests.anzahl + " tests unitaires, résultat : " + (d.tests.erfolgreich ? "tous réussis" : "échec"); },
      nachbau: "Régénérer dans le dossier du projet (écrit demo/daten.js) :",
      fuss: "Projet d'apprentissage personnel, développé et vérifié avec l'aide d'une IA. Aucune affirmation sur une expérience professionnelle ou un usage en production.",
      varianten: {
        original: ["Fichier d'exemple du projet", "12 lignes, beispieldaten/bestellungen.csv", "Le fichier d'exemple du projet avec un identifiant répété (B10) et une ligne incomplète."],
        bereinigt: ["Nettoyé", "10 lignes, sans les lignes problématiques", "Le même fichier sans les deux lignes problématiques. La somme reste identique, car les lignes rejetées ne comptaient déjà pas."],
        fehler: ["Erreurs typiques", "10 lignes, ajouté pour cette démo", "Montant négatif, date impossible (30 février), catégorie inconnue, trois décimales, valeur en trop, texte à la place du montant. Plus des montants valides en centimes (0,10 et 0,20)."],
        leer: ["En-tête seul", "0 ligne, ajouté pour cette démo", "Un CSV sans commandes. L'exploitation renvoie 0 centime au lieu d'une erreur."]
      },
      meldung: function (m) {
        var r;
        if ((r = /^Bestellkennung (\S+) bereits in CSV-Zeile (\d+) vorhanden\.$/.exec(m))) return "Identifiant de commande " + r[1] + " déjà présent à la ligne CSV " + r[2] + ".";
        var f = {
          "Bestellkennung fehlt.": "Identifiant de commande manquant.",
          "Betrag fehlt.": "Montant manquant.",
          "Datum fehlt oder ist kein gültiges Datum im Format JJJJ-MM-TT.": "Date manquante ou invalide (format AAAA-MM-JJ).",
          "Kategorie muss ersatzteile oder wartung sein.": "La catégorie doit être ersatzteile (pièces détachées) ou wartung (maintenance).",
          "Betrag muss eine endliche, nicht negative Dezimalzahl mit höchstens zwei Nachkommastellen sein.": "Le montant doit être un nombre décimal fini, non négatif, avec au plus deux décimales.",
          "Zusätzliche CSV-Werte ohne Spaltenüberschrift.": "Valeurs CSV supplémentaires sans en-tête de colonne."
        };
        return f[m] || null;
      }
    }
  };

  var sprache = "de";
  var auswahl = "original";
  var REIHENFOLGE = ["original", "bereinigt", "fehler", "leer"];

  function T() { return TEXT[sprache]; }
  function el(tag, text, klasse) {
    var e = document.createElement(tag);
    if (text !== undefined && text !== null) e.textContent = text;
    if (klasse) e.className = klasse;
    return e;
  }
  function leeren(e) { while (e.firstChild) e.removeChild(e.firstChild); }
  function euro(cent) {
    return new Intl.NumberFormat(T().locale, { style: "currency", currency: "EUR" }).format(cent / 100);
  }
  function monat(m) {
    var teile = m.split("-");
    return new Intl.DateTimeFormat(T().locale, { month: "long", year: "numeric", timeZone: "UTC" })
      .format(new Date(Date.UTC(+teile[0], +teile[1] - 1, 1)));
  }
  function lauf() { return D.laeufe.filter(function (l) { return l.name === auswahl; })[0]; }

  function textAnwenden() {
    var t = T();
    document.documentElement.lang = sprache;
    document.title = t.seitentitel;
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"), function (e) {
      var w = t[e.getAttribute("data-i18n")];
      if (typeof w === "string") e.textContent = w;
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n-label]"), function (e) {
      e.setAttribute("aria-label", t[e.getAttribute("data-i18n-label")]);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".sprache button"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-sprache") === sprache));
    });
  }

  function auswahlZeichnen() {
    var box = document.getElementById("auswahl");
    leeren(box);
    REIHENFOLGE.forEach(function (name) {
      var v = T().varianten[name];
      var b = el("button");
      b.type = "button";
      b.setAttribute("aria-pressed", String(name === auswahl));
      b.appendChild(el("strong", v[0]));
      b.appendChild(el("span", v[1]));
      b.addEventListener("click", function () { auswahl = name; alles(); fokus(name); });
      box.appendChild(b);
    });
    document.getElementById("auswahl-text").textContent = T().varianten[auswahl][2];
  }
  function fokus(name) {
    var i = REIHENFOLGE.indexOf(name);
    var knoepfe = document.querySelectorAll("#auswahl button");
    if (knoepfe[i]) knoepfe[i].focus();
  }

  function meldungZelle(td, gruende) {
    gruende.forEach(function (g) {
      td.appendChild(el("div", g));
      var fr = T().meldung(g);
      if (fr) td.appendChild(el("span", fr, "gloss"));
    });
  }

  function pruefungZeichnen() {
    var l = lauf(), t = T(), imp = l.import;
    var z = document.getElementById("zaehler");
    leeren(z);
    [[imp.eingelesene_zeilen, t.z_gelesen, ""], [imp.uebernommene_zeilen, t.z_uebernommen, "gut"], [imp.abgelehnte_zeilen, t.z_abgelehnt, imp.abgelehnte_zeilen ? "schlecht" : ""]]
      .forEach(function (k) {
        var d = el("div", null, k[2]);
        d.appendChild(el("b", String(k[0])));
        d.appendChild(el("span", k[1]));
        z.appendChild(d);
      });
    var abg = {};
    l.pruefung.auffaelligkeiten.forEach(function (a) { abg[a.csv_zeile] = a.gruende; });
    var body = document.querySelector("#csv-tabelle tbody");
    leeren(body);
    l.csv.forEach(function (zeile, i) {
      var nr = i + 1;
      var tr = el("tr");
      tr.appendChild(el("td", String(nr), "zahl"));
      tr.appendChild(el("td", zeile, "mono"));
      var u = el("td"), m = el("td", null, "meldung");
      if (i === 0) {
        u.appendChild(el("span", t.kopfzeile, "urteil neutral"));
      } else if (abg[nr]) {
        tr.className = "abgelehnt";
        u.appendChild(el("span", t.urteil_nein, "urteil nein"));
        meldungZelle(m, abg[nr]);
      } else {
        u.appendChild(el("span", t.urteil_ok, "urteil ok"));
      }
      tr.appendChild(u); tr.appendChild(m);
      body.appendChild(tr);
    });
    document.getElementById("meldungen-hinweis").hidden = !l.pruefung.auffaelligkeiten.length;
  }

  function balken(boxId, zeilen) {
    var box = document.getElementById(boxId);
    leeren(box);
    if (!zeilen.length) { box.appendChild(el("p", T().keine_daten, "leer")); return; }
    var max = Math.max.apply(null, zeilen.map(function (z) { return z.cent; }));
    zeilen.forEach(function (z) {
      var r = el("div", null, "zeile");
      var kopf = el("div", null, "kopfzeile-balken");
      kopf.appendChild(el("span", z.name));
      kopf.appendChild(el("strong", euro(z.cent) + " (" + T().anzahl_bestellungen(z.n) + ")"));
      r.appendChild(kopf);
      var spur = el("div", null, "spur");
      var stab = el("div", null, "stab");
      stab.style.width = (max ? z.cent / max * 100 : 0) + "%";
      spur.appendChild(stab);
      r.appendChild(spur);
      box.appendChild(r);
    });
  }

  function leereZeile(tb, spalten) {
    var tr = el("tr"); var c = el("td", T().keine_zeilen, "leer"); c.colSpan = spalten; tr.appendChild(c); tb.appendChild(tr);
  }

  function sqlZeichnen() {
    var l = lauf(), a = l.import.auswertungen, t = T();
    var g = a.gesamtumsatz[0];
    document.getElementById("kpi-summe").textContent = euro(g.umsatz_cent);
    document.getElementById("kpi-anzahl").textContent = t.anzahl_bestellungen(g.bestellungen);
    balken("balken-monat", a.monatsumsaetze.map(function (m) { return { name: monat(m.monat), cent: m.umsatz_cent, n: m.bestellungen }; }));
    balken("balken-kategorie", a.kategorieumsaetze.map(function (k) { return { name: t.kat[k.kategorie] || k.kategorie, cent: k.umsatz_cent, n: k.bestellungen }; }));
    document.getElementById("sql-gesamt").textContent = D.abfragen.gesamtumsatz;
    document.getElementById("sql-monat").textContent = D.abfragen.monatsumsaetze;
    document.getElementById("sql-kategorie").textContent = D.abfragen.kategorieumsaetze;

    var tb = document.querySelector("#tab-bestellungen tbody");
    leeren(tb);
    if (!l.bestellungen.length) leereZeile(tb, 5);
    l.bestellungen.forEach(function (r) {
      var tr = el("tr");
      r.forEach(function (w, i) { tr.appendChild(el("td", String(w), i === 4 || i === 1 ? "zahl mono" : "mono")); });
      tb.appendChild(tr);
    });
    var ta = document.querySelector("#tab-abgelehnt tbody");
    leeren(ta);
    if (!l.abgelehnt.length) leereZeile(ta, 3);
    l.abgelehnt.forEach(function (r) {
      var tr = el("tr");
      tr.appendChild(el("td", String(r[0]), "zahl mono"));
      tr.appendChild(el("td", JSON.stringify(r[1]), "mono"));
      var m = el("td", null, "meldung");
      meldungZelle(m, r[2]);
      tr.appendChild(m);
      ta.appendChild(tr);
    });
  }

  function listen() {
    var t = T();
    var lief = document.getElementById("lief"); leeren(lief);
    t.lief(D).forEach(function (s) { lief.appendChild(el("li", s)); });
    var nicht = document.getElementById("nicht"); leeren(nicht);
    t.nicht.forEach(function (s) { nicht.appendChild(el("li", s)); });
    document.getElementById("tests-titel").textContent = t.tests_titel(D);
    var tl = document.getElementById("tests-liste"); leeren(tl);
    D.tests.faelle.forEach(function (f) { var li = el("li"); li.appendChild(el("code", f[1])); tl.appendChild(li); });
    document.getElementById("nachbau").textContent = t.nachbau;
  }

  function alles() {
    textAnwenden(); auswahlZeichnen(); pruefungZeichnen(); sqlZeichnen(); listen();
  }

  function sprachWahl(neu, url) {
    sprache = neu;
    if (url !== false) {
      try {
        var u = new URL(window.location.href);
        if (neu === "de") u.searchParams.delete("lang"); else u.searchParams.set("lang", neu);
        window.history.replaceState(null, "", u.pathname + u.search + u.hash);
      } catch (e) { /* ohne Adressänderung weiter */ }
    }
    alles();
  }

  Array.prototype.forEach.call(document.querySelectorAll(".sprache button"), function (b) {
    b.addEventListener("click", function () { sprachWahl(b.getAttribute("data-sprache")); });
  });
  var start = new URLSearchParams(window.location.search).get("lang");
  sprachWahl(start === "fr" ? "fr" : "de", false);
}());
