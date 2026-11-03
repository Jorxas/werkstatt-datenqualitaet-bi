"""Geprüfte Bestellungen in SQLite laden und drei Auswertungen ausführen."""
import argparse
import csv
import json
import sqlite3
from decimal import Decimal
from pathlib import Path

from aufbereiten import FELDER, PROJEKTORDNER, bestellungen_pruefen, datei_lesen

ABFRAGEN = ("gesamtumsatz", "monatsumsaetze", "kategorieumsaetze")


def arbeitsdatenbank_erstellen(quelle, datenbank):
    """Beide Tabellen atomar durch den geprüften Stand einer CSV ersetzen."""
    quelle, datenbank = Path(quelle), Path(datenbank)
    if quelle.resolve() == datenbank.resolve():
        raise ValueError("Datenbank und Quelldatei müssen unterschiedliche Dateien sein.")
    zeilen = datei_lesen(quelle)
    bericht = bestellungen_pruefen(zeilen)
    ablehnungen = {eintrag["csv_zeile"]: eintrag["gruende"]
                   for eintrag in bericht["auffaelligkeiten"]}
    bestellungen = []
    abgelehnte_zeilen = []
    for zeilennummer, originalwerte in zeilen:
        if zeilennummer in ablehnungen:
            abgelehnte_zeilen.append((
                zeilennummer,
                json.dumps(originalwerte, ensure_ascii=False),
                json.dumps(ablehnungen[zeilennummer], ensure_ascii=False),
            ))
        else:
            werte = {feld: originalwerte[feld].strip() for feld in FELDER}
            zaehler, nenner = Decimal(werte["betrag"]).as_integer_ratio()
            betrag_cent = zaehler * 100 // nenner
            if betrag_cent > 2**63 - 1:
                raise ValueError(f"Betrag in CSV-Zeile {zeilennummer} überschreitet den SQLite-Ganzzahlbereich.")
            bestellungen.append((werte["bestellung_id"], zeilennummer,
                                  werte["datum"], werte["kategorie"], betrag_cent))

    datenbank.parent.mkdir(parents=True, exist_ok=True)
    verbindung = sqlite3.connect(datenbank)
    try:
        verbindung.executescript((PROJEKTORDNER / "sql/schema.sql").read_text(encoding="utf-8"))
        with verbindung:
            verbindung.execute("DELETE FROM bestellungen")
            verbindung.execute("DELETE FROM abgelehnte_zeilen")
            verbindung.executemany("INSERT INTO bestellungen VALUES (?, ?, ?, ?, ?)", bestellungen)
            verbindung.executemany("INSERT INTO abgelehnte_zeilen VALUES (?, ?, ?)", abgelehnte_zeilen)
        verbindung.row_factory = sqlite3.Row
        auswertungen = {
            name: [dict(zeile) for zeile in verbindung.execute(
                (PROJEKTORDNER / f"sql/{name}.sql").read_text(encoding="utf-8"))]
            for name in ABFRAGEN
        }
    finally:
        verbindung.close()
    return {"eingelesene_zeilen": len(zeilen), "uebernommene_zeilen": len(bestellungen),
            "abgelehnte_zeilen": len(abgelehnte_zeilen), "auswertungen": auswertungen}


def main():
    argumente = argparse.ArgumentParser(description="SQLite-Arbeitsstand aus geprüften Bestellungen erstellen.")
    argumente.add_argument("--quelle", type=Path, default=PROJEKTORDNER / "beispieldaten/bestellungen.csv",
                           help="Synthetische Bestellungen als CSV")
    argumente.add_argument("--datenbank", type=Path, default=PROJEKTORDNER / "ausgabe/werkstatt.sqlite",
                           help="SQLite-Arbeitsdatei; ihre beiden Tabellen werden ersetzt")
    auswahl = argumente.parse_args()
    try:
        ergebnis = arbeitsdatenbank_erstellen(auswahl.quelle, auswahl.datenbank)
    except (OSError, ValueError, csv.Error, sqlite3.Error) as fehler:
        argumente.exit(2, f"Datenbankaufbau fehlgeschlagen: {fehler}\n")
    print(json.dumps(ergebnis, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
