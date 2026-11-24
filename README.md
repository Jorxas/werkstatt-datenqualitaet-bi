# Werkstattdaten: Datenqualität und Kennzahlen

Bestellungen einer Werkstatt enthalten Dubletten und fehlerhafte Beträge. Auswertungen sollen trotzdem nachvollziehbar und zwischen SQL, Excel und Power BI vergleichbar sein.

![Projektaufbau](dokumentation/ueberblick.svg)

**Veröffentlichungsstand: Phase 3/4.** Dieses eigenständige Repository veröffentlicht zuvor lokal entwickelte, geprüfte und unveränderlich gesicherte Stände. Weitere fachliche Phasen werden im Abstand von mindestens vier Stunden veröffentlicht. Die technische Entwicklung und die öffentliche Veröffentlichung haben unterschiedliche echte Zeitpunkte.

## Was hier zu sehen ist

| Schritt | Inhalt | Hier veröffentlicht |
|---|---|---|
| 1 | CSV-Vertrag und Datenqualität | Ja |
| 2 | SQLite-Import und drei Auswertungen | Ja |
| 3 | Power-BI-Bericht mit Power Query und DAX | Ja |
| 4 | Excel/VBA und Abgleich aller sieben Kennzahlen | Folgt |

## Demo

Live: <https://jorxas.github.io/werkstatt-datenqualitaet-bi/> (Deutsch, per Schalter auch Französisch).

Anwendungsfall: Eine Werkstatt exportiert Bestellungen als CSV und will wissen, welche Zeilen verlässlich sind und welcher Umsatz daraus folgt. Die Seite zeigt vier Eingabedateien, jede Zeile mit Prüfergebnis und Ablehnungsgrund, die drei SQL-Auswertungen und die gespeicherten SQLite-Tabellen. Alle Zahlen stammen aus echten Läufen von `src/aufbereiten.py`, `src/arbeitsdatenbank.py` und den Unit-Tests; die Seite selbst rechnet nichts nach. Power BI und Excel/VBA (Phasen 3 und 4) sind nicht Teil der Demo.

Neu erzeugen (schreibt `demo/daten.js`) und prüfen:

```powershell
uv run --offline --python 3.12 python -X utf8 -B demo/erzeugen.py
node demo/browser-pruefen.cjs   # braucht puppeteer-core (NODE_PATH) und Chrome oder Edge
```

Die Quellen liegen in `demo/`; veröffentlicht werden `index.html`, `stil.css`, `app.js` und `daten.js` über den Zweig `gh-pages`. Die Dateien in `demo/beispiel/` (außer der Projekt-CSV) wurden nur für die Demo ergänzt.

## Fachlicher Nutzen

Datenbereinigung, SQL, Kennzahlenabgleich und erklärbare BI-Berichte.

## Lokal starten

Im geklonten Repository ausführen; die benötigte Laufzeit muss installiert sein. Python-Beispiele verwenden 3.12, Node-Beispiele 24 und C# die im Projekt angegebene .NET-Version. Befehle mit uv laden die dort genau bezeichneten Pakete bei Bedarf.

```powershell
python -X utf8 src/arbeitsdatenbank.py
python -X utf8 -m unittest discover -s tests -v
```

Power BI: `bericht/Werkstatt.pbip` öffnen und vor der ersten Aktualisierung den Parameter `CsvDatei` auf die mitgelieferte lokale CSV setzen. Der private ursprüngliche Rechnerpfad ist in dieser Veröffentlichungskopie entfernt.

Ausführliche technische Befehle: [START.md](START.md). [Öffentlicher Prüfstand](ABNAHME.json) und [Quellphasen](VERLAUF.json) dokumentieren Herkunft und echte Ausführungsdaten. Eine neue Repositorykopie ist kein neuer nativer Desktoplauf.

## Ergebnis des lokal geprüften Schlussstands

12 synthetische Zeilen, 10 gültige Bestellungen, 2 Ablehnungen, 820 EUR; Monatswerte 340 und 480 EUR.

**Dieser Schlussstand ist lokal bereits geprüft, aber noch nicht vollständig in diesem Repository veröffentlicht.** Maßgeblich für den hier verfügbaren Code ist die Phasentabelle oben.

## Grenzen

Synthetische Daten; kein Cloud-BI-Projekt. Desktopdateien benötigen die genannten Produkte.

Eigenes kleines Lernprojekt mit synthetischen Daten, mit KI-Unterstützung entwickelt und geprüft. Keine Aussage über Berufserfahrung, menschliche Arbeitsstunden oder praktische Verwendung weiterer nur geplanter Produkte.

## Entwicklungshistorie

[Entwicklungshistorie](HISTORIE.md): die vorhandenen lokalen Änderungen, ihre ursprünglichen Daten und die spätere GitHub-Übernahme.
