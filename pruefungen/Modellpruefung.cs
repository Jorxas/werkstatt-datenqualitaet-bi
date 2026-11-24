using Microsoft.AnalysisServices.AdomdClient;
using System.Text.Json;

// Ausschließlich lesender Zugriff auf den ausdrücklich gewählten lokalen Desktop-Port.
if (args.Length != 2 || !int.TryParse(args[0], out var port) || port is < 1024 or > 65535)
    throw new ArgumentException("Aufruf: Modellpruefung <lokaler Port> <Nachweisdatei>");
using var verbindung = new AdomdConnection($"Data Source=localhost:{port};Connect Timeout=10");
verbindung.Open();
var abfragen = new Dictionary<string, string>
{
    ["gesamt"] = "EVALUATE ROW(\"umsatz\",[Gesamtumsatz],\"anzahl\",[Bestellanzahl],\"roh\",[Eingelesene Zeilen],\"abgelehnt\",[Abgelehnte Anzahl])",
    ["monate"] = "EVALUATE SUMMARIZECOLUMNS(Bestellungen[Monat],\"umsatz\",[Gesamtumsatz],\"anzahl\",[Bestellanzahl]) ORDER BY Bestellungen[Monat]",
    ["kategorien"] = "EVALUATE SUMMARIZECOLUMNS(Bestellungen[Kategorie],\"umsatz\",[Gesamtumsatz]) ORDER BY Bestellungen[Kategorie]",
    ["januarfilter"] = "EVALUATE CALCULATETABLE(ROW(\"umsatz\",[Gesamtumsatz],\"anzahl\",[Bestellanzahl]),TREATAS({\"2026-01\"},Bestellungen[Monat]))",
    ["fehler"] = "EVALUATE SELECTCOLUMNS('Abgelehnte Zeilen',\"zeile\",'Abgelehnte Zeilen'[Zeile],\"kennung\",'Abgelehnte Zeilen'[Bestellkennung],\"fehler\",'Abgelehnte Zeilen'[Fehler]) ORDER BY [zeile]"
};
var ergebnisse = new Dictionary<string,List<Dictionary<string,object?>>>();
foreach (var (name, dax) in abfragen)
{
    using var befehl = new AdomdCommand(dax, verbindung) { CommandTimeout = 30 };
    using var leser = befehl.ExecuteReader();
    var zeilen = new List<Dictionary<string,object?>>();
    while (leser.Read())
    {
        var zeile = new Dictionary<string,object?>();
        for (var spalte=0;spalte<leser.FieldCount;spalte++)
            zeile[leser.GetName(spalte)] = leser.IsDBNull(spalte) ? null : leser.GetValue(spalte);
        zeilen.Add(zeile);
    }
    ergebnisse[name] = zeilen;
}
var gesamt = ergebnisse["gesamt"].Single();
Console.WriteLine(JsonSerializer.Serialize(ergebnisse));
void verlangen(bool bedingung, string meldung) { if (!bedingung) throw new InvalidDataException(meldung); }
decimal zahl(Dictionary<string,object?> zeile, string name) => Convert.ToDecimal(zeile[name]);
verlangen(zahl(gesamt,"[umsatz]")==820 && zahl(gesamt,"[anzahl]")==10 && zahl(gesamt,"[roh]")==12 && zahl(gesamt,"[abgelehnt]")==2,"Gesamtergebnis stimmt nicht: Power Query laden bzw. Fehler prüfen.");
verlangen(ergebnisse["monate"].Select(z=>zahl(z,"[umsatz]")).SequenceEqual(new decimal[]{340,480}),"Monatssummen stimmen nicht.");
verlangen(ergebnisse["kategorien"].Select(z=>zahl(z,"[umsatz]")).SequenceEqual(new decimal[]{320,500}),"Kategoriesummen stimmen nicht.");
verlangen(zahl(ergebnisse["januarfilter"].Single(),"[umsatz]")==340 && zahl(ergebnisse["januarfilter"].Single(),"[anzahl]")==4,"DAX-Monatsfilter stimmt nicht.");
verlangen(ergebnisse["fehler"].Select(z=>zahl(z,"[zeile]")).SequenceEqual(new decimal[]{12,13}),"Originale Fehlerzeilen stimmen nicht.");
var nachweis = new { zeitpunkt=DateTimeOffset.UtcNow, zugriff="Lesende ADOMD-DAX-Abfragen gegen tatsächlichen lokalen Power-BI-Desktop-Modellserver",port,erfolgreich=true,abfragen,ergebnisse };
File.WriteAllText(Path.GetFullPath(args[1]),JsonSerializer.Serialize(nachweis,new JsonSerializerOptions{WriteIndented=true})+"\n");
Console.WriteLine("Fünf echte DAX-Abfragen erfolgreich: 820 EUR, 10 gültig, 2 abgelehnt; Monatsfilter 340 EUR.");
