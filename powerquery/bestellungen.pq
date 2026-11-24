let
    Quelle = Csv.Document(File.Contents(CsvDatei), [Delimiter=",", Columns=4, Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Kopf = Table.PromoteHeaders(Quelle, [PromoteAllScalars=true]),
    Getrimmt = Table.TransformColumns(Kopf, List.Transform(Table.ColumnNames(Kopf), (Name) => {Name, each Text.Trim(_), type text})),
    MitZeile = Table.Buffer(Table.AddIndexColumn(Getrimmt, "Zeile", 2, 1, Int64.Type)),
    MitPruefung = Table.AddColumn(MitZeile, "Pruefung", (Zeile) => let
        Kennung = Zeile[bestellung_id],
        Fruehere = Table.SelectRows(MitZeile, each [Zeile] < Zeile[Zeile] and [bestellung_id] = Kennung),
        Datum = try Date.FromText(Zeile[datum], [Format="yyyy-MM-dd", Culture="en-US"]) otherwise null,
        Betrag = try Number.FromText(Zeile[betrag], "en-US") otherwise null,
        BetragGueltig = if Betrag = null then false else not Number.IsNaN(Betrag) and Betrag <> #infinity and Betrag <> -#infinity and Betrag >= 0 and Number.Round(Betrag, 2) = Betrag,
        Gruende = List.RemoveNulls({
            if Kennung = "" then "Bestellkennung fehlt." else if not Table.IsEmpty(Fruehere) then "Bestellkennung bereits in CSV-Zeile " & Text.From(Fruehere{0}[Zeile]) & " vorhanden." else null,
            if Datum = null then "Datum fehlt oder ist ungültig." else null,
            if List.Contains({"ersatzteile", "wartung"}, Zeile[kategorie]) then null else "Kategorie ist ungültig.",
            if Zeile[betrag] = "" then "Betrag fehlt." else if BetragGueltig then null else "Betrag muss endlich, nicht negativ und centgenau sein."
        })
    in [Datum=Datum, Betrag=if BetragGueltig then Betrag else null, Fehler=Text.Combine(Gruende, " "), Gueltig=List.IsEmpty(Gruende)]),
    Erweitert = Table.ExpandRecordColumn(MitPruefung, "Pruefung", {"Datum", "Betrag", "Fehler", "Gueltig"}),
    Umbenannt = Table.RenameColumns(Erweitert, {{"bestellung_id", "Bestellkennung"}, {"kategorie", "Kategorie"}}),
    MitMonat = Table.AddColumn(Umbenannt, "Monat", each if [Datum] = null then null else Date.ToText([Datum], "yyyy-MM"), type text),
    Auswahl = Table.SelectColumns(MitMonat, {"Zeile", "Bestellkennung", "Datum", "Monat", "Kategorie", "Betrag", "Fehler", "Gueltig"}),
    Typen = Table.TransformColumnTypes(Auswahl, {{"Zeile", Int64.Type}, {"Bestellkennung", type text}, {"Datum", type date}, {"Monat", type text}, {"Kategorie", type text}, {"Betrag", Currency.Type}, {"Fehler", type text}, {"Gueltig", type logical}})
in Typen
