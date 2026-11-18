-- Lokaler Arbeitsstand: Geldbeträge als ganze Cent ohne Gleitkommarundung.
CREATE TABLE IF NOT EXISTS bestellungen (
    bestellung_id TEXT PRIMARY KEY NOT NULL,
    csv_zeile INTEGER NOT NULL UNIQUE,
    datum TEXT NOT NULL,
    kategorie TEXT NOT NULL CHECK (kategorie IN ('ersatzteile', 'wartung')),
    betrag_cent INTEGER NOT NULL CHECK (typeof(betrag_cent) = 'integer' AND betrag_cent >= 0)
);

-- Auch leere Werte, zusätzliche CSV-Werte und mehrere Gründe bleiben erhalten.
CREATE TABLE IF NOT EXISTS abgelehnte_zeilen (
    csv_zeile INTEGER PRIMARY KEY,
    originalwerte_json TEXT NOT NULL,
    gruende_json TEXT NOT NULL
);
