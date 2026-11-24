param(
    [Parameter(Mandatory=$true)][int]$DesktopProzess,
    [Parameter(Mandatory=$true)][string]$BrueckenCli,
    [string]$Nachweisname = 'P01-T03-dax.json'
)
$ErrorActionPreference = 'Stop'
$projektpfad = Split-Path $PSScriptRoot -Parent
$statusText = & node $BrueckenCli status --pid $DesktopProzess
if ($LASTEXITCODE -ne 0) { throw 'Power-BI-Bruecke antwortet nicht.' }
$status = $statusText | ConvertFrom-Json
$instanz = @($status.instances | Where-Object { $_.pid -eq $DesktopProzess })
$berichtpfad = Join-Path $projektpfad 'bericht/Werkstatt.pbip'
if ($instanz.Count -ne 1 -or [string]::IsNullOrWhiteSpace($instanz[0].currentFilePath) -or [IO.Path]::GetFullPath($instanz[0].currentFilePath) -ne [IO.Path]::GetFullPath($berichtpfad)) {
    throw 'Der ausgewaehlte Desktop-Prozess hat nicht diesen Werkstattbericht geoeffnet.'
}
$modellserver = @(Get-CimInstance Win32_Process -Filter "name='msmdsrv.exe'" | Where-Object { $_.ParentProcessId -eq $DesktopProzess })
if ($modellserver.Count -ne 1 -or $modellserver[0].CommandLine -notmatch '-s\s+"([^"]+)"') {
    throw 'Kein eindeutig zugeordneter lokaler Modellserver.'
}
$portdatei = Join-Path $Matches[1] 'msmdsrv.port.txt'
$port = [int]([IO.File]::ReadAllText($portdatei, [Text.Encoding]::Unicode).Trim([char]0).Trim())
if ([IO.Path]::GetFileName($Nachweisname) -ne $Nachweisname -or $Nachweisname -notlike '*.json') { throw 'Ein einfacher JSON-Dateiname ist erforderlich.' }
& dotnet run --project (Join-Path $PSScriptRoot 'Modellpruefung.csproj') --no-restore -- $port (Join-Path $projektpfad ('nachweise/' + $Nachweisname))
if ($LASTEXITCODE -ne 0) { throw 'Die tatsaechlichen DAX-Ergebnisse stimmen nicht.' }
