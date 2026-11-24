import contextlib
import hashlib
import json
import platform
import sqlite3
import tempfile
import unittest
from pathlib import Path

projektordner = Path.cwd()
tempordner = projektordner / 'ausgabe/prueftemp'
tempordner.mkdir(parents=True, exist_ok=True)
tempfile.tempdir = str(tempordner)
with Path('nachweise/P01-T02-tests.txt').open('w', encoding='utf-8') as protokoll:
    ergebnis = unittest.TextTestRunner(stream=protokoll, verbosity=2).run(
        unittest.defaultTestLoader.discover('tests'))
with contextlib.closing(sqlite3.connect('ausgabe/werkstatt.sqlite')) as verbindung:
    verbindung.row_factory = sqlite3.Row
    kontrolle = {
        'python': platform.python_version(),
        'sqlite': sqlite3.sqlite_version,
        'quellzeilen': len(Path('beispieldaten/bestellungen.csv').read_text(encoding='utf-8-sig').splitlines()) - 1,
        'quelle_sha256': hashlib.sha256(Path('beispieldaten/bestellungen.csv').read_bytes()).hexdigest(),
        'integritaet': verbindung.execute('PRAGMA integrity_check').fetchone()[0],
        'ablehnungen': [dict(zeile) for zeile in verbindung.execute('SELECT * FROM abgelehnte_zeilen ORDER BY csv_zeile')],
        'tests_erfolgreich': ergebnis.wasSuccessful(),
        'testanzahl': ergebnis.testsRun,
    }
Path('nachweise/P01-T02-kontrolle.json').write_text(json.dumps(kontrolle, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(Path('nachweise/P01-T02-tests.txt').read_text(encoding='utf-8'))
print(json.dumps(kontrolle, ensure_ascii=False, indent=2))
raise SystemExit(not ergebnis.wasSuccessful())
