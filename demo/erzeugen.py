"""Führt die echten Programme des Projekts auf Beispieldateien aus und schreibt demo/daten.js.

Aufruf im Projektordner:
  uv run --offline --python 3.12 python -X utf8 -B demo/erzeugen.py

Nichts wird nachgebaut: Die Prüfung läuft über src/aufbereiten.py, der SQLite-Import samt
SQL-Auswertungen über src/arbeitsdatenbank.py (jeweils als Kommandozeile), die Unit-Tests
über unittest. Die Ausgaben werden unverändert in die Demo übernommen.
"""
import json
import re
import sqlite3
import subprocess
import sys
import tempfile
from datetime import date
from pathlib import Path

sys.dont_write_bytecode = True
PROJEKT = Path(__file__).resolve().parents[1]

VARIANTEN = [
    ("original", PROJEKT / "beispieldaten" / "bestellungen.csv"),
    ("bereinigt", PROJEKT / "demo" / "beispiel" / "bereinigt.csv"),
    ("fehler", PROJEKT / "demo" / "beispiel" / "typische-fehler.csv"),
    ("leer", PROJEKT / "demo" / "beispiel" / "nur-kopfzeile.csv"),
]


def ausfuehren(*argumente):
    prozess = subprocess.run([sys.executable, "-X", "utf8", "-B", *argumente], cwd=PROJEKT,
                             capture_output=True, text=True, encoding="utf-8", timeout=60, check=False)
    if prozess.returncode != 0:
        raise SystemExit(f"Fehlgeschlagen: {argumente}\n{prozess.stderr}")
    return prozess


def erstes_json(text):
    """Die JSON-Ausgabe eines Programms lesen; die Textzeile danach (Dateipfad) wird verworfen."""
    objekt, _ = json.JSONDecoder().raw_decode(text.lstrip())
    return objekt


def tabelle(datenbank, abfrage):
    verbindung = sqlite3.connect(datenbank)
    try:
        return [list(zeile) for zeile in verbindung.execute(abfrage)]
    finally:
        verbindung.close()


def variante(ordner, name, quelle):
    bericht_datei = ordner / f"{name}-bericht.json"
    datenbank = ordner / f"{name}.sqlite"
    pruefung = erstes_json(ausfuehren("src/aufbereiten.py", "--quelle", str(quelle),
                                      "--bericht", str(bericht_datei)).stdout)
    import_ = erstes_json(ausfuehren("src/arbeitsdatenbank.py", "--quelle", str(quelle),
                                     "--datenbank", str(datenbank)).stdout)
    return {
        "name": name,
        "csv": quelle.read_text(encoding="utf-8-sig").splitlines(),
        "pruefung": pruefung,
        "import": import_,
        "bestellungen": tabelle(datenbank, "SELECT bestellung_id, csv_zeile, datum, kategorie, betrag_cent "
                                           "FROM bestellungen ORDER BY csv_zeile"),
        "abgelehnt": [[z[0], json.loads(z[1]), json.loads(z[2])] for z in tabelle(
            datenbank, "SELECT csv_zeile, originalwerte_json, gruende_json FROM abgelehnte_zeilen ORDER BY csv_zeile")],
    }


def tests():
    prozess = subprocess.run([sys.executable, "-X", "utf8", "-B", "-m", "unittest", "discover", "-s", "tests", "-v"],
                             cwd=PROJEKT, capture_output=True, text=True, encoding="utf-8", timeout=120, check=False)
    ausgabe = prozess.stderr + prozess.stdout
    anzahl = re.search(r"Ran (\d+) tests?", ausgabe)
    return {"erfolgreich": prozess.returncode == 0 and "\nOK" in ausgabe,
            "anzahl": int(anzahl.group(1)) if anzahl else 0,
            "faelle": re.findall(r"^(test\w+) \(([\w.]+)\)", ausgabe, flags=re.MULTILINE)}


def hauptteil():
    commit = subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=PROJEKT, capture_output=True,
                            text=True, check=True).stdout.strip()
    with tempfile.TemporaryDirectory(prefix="werkstatt-demo-") as ordner:
        laeufe = [variante(Path(ordner), name, quelle) for name, quelle in VARIANTEN]
    abfragen = {name: (PROJEKT / "sql" / f"{name}.sql").read_text(encoding="utf-8").strip()
                for name in ("gesamtumsatz", "monatsumsaetze", "kategorieumsaetze")}
    daten = {
        "erzeugt_am": date.today().isoformat(),
        "projekt_commit": commit,
        "versionen": {"python": sys.version.split()[0], "sqlite": sqlite3.sqlite_version},
        "abfragen": abfragen,
        "tests": tests(),
        "laeufe": laeufe,
    }
    ziel = PROJEKT / "demo" / "daten.js"
    ziel.write_text("window.DEMO_DATEN = " + json.dumps(daten, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    print("geschrieben:", ziel.relative_to(PROJEKT), "| Varianten:", len(laeufe), "| Tests:", daten["tests"]["anzahl"])


if __name__ == "__main__":
    hauptteil()
