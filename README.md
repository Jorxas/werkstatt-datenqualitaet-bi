# Datenqualität und Kennzahlen einer Werkstatt

Stand: 31. Oktober 2026 — **in Arbeit; P01-T01 abgeschlossen**. Datenwörterbuch und erste CSV-Prüfung vorhanden. Die restliche Basis ist offen. Geplanter Abschluss der Basis: 2026-11-01, spätestens 8. November 2026. Geschätzter Basisaufwand: 5 Stunden ohne Einrichtung und Erweiterungen.

Eine kleine Werkstatt möchte Umsätze auswerten und doppelte oder unvollständige Bestellungen erkennen.

Ergebnis: Bereinigte CSV-Datei, drei SQL-Abfragen, zwei lokale Power-BI-Berichtsseiten und eine kleine VBA-Prüfung.

Vorgesehene Technologien: SQL, Excel, Power Query, Power BI, DAX, VBA. Eine Nennung ist kein Nachweis einer Umsetzung.

## Einstieg

1. [Lastenheft](LASTENHEFT.md) lesen.
2. [Abgeschlossenen Prüfauftrag](tickets/P01-T01.md) ansehen; nächster offener Auftrag ist [P01-T02](tickets/P01-T02.md).
3. [Technischen Einstieg](START.md) prüfen und ein Ticket nach dem anderen bearbeiten.
4. [Arbeitsjournal](ARBEITSJOURNAL.md) und echte Nachweise aktualisieren.

Abhängigkeiten: keine weiteren Projekte.

## Erste begrenzte Arbeitseinheit

Die Prüfung liest zwölf Zeilen, meldet das Duplikat in CSV-Zeile 12 und fehlende Pflichtwerte in CSV-Zeile 13. Die Originaldatei bleibt unverändert. [Datenwörterbuch](DATENWOERTERBUCH.md), [Start und Prüfung](START.md) sowie [Arbeitsjournal](ARBEITSJOURNAL.md) beschreiben diesen Teilfortschritt.

Nach diesem Ticket wurde angehalten. Bereinigungsexport, SQL, Power BI und Excel/VBA sind noch nicht umgesetzt; keine neue Kompetenz darin bestätigt.

[Erweiterungen](VARIANTEN.md) haben einen eigenen Umsetzungsstand. [Private Unternehmenszuordnung](UNTERNEHMEN.lokal.md) bleibt außerhalb der Git-Verwaltung.

## Projektsprache

Dokumentation, selbst gewählte Bezeichner, Kommentare, Meldungen und Beispieldaten werden auf Deutsch geschrieben. Festgelegte API-Schlüssel, Sprachsyntax und Produktnamen bleiben unverändert.
