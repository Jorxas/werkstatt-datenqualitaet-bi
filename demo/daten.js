window.DEMO_DATEN = {
 "erzeugt_am": "2026-11-23",
 "projekt_commit": "270d181",
 "versionen": {
  "python": "3.12.14",
  "sqlite": "3.53.1"
 },
 "abfragen": {
  "gesamtumsatz": "-- Nur übernommene Bestellungen zählen; leere Datenmenge ergibt null Cent.\nSELECT COUNT(*) AS bestellungen, COALESCE(SUM(betrag_cent), 0) AS umsatz_cent\nFROM bestellungen;",
  "monatsumsaetze": "SELECT substr(datum, 1, 7) AS monat, COUNT(*) AS bestellungen,\n       SUM(betrag_cent) AS umsatz_cent\nFROM bestellungen\nGROUP BY substr(datum, 1, 7)\nORDER BY monat;",
  "kategorieumsaetze": "SELECT kategorie, COUNT(*) AS bestellungen, SUM(betrag_cent) AS umsatz_cent\nFROM bestellungen\nGROUP BY kategorie\nORDER BY kategorie;"
 },
 "tests": {
  "erfolgreich": true,
  "anzahl": 6,
  "faelle": [
   [
    "test_beispieldaten_ablehnungen_summen_und_wiederholung",
    "test_arbeitsdatenbank.Arbeitsdatenbankpruefung.test_beispieldaten_ablehnungen_summen_und_wiederholung"
   ],
   [
    "test_cent_genau_und_fehlende_voraussetzung_erhaelt_arbeitsstand",
    "test_arbeitsdatenbank.Arbeitsdatenbankpruefung.test_cent_genau_und_fehlende_voraussetzung_erhaelt_arbeitsstand"
   ],
   [
    "test_beispieldaten_und_original_bleiben_erhalten",
    "test_bestellungen.Bestellpruefung.test_beispieldaten_und_original_bleiben_erhalten"
   ],
   [
    "test_fehlende_oder_doppelte_spaltenueberschrift",
    "test_bestellungen.Bestellpruefung.test_fehlende_oder_doppelte_spaltenueberschrift"
   ],
   [
    "test_nullbetrag_und_gueltiger_schalttag",
    "test_bestellungen.Bestellpruefung.test_nullbetrag_und_gueltiger_schalttag"
   ],
   [
    "test_ungueltiges_datum_und_unzulaessige_betraege",
    "test_bestellungen.Bestellpruefung.test_ungueltiges_datum_und_unzulaessige_betraege"
   ]
  ]
 },
 "laeufe": [
  {
   "name": "original",
   "csv": [
    "bestellung_id,datum,kategorie,betrag",
    "B01,2026-01-02,ersatzteile,120",
    "B02,2026-01-04,wartung,80",
    "B03,2026-01-05,ersatzteile,40",
    "B04,2026-01-06,wartung,100",
    "B05,2026-02-01,ersatzteile,60",
    "B06,2026-02-02,wartung,120",
    "B07,2026-02-03,ersatzteile,30",
    "B08,2026-02-04,wartung,90",
    "B09,2026-02-05,ersatzteile,70",
    "B10,2026-02-06,wartung,110",
    "B10,2026-02-06,wartung,110",
    ",2026-02-07,ersatzteile,"
   ],
   "pruefung": {
    "eingelesene_zeilen": 12,
    "unauffaellige_zeilen": 10,
    "auffaellige_zeilen": 2,
    "auffaelligkeiten": [
     {
      "csv_zeile": 12,
      "bestellung_id": "B10",
      "gruende": [
       "Bestellkennung B10 bereits in CSV-Zeile 11 vorhanden."
      ]
     },
     {
      "csv_zeile": 13,
      "bestellung_id": "",
      "gruende": [
       "Bestellkennung fehlt.",
       "Betrag fehlt."
      ]
     }
    ]
   },
   "import": {
    "eingelesene_zeilen": 12,
    "uebernommene_zeilen": 10,
    "abgelehnte_zeilen": 2,
    "auswertungen": {
     "gesamtumsatz": [
      {
       "bestellungen": 10,
       "umsatz_cent": 82000
      }
     ],
     "monatsumsaetze": [
      {
       "monat": "2026-01",
       "bestellungen": 4,
       "umsatz_cent": 34000
      },
      {
       "monat": "2026-02",
       "bestellungen": 6,
       "umsatz_cent": 48000
      }
     ],
     "kategorieumsaetze": [
      {
       "kategorie": "ersatzteile",
       "bestellungen": 5,
       "umsatz_cent": 32000
      },
      {
       "kategorie": "wartung",
       "bestellungen": 5,
       "umsatz_cent": 50000
      }
     ]
    }
   },
   "bestellungen": [
    [
     "B01",
     2,
     "2026-01-02",
     "ersatzteile",
     12000
    ],
    [
     "B02",
     3,
     "2026-01-04",
     "wartung",
     8000
    ],
    [
     "B03",
     4,
     "2026-01-05",
     "ersatzteile",
     4000
    ],
    [
     "B04",
     5,
     "2026-01-06",
     "wartung",
     10000
    ],
    [
     "B05",
     6,
     "2026-02-01",
     "ersatzteile",
     6000
    ],
    [
     "B06",
     7,
     "2026-02-02",
     "wartung",
     12000
    ],
    [
     "B07",
     8,
     "2026-02-03",
     "ersatzteile",
     3000
    ],
    [
     "B08",
     9,
     "2026-02-04",
     "wartung",
     9000
    ],
    [
     "B09",
     10,
     "2026-02-05",
     "ersatzteile",
     7000
    ],
    [
     "B10",
     11,
     "2026-02-06",
     "wartung",
     11000
    ]
   ],
   "abgelehnt": [
    [
     12,
     {
      "bestellung_id": "B10",
      "datum": "2026-02-06",
      "kategorie": "wartung",
      "betrag": "110"
     },
     [
      "Bestellkennung B10 bereits in CSV-Zeile 11 vorhanden."
     ]
    ],
    [
     13,
     {
      "bestellung_id": "",
      "datum": "2026-02-07",
      "kategorie": "ersatzteile",
      "betrag": ""
     },
     [
      "Bestellkennung fehlt.",
      "Betrag fehlt."
     ]
    ]
   ]
  },
  {
   "name": "bereinigt",
   "csv": [
    "bestellung_id,datum,kategorie,betrag",
    "B01,2026-01-02,ersatzteile,120",
    "B02,2026-01-04,wartung,80",
    "B03,2026-01-05,ersatzteile,40",
    "B04,2026-01-06,wartung,100",
    "B05,2026-02-01,ersatzteile,60",
    "B06,2026-02-02,wartung,120",
    "B07,2026-02-03,ersatzteile,30",
    "B08,2026-02-04,wartung,90",
    "B09,2026-02-05,ersatzteile,70",
    "B10,2026-02-06,wartung,110"
   ],
   "pruefung": {
    "eingelesene_zeilen": 10,
    "unauffaellige_zeilen": 10,
    "auffaellige_zeilen": 0,
    "auffaelligkeiten": []
   },
   "import": {
    "eingelesene_zeilen": 10,
    "uebernommene_zeilen": 10,
    "abgelehnte_zeilen": 0,
    "auswertungen": {
     "gesamtumsatz": [
      {
       "bestellungen": 10,
       "umsatz_cent": 82000
      }
     ],
     "monatsumsaetze": [
      {
       "monat": "2026-01",
       "bestellungen": 4,
       "umsatz_cent": 34000
      },
      {
       "monat": "2026-02",
       "bestellungen": 6,
       "umsatz_cent": 48000
      }
     ],
     "kategorieumsaetze": [
      {
       "kategorie": "ersatzteile",
       "bestellungen": 5,
       "umsatz_cent": 32000
      },
      {
       "kategorie": "wartung",
       "bestellungen": 5,
       "umsatz_cent": 50000
      }
     ]
    }
   },
   "bestellungen": [
    [
     "B01",
     2,
     "2026-01-02",
     "ersatzteile",
     12000
    ],
    [
     "B02",
     3,
     "2026-01-04",
     "wartung",
     8000
    ],
    [
     "B03",
     4,
     "2026-01-05",
     "ersatzteile",
     4000
    ],
    [
     "B04",
     5,
     "2026-01-06",
     "wartung",
     10000
    ],
    [
     "B05",
     6,
     "2026-02-01",
     "ersatzteile",
     6000
    ],
    [
     "B06",
     7,
     "2026-02-02",
     "wartung",
     12000
    ],
    [
     "B07",
     8,
     "2026-02-03",
     "ersatzteile",
     3000
    ],
    [
     "B08",
     9,
     "2026-02-04",
     "wartung",
     9000
    ],
    [
     "B09",
     10,
     "2026-02-05",
     "ersatzteile",
     7000
    ],
    [
     "B10",
     11,
     "2026-02-06",
     "wartung",
     11000
    ]
   ],
   "abgelehnt": []
  },
  {
   "name": "fehler",
   "csv": [
    "bestellung_id,datum,kategorie,betrag",
    "T01,2026-03-02,ersatzteile,12.50",
    "T02,2026-03-03,wartung,0.10",
    "T03,2026-03-03,wartung,0.20",
    "T04,2026-03-05,ersatzteile,-15",
    "T05,2026-02-30,wartung,80",
    "T06,2026-03-07,reparatur,60",
    "T07,2026-03-08,ersatzteile,19.999",
    "T08,2026-03-09,wartung,45,zusatz",
    "T09,2026-03-10,ersatzteile,abc",
    "T10,2026-03-11,wartung,200"
   ],
   "pruefung": {
    "eingelesene_zeilen": 10,
    "unauffaellige_zeilen": 4,
    "auffaellige_zeilen": 6,
    "auffaelligkeiten": [
     {
      "csv_zeile": 5,
      "bestellung_id": "T04",
      "gruende": [
       "Betrag muss eine endliche, nicht negative Dezimalzahl mit höchstens zwei Nachkommastellen sein."
      ]
     },
     {
      "csv_zeile": 6,
      "bestellung_id": "T05",
      "gruende": [
       "Datum fehlt oder ist kein gültiges Datum im Format JJJJ-MM-TT."
      ]
     },
     {
      "csv_zeile": 7,
      "bestellung_id": "T06",
      "gruende": [
       "Kategorie muss ersatzteile oder wartung sein."
      ]
     },
     {
      "csv_zeile": 8,
      "bestellung_id": "T07",
      "gruende": [
       "Betrag muss eine endliche, nicht negative Dezimalzahl mit höchstens zwei Nachkommastellen sein."
      ]
     },
     {
      "csv_zeile": 9,
      "bestellung_id": "T08",
      "gruende": [
       "Zusätzliche CSV-Werte ohne Spaltenüberschrift."
      ]
     },
     {
      "csv_zeile": 10,
      "bestellung_id": "T09",
      "gruende": [
       "Betrag muss eine endliche, nicht negative Dezimalzahl mit höchstens zwei Nachkommastellen sein."
      ]
     }
    ]
   },
   "import": {
    "eingelesene_zeilen": 10,
    "uebernommene_zeilen": 4,
    "abgelehnte_zeilen": 6,
    "auswertungen": {
     "gesamtumsatz": [
      {
       "bestellungen": 4,
       "umsatz_cent": 21280
      }
     ],
     "monatsumsaetze": [
      {
       "monat": "2026-03",
       "bestellungen": 4,
       "umsatz_cent": 21280
      }
     ],
     "kategorieumsaetze": [
      {
       "kategorie": "ersatzteile",
       "bestellungen": 1,
       "umsatz_cent": 1250
      },
      {
       "kategorie": "wartung",
       "bestellungen": 3,
       "umsatz_cent": 20030
      }
     ]
    }
   },
   "bestellungen": [
    [
     "T01",
     2,
     "2026-03-02",
     "ersatzteile",
     1250
    ],
    [
     "T02",
     3,
     "2026-03-03",
     "wartung",
     10
    ],
    [
     "T03",
     4,
     "2026-03-03",
     "wartung",
     20
    ],
    [
     "T10",
     11,
     "2026-03-11",
     "wartung",
     20000
    ]
   ],
   "abgelehnt": [
    [
     5,
     {
      "bestellung_id": "T04",
      "datum": "2026-03-05",
      "kategorie": "ersatzteile",
      "betrag": "-15"
     },
     [
      "Betrag muss eine endliche, nicht negative Dezimalzahl mit höchstens zwei Nachkommastellen sein."
     ]
    ],
    [
     6,
     {
      "bestellung_id": "T05",
      "datum": "2026-02-30",
      "kategorie": "wartung",
      "betrag": "80"
     },
     [
      "Datum fehlt oder ist kein gültiges Datum im Format JJJJ-MM-TT."
     ]
    ],
    [
     7,
     {
      "bestellung_id": "T06",
      "datum": "2026-03-07",
      "kategorie": "reparatur",
      "betrag": "60"
     },
     [
      "Kategorie muss ersatzteile oder wartung sein."
     ]
    ],
    [
     8,
     {
      "bestellung_id": "T07",
      "datum": "2026-03-08",
      "kategorie": "ersatzteile",
      "betrag": "19.999"
     },
     [
      "Betrag muss eine endliche, nicht negative Dezimalzahl mit höchstens zwei Nachkommastellen sein."
     ]
    ],
    [
     9,
     {
      "bestellung_id": "T08",
      "datum": "2026-03-09",
      "kategorie": "wartung",
      "betrag": "45",
      "null": [
       "zusatz"
      ]
     },
     [
      "Zusätzliche CSV-Werte ohne Spaltenüberschrift."
     ]
    ],
    [
     10,
     {
      "bestellung_id": "T09",
      "datum": "2026-03-10",
      "kategorie": "ersatzteile",
      "betrag": "abc"
     },
     [
      "Betrag muss eine endliche, nicht negative Dezimalzahl mit höchstens zwei Nachkommastellen sein."
     ]
    ]
   ]
  },
  {
   "name": "leer",
   "csv": [
    "bestellung_id,datum,kategorie,betrag"
   ],
   "pruefung": {
    "eingelesene_zeilen": 0,
    "unauffaellige_zeilen": 0,
    "auffaellige_zeilen": 0,
    "auffaelligkeiten": []
   },
   "import": {
    "eingelesene_zeilen": 0,
    "uebernommene_zeilen": 0,
    "abgelehnte_zeilen": 0,
    "auswertungen": {
     "gesamtumsatz": [
      {
       "bestellungen": 0,
       "umsatz_cent": 0
      }
     ],
     "monatsumsaetze": [],
     "kategorieumsaetze": []
    }
   },
   "bestellungen": [],
   "abgelehnt": []
  }
 ]
};
