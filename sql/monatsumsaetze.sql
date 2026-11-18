SELECT substr(datum, 1, 7) AS monat, COUNT(*) AS bestellungen,
       SUM(betrag_cent) AS umsatz_cent
FROM bestellungen
GROUP BY substr(datum, 1, 7)
ORDER BY monat;
