"""Echte Excel-VBA-Ausgabe, gespeicherte Formeln, SQL und DAX abgleichen."""
import hashlib
import json
import re
import sys
import tempfile
import zipfile
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path
from xml.etree import ElementTree as ET

PROJEKT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJEKT / "src"))
from arbeitsdatenbank import arbeitsdatenbank_erstellen

def pruefen():
    csv = PROJEKT / "beispieldaten/bestellungen.csv"
    original = hashlib.sha256(csv.read_bytes()).hexdigest()
    assert original == "e1312cf41f5693d9b39f2444bfc3367305d5da2b84e5e20845d39c77483069d5"
    exceldateien = sorted(p for p in (PROJEKT / "nachweise").glob("P01-T04-excel-*.json")
                         if re.fullmatch(r"P01-T04-excel-\d{8}-\d{6}\.json",p.name))
    assert exceldateien, "Tatsächlichen VBA-Lauf zuerst in Excel ausführen."
    excel = json.loads(exceldateien[-1].read_text(encoding="utf-8"))
    dax = json.loads((PROJEKT / "nachweise/P01-T03-nach-wiederoeffnen.json").read_text(encoding="utf-8"))
    assert excel["erfolgreich"] and dax["erfolgreich"]
    ausgabe = PROJEKT / "ausgabe"
    ausgabe.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(dir=ausgabe) as bereich:
        sql = arbeitsdatenbank_erstellen(csv, Path(bereich) / "abgleich.sqlite")
    werte = sql["auswertungen"]
    sqlzahlen = [Decimal(werte["gesamtumsatz"][0]["umsatz_cent"])/100,
                Decimal(werte["gesamtumsatz"][0]["bestellungen"]), Decimal(sql["abgelehnte_zeilen"]),
                *[Decimal(z["umsatz_cent"])/100 for z in werte["monatsumsaetze"]],
                *[Decimal(z["umsatz_cent"])/100 for z in werte["kategorieumsaetze"]]]
    ergebnisse = dax["ergebnisse"]
    daxzahlen = [Decimal(ergebnisse["gesamt"][0]["[umsatz]"]),
                Decimal(ergebnisse["gesamt"][0]["[anzahl]"]),Decimal(ergebnisse["gesamt"][0]["[abgelehnt]"]),
                *[Decimal(z["[umsatz]"]) for z in ergebnisse["monate"]],
                *[Decimal(z["[umsatz]"]) for z in ergebnisse["kategorien"]]]
    assert sqlzahlen == daxzahlen == list(map(Decimal,excel["formelwerte"])) == list(map(Decimal,[820,10,2,340,480,320,500]))
    assert (excel["originalzeilen"],excel["unvollstaendig"],excel["doppelt"]) == (12,1,1)
    arbeitsmappe = PROJEKT / "excel/Werkstatt.xlsm"
    namensraum = {"x":"http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    with zipfile.ZipFile(arbeitsmappe) as archiv:
        assert "xl/vbaProject.bin" in archiv.namelist(), "Gespeicherter VBA-Code fehlt."
        blatt = ET.fromstring(archiv.read("xl/worksheets/sheet2.xml"))
        formeln = []
        for nr,soll in zip(range(3,10),sqlzahlen):
            zelle = blatt.find(f".//x:c[@r='B{nr}']",namensraum)
            assert zelle is not None
            formel = zelle.find("x:f",namensraum)
            wert = zelle.find("x:v",namensraum)
            assert formel is not None and formel.text and wert is not None
            assert Decimal(wert.text) == soll, "Gespeicherter nativer Formelcache weicht ab."
            formeln.append({"zelle":f"B{nr}","formel":formel.text,"wert":wert.text})
    assert hashlib.sha256(csv.read_bytes()).hexdigest() == original
    nachweis = {"zeitpunkt":datetime.now(timezone.utc).isoformat(),"erfolgreich":True,
                "pruefung":"Aktueller SQL-Lauf sowie gespeicherte echte DAX-/VBA-Läufe und native Formelwerte verglichen; keine erneute Excel-/Power-BI-Ausführung durch diesen Prüfer.",
                "urspruenglicher_vba_zeitpunkt":excel["lokaler_zeitpunkt"],
                "urspruenglicher_dax_zeitpunkt":dax["zeitpunkt"],"excel_nachweis":exceldateien[-1].name,
                "quellhash":original,"arbeitsmappe_sha256":hashlib.sha256(arbeitsmappe.read_bytes()).hexdigest(),
                "abgleich":[str(z) for z in sqlzahlen],"gespeicherte_formeln":formeln}
    (PROJEKT / "nachweise/P01-T04-abgleich.json").write_text(json.dumps(nachweis,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("Bestanden: sieben Excel-Formeln, VBA-Code und gespeicherte Werte; SQL = DAX = Excel, Original-CSV unverändert.")

if __name__ == "__main__":
    pruefen()
