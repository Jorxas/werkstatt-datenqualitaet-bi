"""Bestellungen prüfen; Originaldaten bleiben unverändert (P01-T01)."""
import argparse
import csv
import json
from datetime import date
from decimal import Decimal, InvalidOperation
from pathlib import Path

FELDER = ("bestellung_id", "datum", "kategorie", "betrag")
PROJEKTORDNER = Path(__file__).resolve().parents[1]


def bestellungen_pruefen(zeilen):
    """CSV-Zeilennummern und ihre Werte prüfen, ohne Zeilen zu entfernen."""
    erste_fundstellen = {}
    auffaelligkeiten = []
    anzahl = 0
    for zeilennummer, bestellung in zeilen:
        anzahl += 1
        gruende = []
        if None in bestellung:
            gruende.append("Zusätzliche CSV-Werte ohne Spaltenüberschrift.")
        werte = {feld: (bestellung.get(feld) or "").strip() for feld in FELDER}
        kennung = werte["bestellung_id"]
        if not kennung:
            gruende.append("Bestellkennung fehlt.")
        elif kennung in erste_fundstellen:
            gruende.append(f"Bestellkennung {kennung} bereits in CSV-Zeile {erste_fundstellen[kennung]} vorhanden.")
        else:
            erste_fundstellen[kennung] = zeilennummer

        try:
            if date.fromisoformat(werte["datum"]).isoformat() != werte["datum"]:
                raise ValueError
        except ValueError:
            gruende.append("Datum fehlt oder ist kein gültiges Datum im Format JJJJ-MM-TT.")
        if werte["kategorie"] not in {"ersatzteile", "wartung"}:
            gruende.append("Kategorie muss ersatzteile oder wartung sein.")
        if not werte["betrag"]:
            gruende.append("Betrag fehlt.")
        else:
            try:
                betrag = Decimal(werte["betrag"])
                if not betrag.is_finite() or betrag < 0 or betrag.as_tuple().exponent < -2:
                    raise InvalidOperation
            except InvalidOperation:
                gruende.append("Betrag muss eine endliche, nicht negative Dezimalzahl mit höchstens zwei Nachkommastellen sein.")
        if gruende:
            auffaelligkeiten.append({"csv_zeile": zeilennummer, "bestellung_id": kennung, "gruende": gruende})

    return {"eingelesene_zeilen": anzahl, "unauffaellige_zeilen": anzahl - len(auffaelligkeiten),
            "auffaellige_zeilen": len(auffaelligkeiten), "auffaelligkeiten": auffaelligkeiten}


def datei_pruefen(quelle):
    with Path(quelle).open(encoding="utf-8-sig", newline="") as datei:
        leser = csv.DictReader(datei)
        if len(leser.fieldnames or []) != len(FELDER) or set(leser.fieldnames or []) != set(FELDER):
            raise ValueError("Erwartete CSV-Spalten: " + ", ".join(FELDER))
        return bestellungen_pruefen((leser.line_num, zeile) for zeile in leser)


def main():
    argumente = argparse.ArgumentParser(description="Bestellungen prüfen, ohne die Quelldatei zu ändern.")
    argumente.add_argument("--quelle", type=Path, default=PROJEKTORDNER / "beispieldaten/bestellungen.csv", help="Zu prüfende CSV-Datei")
    argumente.add_argument("--bericht", type=Path, default=PROJEKTORDNER / "ausgabe/pruefbericht.json", help="Zieldatei für den JSON-Prüfbericht")
    auswahl = argumente.parse_args()
    try:
        if auswahl.quelle.resolve() == auswahl.bericht.resolve():
            raise ValueError("Bericht und Quelldatei müssen unterschiedliche Dateien sein.")
        bericht = datei_pruefen(auswahl.quelle)
        auswahl.bericht.parent.mkdir(parents=True, exist_ok=True)
        auswahl.bericht.write_text(json.dumps(bericht, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    except (OSError, ValueError, csv.Error) as fehler:
        argumente.exit(2, f"Prüfung fehlgeschlagen: {fehler}\n")
    print(json.dumps(bericht, ensure_ascii=False, indent=2))
    print(f"Bericht gespeichert: {auswahl.bericht}")


if __name__ == "__main__":
    main()
