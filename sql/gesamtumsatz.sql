-- Nur übernommene Bestellungen zählen; leere Datenmenge ergibt null Cent.
SELECT COUNT(*) AS bestellungen, COALESCE(SUM(betrag_cent), 0) AS umsatz_cent
FROM bestellungen;
