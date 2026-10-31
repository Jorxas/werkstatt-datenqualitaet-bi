# Technischer Einstieg — P01


## Einstiegspunkt ausführen

Für P01-T01 genügt Python 3.12 oder neuer; nur die Standardbibliothek wird verwendet. Power BI Desktop und Excel werden erst in späteren Tickets benötigt.

~~~powershell
python -X utf8 src/aufbereiten.py
~~~

Bei der Abnahme verwendet: Python 3.12.14 aus der bereits vorhandenen uv-Installation. Alternative ohne Download:

~~~powershell
uv run --offline --python 3.12 python -X utf8 src/aufbereiten.py
~~~

Die zwölf Beispielzeilen werden gelesen und geprüft. Ausgabe: zehn unauffällige und zwei auffällige Zeilen. Der Bericht wird unter ausgabe/pruefbericht.json gespeichert; Originaldaten bleiben unverändert. Der Bericht ist als erzeugte Ausgabe von Git ausgeschlossen und lässt sich erneut erstellen.

Eine andere Quelle oder Berichtsdatei lässt sich mit --quelle und --bericht angeben. Die Berichtsdatei darf nicht dieselbe Datei wie die Quelle sein. Unlesbare Quellen und unpassende CSV-Überschriften beenden das Programm mit Fehlercode 2. Gefundene Datenauffälligkeiten sind ein reguläres Prüfergebnis und kein Programmfehler.

## Funktionsprüfungen

~~~powershell
uv run --offline --python 3.12 python -X utf8 -m unittest discover -s tests -v
~~~

Vier Prüfungen: Originalbeispiel samt unverändertem Dateiinhalt, Nullbetrag und gültiger Schalttag, unzulässige Beträge sowie ungültiges Datum, fehlende oder doppelte Spaltenüberschrift. Alle am 31. Oktober 2026 erfolgreich ausgeführt.

## Nächste Aufgabe

P01-T01 ist abgeschlossen. Hier bewusst anhalten. In einer späteren Einheit folgt P01-T02 mit SQLite, Auswertungen und einer Tabelle für abgelehnte Zeilen.

## Technische Quellen

- [Python-CSV-Modul](https://docs.python.org/3/library/csv.html)
- [Datenwörterbuch und Grenzen](DATENWOERTERBUCH.md)

Vor dem Einbinden eines Frameworks dessen aktuelle offizielle Anleitung lesen.
