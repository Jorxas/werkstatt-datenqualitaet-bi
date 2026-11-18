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

## Nächste Aufgabe

P01-T02 ist abgeschlossen. Hier bewusst anhalten. P01-T03 bleibt einer späteren freigegebenen Einheit vorbehalten. Der Vergleich zwischen SQL, Excel und Power BI ist noch offen.

## Technische Quellen

- [Python-CSV-Modul](https://docs.python.org/3/library/csv.html)
- [Datenwörterbuch und Grenzen](DATENWOERTERBUCH.md)

Vor dem Einbinden eines Frameworks dessen aktuelle offizielle Anleitung lesen.
