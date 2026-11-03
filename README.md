# Datenqualität und Kennzahlen einer Werkstatt

Stand: 2. November 2026 — **in Arbeit; P01-T01 und P01-T02 abgeschlossen**. CSV-Prüfung, SQLite-Arbeitsdatenbank und drei SQL-Auswertungen vorhanden. Die restliche Basis ist offen. Geplanter Abschluss der Basis: spätestens 8. November 2026. Geschätzter Basisaufwand: 5 Stunden ohne Einrichtung und Erweiterungen.

Eine kleine Werkstatt möchte Umsätze auswerten und doppelte oder unvollständige Bestellungen erkennen.

Ergebnis: Bereinigte CSV-Datei, drei SQL-Abfragen, zwei lokale Power-BI-Berichtsseiten und eine kleine VBA-Prüfung.

Vorgesehene Technologien: SQL, Excel, Power Query, Power BI, DAX, VBA. Eine Nennung ist kein Nachweis einer Umsetzung.

## Einstieg

1. [Lastenheft](LASTENHEFT.md) lesen.
2. [Abgeschlossenen SQLite-Auftrag](tickets/P01-T02.md) ansehen; nächster offener Auftrag ist P01-T03, erst in einer späteren freigegebenen Einheit.
3. [Technischen Einstieg](START.md) prüfen und ein Ticket nach dem anderen bearbeiten.
4. [Arbeitsjournal](ARBEITSJOURNAL.md) und echte Nachweise aktualisieren.

Abhängigkeiten: keine weiteren Projekte.

## Geprüfter Teilumfang

Die Prüfung liest zwölf Zeilen, meldet das Duplikat in CSV-Zeile 12 und fehlende Pflichtwerte in CSV-Zeile 13. Die Originaldatei bleibt unverändert. [Datenwörterbuch](DATENWOERTERBUCH.md), [Start und Prüfung](START.md) sowie [Arbeitsjournal](ARBEITSJOURNAL.md) beschreiben diesen Teilfortschritt.

P01-T02 lädt zehn Bestellungen in `ausgabe/werkstatt.sqlite`. Die Tabelle `abgelehnte_zeilen` enthält die beiden übrigen Zeilen mit Originalwerten und Gründen. Gesamtumsatz: 820,00 Euro; Januar: 340,00 Euro, Februar: 480,00 Euro; Ersatzteile: 320,00 Euro, Wartung: 500,00 Euro. Drei SQL-Dateien unter `sql/` liefern diese Auswertungen. [Lokale Abnahme](nachweise/P01-T02-abnahme.md): sechs Tests erfolgreich, zwölf Originalzeilen unverändert.

Nach diesem Endpunkt angehalten. Bereinigungsexport, Power BI, DAX und Excel/VBA sind offen. Das übergreifende Lastenheftkriterium A2 bleibt ungeprüft, weil der Vergleich mit Excel und Power BI noch fehlt. Es wird keine praktische Verwendung dieser Produkte behauptet.

[Erweiterungen](VARIANTEN.md) haben einen eigenen Umsetzungsstand. [Private Unternehmenszuordnung](UNTERNEHMEN.lokal.md) bleibt außerhalb der Git-Verwaltung.

## Projektsprache

Dokumentation, selbst gewählte Bezeichner, Kommentare, Meldungen und Beispieldaten werden auf Deutsch geschrieben. Festgelegte API-Schlüssel, Sprachsyntax und Produktnamen bleiben unverändert.
