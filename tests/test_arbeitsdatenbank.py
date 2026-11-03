"""SQLite-Abnahme: vollständige Aufteilung, Summen und wiederholbarer Import."""
import json
import sqlite3
import sys
import tempfile
import unittest
from contextlib import closing
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from arbeitsdatenbank import arbeitsdatenbank_erstellen

PROJEKTORDNER = Path(__file__).resolve().parents[1]


class Arbeitsdatenbankpruefung(unittest.TestCase):
    def test_beispieldaten_ablehnungen_summen_und_wiederholung(self):
        quelle = PROJEKTORDNER / "beispieldaten/bestellungen.csv"
        vorher = quelle.read_bytes()
        with tempfile.TemporaryDirectory() as verzeichnis:
            datenbank = Path(verzeichnis) / "werkstatt.sqlite"
            ergebnis = arbeitsdatenbank_erstellen(quelle, datenbank)
            self.assertEqual((ergebnis["eingelesene_zeilen"], ergebnis["uebernommene_zeilen"],
                              ergebnis["abgelehnte_zeilen"]), (12, 10, 2))
            self.assertEqual(ergebnis["auswertungen"], {
                "gesamtumsatz": [{"bestellungen": 10, "umsatz_cent": 82000}],
                "monatsumsaetze": [
                    {"monat": "2026-01", "bestellungen": 4, "umsatz_cent": 34000},
                    {"monat": "2026-02", "bestellungen": 6, "umsatz_cent": 48000}],
                "kategorieumsaetze": [
                    {"kategorie": "ersatzteile", "bestellungen": 5, "umsatz_cent": 32000},
                    {"kategorie": "wartung", "bestellungen": 5, "umsatz_cent": 50000}],
            })
            self.assertEqual(arbeitsdatenbank_erstellen(quelle, datenbank), ergebnis)
            with closing(sqlite3.connect(datenbank)) as verbindung:
                ablehnungen = verbindung.execute("SELECT * FROM abgelehnte_zeilen ORDER BY csv_zeile").fetchall()
                self.assertEqual([zeile[0] for zeile in ablehnungen], [12, 13])
                self.assertEqual(json.loads(ablehnungen[0][1])["bestellung_id"], "B10")
                self.assertIn("CSV-Zeile 11", json.loads(ablehnungen[0][2])[0])
                self.assertEqual(json.loads(ablehnungen[1][1])["betrag"], "")
                self.assertEqual(len(json.loads(ablehnungen[1][2])), 2)
                uebernommene = {zeile[0] for zeile in verbindung.execute("SELECT csv_zeile FROM bestellungen")}
                self.assertEqual(uebernommene | {12, 13}, set(range(2, 14)))
                self.assertFalse(uebernommene & {12, 13})
                self.assertEqual(verbindung.execute("PRAGMA integrity_check").fetchone()[0], "ok")
            self.assertEqual(quelle.read_bytes(), vorher)

    def test_cent_genau_und_fehlende_voraussetzung_erhaelt_arbeitsstand(self):
        with tempfile.TemporaryDirectory() as verzeichnis:
            quelle = Path(verzeichnis) / "bestellungen.csv"
            datenbank = Path(verzeichnis) / "werkstatt.sqlite"
            quelle.write_text("bestellung_id,datum,kategorie,betrag\n"
                              "B01,2026-01-01,wartung,0.10\n"
                              "B02,2026-01-01,wartung,0.20\n", encoding="utf-8")
            ergebnis = arbeitsdatenbank_erstellen(quelle, datenbank)
            self.assertEqual(ergebnis["auswertungen"]["gesamtumsatz"][0]["umsatz_cent"], 30)
            vorher = datenbank.read_bytes()
            quelle.write_text("falsche_spalte\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Erwartete CSV-Spalten"):
                arbeitsdatenbank_erstellen(quelle, datenbank)
            self.assertEqual(datenbank.read_bytes(), vorher)
            with self.assertRaisesRegex(ValueError, "unterschiedliche Dateien"):
                arbeitsdatenbank_erstellen(quelle, quelle)


if __name__ == "__main__":
    unittest.main()
