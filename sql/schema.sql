-- Basisschema; Auswertungen und Fehlerliste folgen in P01-T02.
CREATE TABLE IF NOT EXISTS bestellungen (bestellung_id TEXT PRIMARY KEY, datum TEXT NOT NULL, kategorie TEXT NOT NULL, betrag NUMERIC NOT NULL CHECK(betrag >= 0));
