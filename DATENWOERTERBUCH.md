# Datenwörterbuch und Prüfregeln

Der synthetische Datensatz enthält zwölf Zeilen aus einer Werkstatt. Eine Zeile beschreibt eine Bestellung. Die Prüfung verändert weder Originaldatei noch Werte und erzeugt noch keine bereinigte CSV.

| Feld | Bedeutung und Format | Regel |
|---|---|---|
| bestellung_id | Bestellkennung, beispielsweise B01 | Pflichtwert, eindeutig; erste Fundstelle protokollieren |
| datum | Bestelldatum, JJJJ-MM-TT | Pflichtwert, tatsächlich gültiges Kalenderdatum |
| kategorie | Art des Auftrags | ersatzteile oder wartung |
| betrag | Betrag in Euro, Dezimalpunkt | Pflichtwert, endlich, nicht negativ, höchstens zwei Nachkommastellen |

CSV verwendet Kommas und genau diese vier Überschriften; ihre Reihenfolge ist beliebig. UTF-8 mit oder ohne BOM ist lesbar. Für die Prüfung werden äußere Leerzeichen ignoriert. Zusätzliche Werte ohne passende Überschrift werden gemeldet.

Eine Bestellkennung darf nur einmal vorkommen. Auch eine in anderer Hinsicht fehlerhafte Zeile belegt ihre Kennung; eine spätere Wiederholung wird zusätzlich gemeldet. Dieses Ticket entscheidet noch nicht, welche Bestellung später übernommen werden soll.

## Erwartete Auffälligkeiten der Beispieldatei

- CSV-Zeile 12: B10 wiederholt die Kennung aus CSV-Zeile 11.
- CSV-Zeile 13: Bestellkennung und Betrag fehlen.
- Insgesamt zwölf eingelesene Zeilen, zehn unauffällige und zwei auffällige Zeilen. Mehrere Gründe derselben Zeile werden zusammengefasst.

Die erste CSV-Zeile enthält die Überschriften. Bei mehrzeiligen, in Anführungszeichen stehenden Datensätzen bezeichnet csv_zeile die letzte physische Zeile des Datensatzes, wie vom CSV-Leser geliefert.

Unauffällig bedeutet nur, dass diese kleinen technischen Regeln erfüllt sind. Ob eine Bestellung wirtschaftlich korrekt ist, wird hier nicht beurteilt. Keine Preisberechnung, Datenbank, Kennzahlen oder Power-BI-Auswertung Bestandteil dieser Prüfung.
