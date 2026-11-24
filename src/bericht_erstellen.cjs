/** Kleinen lokalen Power-BI-Bericht aus den unveränderten CSV-Daten erstellen. */
const fs = require('node:fs');
const path = require('node:path');
const wurzel = path.resolve(__dirname, '..');
const bericht = path.join(wurzel, 'bericht');
const modell = path.join(bericht, 'Werkstatt.SemanticModel');
const definition = path.join(bericht, 'Werkstatt.Report/definition');
function schreiben(datei, inhalt) {
  fs.mkdirSync(path.dirname(datei), { recursive: true });
  fs.writeFileSync(datei, typeof inhalt === 'string' ? inhalt : JSON.stringify(inhalt, null, 2) + '\n');
}
const quellpfad = path.join(wurzel, 'beispieldaten/bestellungen.csv').replaceAll('\\', '/');
const abfrage = `let
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
in Typen`;
const spalten = [['Zeile','int64'],['Bestellkennung','string'],['Datum','dateTime'],['Monat','string'],['Kategorie','string'],['Betrag','decimal'],['Fehler','string'],['Gueltig','boolean']];
function tabelle(name, ausdruck, kennzahlen = []) {
  return { name, columns: spalten.map(([name,dataType]) => ({name,dataType,sourceColumn:name,summarizeBy:name==='Betrag'?'sum':'none',...(name==='Betrag'?{formatString:'#,0.00 €'}:{})})),
    measures: kennzahlen, partitions:[{name,mode:'import',source:{type:'m',expression:ausdruck.split('\n')}}] };
}
schreiben(path.join(modell, 'definition.pbism'), {version:'1.0',settings:{}});
schreiben(path.join(modell, 'model.bim'), {name:'Werkstatt',compatibilityLevel:1601,model:{culture:'de-DE',defaultPowerBIDataSourceVersion:'powerBI_V3',sourceQueryCulture:'en-US',
  expressions:[{name:'CsvDatei',kind:'m',expression:JSON.stringify(quellpfad)+' meta [IsParameterQuery=true, Type="Text", IsParameterQueryRequired=true]'},{name:'GepruefteQuelle',kind:'m',expression:abfrage.split('\n')}],
  tables:[tabelle('Rohdaten','GepruefteQuelle',[{name:'Eingelesene Zeilen',expression:'COUNTROWS(Rohdaten)',formatString:'0'}]),
    tabelle('Bestellungen','Table.SelectRows(GepruefteQuelle, each [Gueltig] = true)',[{name:'Gesamtumsatz',expression:'SUM(Bestellungen[Betrag])',formatString:'#,0.00 €'},{name:'Bestellanzahl',expression:'COUNTROWS(Bestellungen)',formatString:'0'}]),
    tabelle('Abgelehnte Zeilen','Table.SelectRows(GepruefteQuelle, each [Gueltig] = false)',[{name:'Abgelehnte Anzahl',expression:"COUNTROWS('Abgelehnte Zeilen')",formatString:'0'}])]
}});
schreiben(path.join(bericht, '.gitignore'), '**/.pbi/\n**/cache.abf\n**/localSettings.json\n');
schreiben(path.join(wurzel,'powerquery/bestellungen.pq'), abfrage+'\n');
const schema='https://developer.microsoft.com/json-schemas/fabric/item/report/definition/';
const seiten=['64a9a5fb292c4acaa570','datenqualitaet'];
schreiben(path.join(definition,'pages/pages.json'),{$schema:schema+'pagesMetadata/1.1.0/schema.json',pageOrder:seiten,activePageName:seiten[0]});
const literal = wert => ({expr:{Literal:{Value:wert}}});
function feld(tabelle, name, kennzahl=false) {
  return {field:{[kennzahl?'Measure':'Column']:{Expression:{SourceRef:{Entity:tabelle}},Property:name}},queryRef:tabelle+'.'+name,nativeQueryRef:name};
}
function visuell(seite,name,typ,x,y,breite,hoehe,rollen,titel,objekte={}) {
  schreiben(path.join(definition,'pages',seite,'visuals',name,'visual.json'),{$schema:schema+'visualContainer/2.9.0/schema.json',name,position:{x,y,width:breite,height:hoehe,z:1000,tabOrder:1000},visual:{visualType:typ,query:{queryState:Object.fromEntries(Object.entries(rollen).map(([rolle,projections])=>[rolle,{projections}]))},objects:objekte,visualContainerObjects:{title:[{properties:{show:literal('true'),text:literal("'"+titel+"'"),fontSize:literal('16D')}}],padding:[{properties:Object.fromEntries(['top','bottom','left','right'].map(s=>[s,literal('12D')]))}]}}});
}
function karte(seite,name,tabelle,kennzahl,x) {visuell(seite,name,'cardVisual',x,40,580,160,{Data:[feld(tabelle,kennzahl,true)]},kennzahl);}
const tabellenstil={columnHeaders:[{properties:{autoSizeColumnWidth:literal('true'),columnAdjustment:literal("'growToFit'")}}],grid:[{properties:{textSize:literal('14D')}}]};
schreiben(path.join(definition,'pages',seiten[1],'page.json'),{$schema:schema+'page/2.1.0/schema.json',name:seiten[1],displayName:'Datenqualität',displayOption:'FitToPage',height:720,width:1280});
karte(seiten[0],'umsatz','Bestellungen','Gesamtumsatz',40);
karte(seiten[0],'anzahl','Bestellungen','Bestellanzahl',660);
visuell(seiten[0],'monatsfilter','slicer',40,210,1200,160,{Values:[feld('Bestellungen','Monat')]},'Monat',{data:[{properties:{mode:literal("'Basic'")}}],selection:[{properties:{singleSelect:literal('false')}}]});
visuell(seiten[0],'monatsumsatz','tableEx',40,400,580,280,{Values:[feld('Bestellungen','Monat'),feld('Bestellungen','Gesamtumsatz',true),feld('Bestellungen','Bestellanzahl',true)]},'Umsatz nach Monat',tabellenstil);
visuell(seiten[0],'kategorien','tableEx',660,400,580,280,{Values:[feld('Bestellungen','Kategorie'),feld('Bestellungen','Gesamtumsatz',true)]},'Umsatz nach Kategorie',tabellenstil);
karte(seiten[1],'eingelesen','Rohdaten','Eingelesene Zeilen',40);
karte(seiten[1],'abgelehnt','Abgelehnte Zeilen','Abgelehnte Anzahl',660);
visuell(seiten[1],'fehlerliste','tableEx',40,240,1200,420,{Values:['Zeile','Bestellkennung','Fehler'].map(n=>feld('Abgelehnte Zeilen',n))},'Abgelehnte Originalzeilen – synthetische Übungsdaten',tabellenstil);
console.log('Power-Query-Quelle, drei Importtabellen und zwei Berichtsseiten geschrieben. Desktop-Ausführung steht noch aus.');
