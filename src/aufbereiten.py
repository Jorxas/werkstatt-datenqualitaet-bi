"""CSV-Einstieg; Bereinigung und Auswertung folgen in den Tickets."""
import csv
from pathlib import Path

def bestellungen_bereinigen(zeilen):
    raise NotImplementedError("P01-T01/T02: Eingabeprüfung und Duplikatbehandlung umsetzen")

if __name__ == "__main__":
    quelle = Path(__file__).resolve().parents[1] / "beispieldaten/bestellungen.csv"
    with quelle.open(encoding="utf-8", newline="") as datei:
        zeilen = list(csv.DictReader(datei))
    print(f"{len(zeilen)} Zeilen eingelesen; Bereinigung, SQL und Bericht noch offen.")
