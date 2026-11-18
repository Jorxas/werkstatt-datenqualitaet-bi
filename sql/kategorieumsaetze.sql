SELECT kategorie, COUNT(*) AS bestellungen, SUM(betrag_cent) AS umsatz_cent
FROM bestellungen
GROUP BY kategorie
ORDER BY kategorie;
