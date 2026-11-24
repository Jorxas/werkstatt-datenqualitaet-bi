$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)

$kandidaten = @(
    'C:\Program Files\Microsoft Power BI Desktop\bin\PBIDesktop.exe',
    'C:\Program Files (x86)\Microsoft Power BI Desktop\bin\PBIDesktop.exe',
    (Join-Path $env:LOCALAPPDATA 'Microsoft\WindowsApps\PBIDesktop.exe')
)
$pfadpruefung = @($kandidaten | ForEach-Object {
    [pscustomobject]@{ Pfad = $_; Vorhanden = (Test-Path -LiteralPath $_ -PathType Leaf) }
})
$befehle = @(Get-Command PBIDesktop.exe -ErrorAction SilentlyContinue | Select-Object Name,Source)
$prozesse = @(Get-Process -Name PBIDesktop -ErrorAction SilentlyContinue | Select-Object ProcessName,Id)
$pakete = @(Get-AppxPackage -Name '*PowerBI*' | Select-Object Name,Version,InstallLocation)
$registrierungspfade = @(
    'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*',
    'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*',
    'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*'
)
$installationen = @(Get-ItemProperty -Path $registrierungspfade -ErrorAction SilentlyContinue |
    Where-Object { $_.DisplayName -like '*Power BI*' } |
    Select-Object DisplayName,DisplayVersion,InstallLocation)
$startmenue = @(Get-StartApps | Where-Object { $_.Name -like '*Power BI*' })
$quelle = 'beispieldaten/bestellungen.csv'
$anzahl = @(Import-Csv -LiteralPath $quelle -Encoding UTF8).Count
$bericht = [ordered]@{
    Projekt = 'P01'
    Ticket = 'P01-T03'
    Zeitpunkt = (Get-Date -Format o)
    PowerShellVersion = $PSVersionTable.PSVersion.ToString()
    Standardpfade = $pfadpruefung
    BefehleImSuchpfad = $befehle
    LaufendeProzesse = $prozesse
    StorePaketeDesBenutzers = $pakete
    Installationsregistrierung = $installationen
    Startmenue = $startmenue
    Quelle = $quelle
    Datensaetze = $anzahl
    SHA256 = (Get-FileHash -LiteralPath $quelle -Algorithm SHA256).Hash
    Grenze = 'Nur lokale Auffindbarkeit geprüft; keine Power-BI-Ausführung und keine Berichtsabnahme. Registrierungseinträge können fehlen oder unzugänglich sein; keine vollständige Datenträgersuche.'
}
$bericht | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath 'nachweise/P01-T03-voraussetzungen.json' -Encoding UTF8
$bericht | ConvertTo-Json -Depth 6
