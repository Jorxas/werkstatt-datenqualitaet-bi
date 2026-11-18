"""Fachliche Beispiele für P01-T01, ohne zusätzliche Bibliotheken."""
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from aufbereiten import bestellungen_pruefen, datei_pruefen


class Bestellpruefung(unittest.TestCase):
    def test_beispieldaten_und_original_bleiben_erhalten(self):
        quelle = Path(__file__).resolve().parents[1] / "beispieldaten/bestellungen.csv"
        vorher = quelle.read_bytes()
        bericht = datei_pruefen(quelle)
        self.assertEqual((bericht["eingelesene_zeilen"], bericht["unauffaellige_zeilen"], bericht["auffaellige_zeilen"]), (12, 10, 2))
        self.assertEqual([eintrag["csv_zeile"] for eintrag in bericht["auffaelligkeiten"]], [12, 13])
        self.assertEqual(len(bericht["auffaelligkeiten"][1]["gruende"]), 2)
        self.assertIn("CSV-Zeile 11", bericht["auffaelligkeiten"][0]["gruende"][0])
        self.assertEqual(quelle.read_bytes(), vorher)

    def test_nullbetrag_und_gueltiger_schalttag(self):
        zeile = {"bestellung_id": "B20", "datum": "2024-02-29", "kategorie": "wartung", "betrag": "0.00"}
        self.assertEqual(bestellungen_pruefen([(2, zeile)])["auffaellige_zeilen"], 0)

    def test_ungueltiges_datum_und_unzulaessige_betraege(self):
        for betrag in ["-1", "NaN", "Infinity", "1.001", "kein-betrag"]:
            with self.subTest(betrag=betrag):
                zeile = {"bestellung_id": "B21", "datum": "2026-02-29", "kategorie": "wartung", "betrag": betrag}
                gruende = bestellungen_pruefen([(2, zeile)])["auffaelligkeiten"][0]["gruende"]
                self.assertEqual(len(gruende), 2)
                self.assertTrue(any("Datum" in grund for grund in gruende))
                self.assertTrue(any("Betrag" in grund for grund in gruende))

    def test_fehlende_oder_doppelte_spaltenueberschrift(self):
        with tempfile.TemporaryDirectory() as verzeichnis:
            quelle = Path(verzeichnis) / "beispiel.csv"
            for kopf in ["bestellung_id,datum,kategorie", "bestellung_id,datum,kategorie,bestellung_id"]:
                with self.subTest(kopf=kopf):
                    quelle.write_text(kopf + "\n", encoding="utf-8")
                    with self.assertRaisesRegex(ValueError, "Erwartete CSV-Spalten"):
                        datei_pruefen(quelle)


if __name__ == "__main__":
    unittest.main()
