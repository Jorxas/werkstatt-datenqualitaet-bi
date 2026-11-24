# Technischer Einstieg — P01


## Einstiegspunkt ausführen

Für P01-T01 und P01-T02 genügt Python 3.12 oder neuer; nur die Standardbibliothek einschließlich SQLite wird verwendet. Power BI Desktop und Excel werden erst in späteren Tickets benötigt.

~~~powershell
python -X utf8 src/aufbereiten.py
~~~

Bei der Abnahme verwendet: Python 3.12.14 aus der bereits vorhandenen uv-Installation. Alternative ohne Download:

~~~powershell
uv run --offline --python 3.12 python -X utf8 src/aufbereiten.py
~~~

Die zwölf Beispielzeilen werden gelesen und geprüft. Ausgabe: zehn unauffällige und zwei auffällige Zeilen. Der Bericht wird unter ausgabe/pruefbericht.json gespeichert; Originaldaten bleiben unverändert. Der Bericht ist als erzeugte Ausgabe von Git ausgeschlossen und lässt sich erneut erstellen.

Eine andere Quelle oder Berichtsdatei lässt sich mit --quelle und --bericht angeben. Die Berichtsdatei darf nicht dieselbe Datei wie die Quelle sein. Unlesbare Quellen und unpassende CSV-Überschriften beenden das Programm mit Fehlercode 2. Gefundene Datenauffälligkeiten sind ein reguläres Prüfergebnis und kein Programmfehler.

## SQLite-Arbeitsdatenbank und Auswertungen (P01-T02)

~~~powershell
uv run --offline --python 3.12 python -X utf8 src/arbeitsdatenbank.py
~~~

Erstellt `ausgabe/werkstatt.sqlite` und führt `sql/gesamtumsatz.sql`, `sql/monatsumsaetze.sql` und `sql/kategorieumsaetze.sql` aus. Beobachtet mit Python 3.12.14 und SQLite 3.53.1: zwölf eingelesen, zehn übernommen, zwei abgelehnt. Gesamt: 82000 Cent; Monate: 34000 und 48000 Cent; Kategorien: 32000 und 50000 Cent.

`bestellungen` enthält die technisch unauffälligen Zeilen mit CSV-Zeilennummer und ganzzahligem `betrag_cent`. `abgelehnte_zeilen` enthält CSV-Zeilennummer, unveränderte eingelesene Werte als JSON und alle Ablehnungsgründe als JSON. Es gelten die Regeln aus P01-T01: Eine bereits vorgekommene Kennung wird abgelehnt, auch wenn ihre erste Fundstelle andere Fehler hatte. Unauffällige Werte werden außen von Leerzeichen befreit. Die Quelldatei bleibt unverändert.

Mit `--quelle` und `--datenbank` andere Pfade wählen; die Datenbank muss eine eigene Arbeitsdatei sein. Ein erneuter Lauf ersetzt den Inhalt beider Tabellen gemeinsam in einer Transaktion; er hängt keine Zeilen an. Keine Datenbankmigration, kein dauerhafter Importverlauf. Beträge außerhalb des SQLite-Ganzzahlbereichs brechen den Import vor dem Schreiben ab; auch Summen müssen in diesen Bereich passen. Fehler führen zu Exitcode 2, reguläre Zeilenablehnungen zu Exitcode 0.

## Funktionsprüfungen

~~~powershell
New-Item -ItemType Directory -Force ausgabe/prueftemp | Out-Null
$env:TEMP = (Resolve-Path ausgabe/prueftemp).Path
$env:TMP = $env:TEMP
uv run --offline --python 3.12 python -X utf8 -m unittest discover -s tests -v
~~~

Sechs Prüfungen am 2. November 2026 erfolgreich: die vier bisherigen CSV-Prüfungen sowie SQLite-Import mit vollständiger Aufteilung, Originalwerten und Ablehnungsgründen, den drei erwarteten Auswertungen, unveränderter Quelle, wiederholtem Import ohne Verdopplung und Integritätsprüfung; außerdem centgenaue Summe 0,10 + 0,20 Euro und Erhalt der bestehenden Datenbank bei falschem CSV-Kopf. Temporäre Prüfdateien liegen damit im Projekt-Ausgabeordner.

Die tatsächlich ausgeführte Abnahme einschließlich Protokollierung lässt sich nach dem Datenbankaufbau mit `uv run --offline --python 3.12 python -X utf8 nachweise/P01-T02-pruefen.py` wiederholen. Sie überschreibt ihre erzeugten Prüfprotokolle. Befehle und Ergebnisse: [Abnahme](nachweise/P01-T02-abnahme.md).

## Historische Power-BI-Voraussetzung vom 4. November (behoben)

P01-T02 ist abgeschlossen. Die freigegebene Einheit P01-T03 ist am 4. November 2026 blockiert: Power BI Desktop wurde lokal nicht gefunden. Die Voraussetzung lässt sich im Projektordner erneut prüfen:

~~~powershell
& '.\nachweise\P01-T03-voraussetzungen.ps1'
~~~

Die Prüfung schreibt `nachweise/P01-T03-voraussetzungen.json` neu. Sie prüft drei Standardpfade, PATH, laufende Prozesse, Store-Pakete des Benutzers, Installationsregistrierung und Startmenü sowie Zeilenzahl und SHA256 der synthetischen CSV. Dies ist eine Prüfung der Auffindbarkeit, keine Ausführung von Power BI. Keine vollständige Datenträgersuche; unterdrückte Registrierungszugriffsfehler werden nicht als Produktnachweis gewertet.

Erst mit tatsächlich zugänglichem Power BI Desktop in einer erneut freigegebenen Einheit fortsetzen: vorhandene CSV importieren, Power Query ausführen, zwei DAX-Kennzahlen, Monatsfilter und zwei Seiten einschließlich Datenqualität erstellen; echte Berichtsdatei unter `bericht/` speichern und lokal öffnen sowie prüfen. [Blockade und Abnahmegrenze](nachweise/P01-T03-blockade.md). Hier angehalten; der Vergleich zwischen SQL, Excel und Power BI bleibt offen.

## Technische Quellen

- [Python-CSV-Modul](https://docs.python.org/3/library/csv.html)
- [Datenwörterbuch und Grenzen](DATENWOERTERBUCH.md)

Vor dem Einbinden eines Frameworks dessen aktuelle offizielle Anleitung lesen.

## P01-T03 — tatsächlicher Power-BI-Bericht

Power BI Desktop 2.159.1231.0 und .NET 10 verwendet. **bericht/Werkstatt.pbip** öffnen. Der native gespeicherte Modellstand verwendet TMSL (**model.bim**); das angebotene TMDL-Upgrade wurde nicht ausgeführt. Der lokale Cache und Einstellungen unter .pbi sind ausgeschlossen.

Bei einem neuen Speicherort: Daten transformieren → Parameter CsvDatei auf die absolute Originaldatei setzen. Anschließend die Daten laden, nicht nur das Schema aktualisieren. Beim ersten Öffnen ohne Cache kann das Banner „Einige Tabellen enthalten unvollständige oder keine Daten“ erscheinen; „Jetzt aktualisieren“ lädt die drei Tabellen. Keine Datenschutz- oder Sicherheitseinstellung ändern.

Power Query: UTF-8-CSV mit vier vorgegebenen Spalten lesen; Kopf übernehmen; Leerzeichen trimmen; physische CSV-Zeilen ab zwei nummerieren. Kennung, erstes Vorkommen, Datum, Kategorie und Betrag prüfen. Fehlergründe sammeln. Rohdaten behalten alle zwölf Zeilen; Bestellungen enthält zehn gültige, Abgelehnte Zeilen die beiden übrigen. Der Monat ist JJJJ-MM. Geld wird als Currency und im Modell decimal verarbeitet. Für anders strukturierte Dateien zuerst den strengeren Python-Prüfer einsetzen: Die kleine M-Abfrage ist auf diesen CSV-Vertrag begrenzt und prüft keine zusätzliche Spaltenzahl oder die textuelle Nachkommastellenzahl wie Decimal in Python.

DAX: Gesamtumsatz = SUM(Bestellungen[Betrag]); Bestellanzahl = COUNTROWS(Bestellungen). Weitere Zähler betreffen Rohdaten und Ablehnungen. Der Monatsfilter wirkt auf die Bestellungen, beide Kennzahlen und Auswertungstabellen; die unabhängige Qualitätsseite zeigt den Gesamtimport.

Lesende Prüfung gegen genau den geöffneten Bericht (Prozessnummer aus dem Brückenstatus einsetzen):

~~~powershell
dotnet restore pruefungen/Modellpruefung.csproj
& ./pruefungen/PowerBI_pruefen.ps1 -DesktopProzess <PID> -BrueckenCli <Pfad-zur-offiziellen-Bruecken-CLI>
~~~

Die offizielle Brücke ist @microsoft/powerbi-desktop-bridge-cli 1.0.0; lokal vom Koordinator außerhalb des Projekts installiert. Der Prüfer kontrolliert die Berichtidentität und ordnet den lokalen Modellserver anhand seines Elternprozesses zu. Microsoft.AnalysisServices.AdomdClient 19.120.1 führt fünf DAX-Abfragen aus. Kein beliebiger fremder Modellserver wird verändert. Er prüft die erwarteten Summen, Mengen, Monate, Kategorien, Januarfilter und Originalfehlerzeilen. Erst nach erfolgreicher Prüfung wird JSON mit tatsächlichem Zeitpunkt geschrieben.

**src/bericht_erstellen.cjs** dokumentiert die ursprüngliche Erstellung auf Grundlage eines mit @microsoft/powerbi-report-authoring-cli 0.5.0 erzeugten Gerüsts. Nicht unbedacht erneut ausführen: Es überschreibt die selbst erzeugten Berichts- und Modelldefinitionen. Der eingecheckte native Speicherstand ist der Lieferstand. Für spätere Anpassungen die kleinen PBIR-Dateien bearbeiten oder Desktop verwenden, dann tatsächlich neu prüfen.

Quellen: [Microsoft PBIP-Modellformat](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-dataset), [Berichtsformat](https://learn.microsoft.com/en-us/power-bi/developer/projects/projects-report), [offizielle Desktop-Brücke](https://github.com/microsoft/skills-for-fabric/tree/main/cli/powerbi-desktop-bridge-cli), [ADOMD.NET](https://learn.microsoft.com/en-us/analysis-services/adomd/multidimensional-models/adomd-net-client-programming).
