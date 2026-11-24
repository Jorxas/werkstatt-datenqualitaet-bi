Attribute VB_Name = "Bestellpruefung"
Option Explicit

' Kleine Pruefung fuer den dokumentierten vier-spaltigen CSV-Vertrag.
Public Sub BestellungenPruefen()
    Dim quellpfad As Variant, datei As Integer, zeile As String, werte As Variant
    Dim daten As Collection, kennungen As Object, roh As Worksheet, auswertung As Worksheet
    Dim nr As Long, spalte As Long, fehler As String, cent As Currency, gueltig As Long
    Dim unvollstaendig As Long, doppelt As Long, pruefpfad As String, protokoll As Integer
    Dim inhalt As String, zeilen As Variant
    On Error GoTo Fehlgeschlagen
    quellpfad = Application.GetOpenFilename("CSV-Dateien (*.csv),*.csv", , "Synthetische Bestellungen auswaehlen")
    If VarType(quellpfad) = vbBoolean Then Exit Sub
    Set daten = New Collection
    datei = FreeFile
    ' Die Originaldatei hat LF; Line Input erwartet unter Windows CRLF.
    Open CStr(quellpfad) For Binary Access Read As #datei
    inhalt = Space$(LOF(datei))
    Get #datei, , inhalt
    Close #datei
    datei = 0
    zeilen = Split(Replace$(inhalt, vbCr, ""), vbLf)
    If zeilen(0) <> "bestellung_id,datum,kategorie,betrag" Then Err.Raise 5, , "CSV-Kopf stimmt nicht."
    For nr = 1 To UBound(zeilen)
        zeile = zeilen(nr)
        If nr < UBound(zeilen) Or zeile <> "" Then
            werte = Split(zeile, ",")
            If UBound(werte) <> 3 Then Err.Raise 5, , "Genau vier einfache CSV-Werte erforderlich; keine eingebetteten Kommas."
            daten.Add werte
        End If
    Next nr
    If daten.Count <> 12 Then Err.Raise 5, , "Diese Abnahme erwartet genau zwoelf Originalzeilen."
    If ThisWorkbook.Worksheets.Count > 2 Then Err.Raise 5, , "Eigenen leeren Uebungsarbeitsstand verwenden."
    Set roh = ThisWorkbook.Worksheets(1)
    If roh.Range("A1").Value <> "" And roh.Range("A1").Value <> "Bestellkennung" Then Err.Raise 5, , "Vorhandene fremde Tabelle wird nicht ueberschrieben."
    roh.Name = "Bestellungen"
    roh.Range("A1:H1").Value = Array("Bestellkennung", "Datum", "Kategorie", "Originalbetrag", "Pruefung", "Betrag in Cent", "Monat", "Grund")
    roh.Range("A2:D13").NumberFormat = "@"
    Set kennungen = CreateObject("Scripting.Dictionary")
    kennungen.CompareMode = vbBinaryCompare
    For nr = 1 To daten.Count
        werte = daten(nr)
        fehler = ""
        For spalte = 0 To 3
            werte(spalte) = Trim$(werte(spalte))
            roh.Cells(nr + 1, spalte + 1).Value = werte(spalte)
        Next spalte
        If werte(0) = "" Or werte(1) = "" Or werte(2) = "" Or werte(3) = "" Then
            unvollstaendig = unvollstaendig + 1
            fehler = "Pflichtwert fehlt. "
        End If
        If werte(0) <> "" Then
            If kennungen.Exists(werte(0)) Then
                doppelt = doppelt + 1
                fehler = fehler & "Kennung bereits in CSV-Zeile " & kennungen(werte(0)) & ". "
            Else
                kennungen.Add werte(0), nr + 1
            End If
        End If
        If Not DatumGueltig(CStr(werte(1))) Then fehler = fehler & "Datum ungueltig. "
        If werte(2) <> "ersatzteile" And werte(2) <> "wartung" Then fehler = fehler & "Kategorie ungueltig. "
        If Not BetragInCent(CStr(werte(3)), cent) Then fehler = fehler & "Betrag ungueltig. "
        If fehler = "" Then
            gueltig = gueltig + 1
            roh.Cells(nr + 1, 5).Value = "gueltig"
            roh.Cells(nr + 1, 6).Value = cent
        Else
            roh.Cells(nr + 1, 5).Value = "abgelehnt"
            roh.Cells(nr + 1, 6).Value = 0
        End If
        roh.Cells(nr + 1, 7).Value = Left$(werte(1), 7)
        roh.Cells(nr + 1, 8).Value = Trim$(fehler)
    Next nr
    If ThisWorkbook.Worksheets.Count = 1 Then ThisWorkbook.Worksheets.Add After:=roh
    Set auswertung = ThisWorkbook.Worksheets(2)
    auswertung.Name = "Auswertung"
    auswertung.Range("A1").Value = "Werkstatt - synthetische Uebungsdaten"
    auswertung.Range("A2:D2").Value = Array("Kennzahl", "Excel", "SQL / Power BI", "Vergleich")
    auswertung.Range("A3:A9").Value = Application.Transpose(Array("Gesamtumsatz EUR", "Gueltige Bestellungen", "Abgelehnte Zeilen", "Januar EUR", "Februar EUR", "Ersatzteile EUR", "Wartung EUR"))
    auswertung.Range("B3").Formula = "=SUM(Bestellungen!F2:F13)/100"
    auswertung.Range("B4").Formula = "=COUNTIF(Bestellungen!E2:E13,""gueltig"")"
    auswertung.Range("B5").Formula = "=COUNTIF(Bestellungen!E2:E13,""abgelehnt"")"
    auswertung.Range("B6").Formula = "=SUMIF(Bestellungen!G2:G13,""2026-01"",Bestellungen!F2:F13)/100"
    auswertung.Range("B7").Formula = "=SUMIF(Bestellungen!G2:G13,""2026-02"",Bestellungen!F2:F13)/100"
    auswertung.Range("B8").Formula = "=SUMIF(Bestellungen!C2:C13,""ersatzteile"",Bestellungen!F2:F13)/100"
    auswertung.Range("B9").Formula = "=SUMIF(Bestellungen!C2:C13,""wartung"",Bestellungen!F2:F13)/100"
    auswertung.Range("C3:C9").Value = Application.Transpose(Array(820, 10, 2, 340, 480, 320, 500))
    For nr = 3 To 9
        auswertung.Cells(nr, 4).Formula = "=IF(B" & nr & "=C" & nr & ",""gleich"",""abweichend"")"
    Next nr
    auswertung.Calculate
    For nr = 3 To 9
        If auswertung.Cells(nr, 4).Value <> "gleich" Then Err.Raise 5, , "Abgleich fehlgeschlagen: " & auswertung.Cells(nr, 1).Value
    Next nr
    If gueltig <> 10 Or unvollstaendig <> 1 Or doppelt <> 1 Then Err.Raise 5, , "Fehlertypen oder Mengen weichen ab."
    If Not BetragInCent("0.10", cent) Or cent <> 10 Then Err.Raise 5, , "Centgrenze 0.10 fehlgeschlagen."
    If BetragInCent("1.234", cent) Or BetragInCent("-1", cent) Then Err.Raise 5, , "Ungueltige Betraege angenommen."
    roh.Range("A1:H1").Font.Bold = True
    roh.Columns("A:H").AutoFit
    auswertung.Range("A1:D2").Font.Bold = True
    auswertung.Range("B3:C9").NumberFormat = "0.00"
    auswertung.Range("A11").Value = "VBA tatsaechlich ausgefuehrt; keine Cloudnutzung."
    auswertung.Range("A12").Value = "Unvollstaendige Zeilen"
    auswertung.Range("B12").Value = unvollstaendig
    auswertung.Range("A13").Value = "Doppelte Kennungen"
    auswertung.Range("B13").Value = doppelt
    auswertung.Range("A15").Value = "Lokaler Pruefzeitpunkt"
    auswertung.Range("B15").Value = Format$(Now, "yyyy-mm-dd hh:nn:ss")
    auswertung.Columns("A:D").AutoFit
    auswertung.Activate
    pruefpfad = Left$(CStr(quellpfad), InStrRev(CStr(quellpfad), "\") - 1) & "\..\nachweise\P01-T04-excel-" & Format$(Now, "yyyymmdd-hhnnss") & ".json"
    protokoll = FreeFile
    Open pruefpfad For Output As #protokoll
    Print #protokoll, "{""excel_version"":""" & Application.Version & """,""lokaler_zeitpunkt"":""" & Format$(Now, "yyyy-mm-dd hh:nn:ss") & """,""zeitzone"":""Europe/Berlin"",""originalzeilen"":12,""gueltig"":10,""abgelehnt"":2,""unvollstaendig"":1,""doppelt"":1,""formelwerte"": [";
    For nr = 3 To 9
        Print #protokoll, IIf(nr = 3, "", ",") & Replace$(CStr(auswertung.Cells(nr, 2).Value), ",", ".");
    Next nr
    Print #protokoll, "],""erfolgreich"":true}"
    Close #protokoll
    MsgBox "Pruefung bestanden: 820 EUR, zehn gueltig, zwei abgelehnt; sieben Excel-Formeln stimmen mit SQL/Power BI ueberein.", vbInformation, "Bestellungen pruefen"
    Exit Sub
Fehlgeschlagen:
    If datei <> 0 Then Close #datei
    MsgBox "Pruefung fehlgeschlagen: " & Err.Description, vbExclamation, "Bestellungen pruefen"
End Sub

Private Function DatumGueltig(ByVal wert As String) As Boolean
    On Error GoTo Ende
    If Not wert Like "####-##-##" Then Exit Function
    DatumGueltig = Format$(DateSerial(CInt(Left$(wert, 4)), CInt(Mid$(wert, 6, 2)), CInt(Right$(wert, 2))), "yyyy-mm-dd") = wert
Ende:
End Function

Private Function BetragInCent(ByVal wert As String, ByRef cent As Currency) As Boolean
    Dim teile As Variant, nachkomma As String
    On Error GoTo Ende
    cent = 0
    teile = Split(wert, ".")
    If UBound(teile) > 1 Or teile(0) = "" Or teile(0) Like "*[!0-9]*" Then Exit Function
    If UBound(teile) = 1 Then
        nachkomma = teile(1)
        If Len(nachkomma) < 1 Or Len(nachkomma) > 2 Or nachkomma Like "*[!0-9]*" Then Exit Function
    End If
    cent = CCur(teile(0)) * 100 + CCur(Left$(nachkomma & "00", 2))
    BetragInCent = True
Ende:
End Function
