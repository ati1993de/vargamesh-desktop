$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$Pkg = Get-Content (Join-Path $Root "package.json") -Raw | ConvertFrom-Json
$Version = $Pkg.version
$Dist = Join-Path $Root "dist"
$SetupName = "VargaMesh-Desktop-v$Version-Windows-x64-Setup.exe"
$PortableName = "VargaMesh-Desktop-v$Version-Windows-x64-Portable.zip"
$Setup = Get-Item (Join-Path $Dist $SetupName) -ErrorAction Stop
$Portable = Get-Item (Join-Path $Dist $PortableName) -ErrorAction Stop
if ($Setup.Length -lt 20MB) { throw "Suspiciously small artifact: $($Setup.Name)" }
if ($Portable.Length -lt 20MB) { throw "Suspiciously small artifact: $($Portable.Name)" }
$Lines = @()
foreach ($File in @($Setup,$Portable)) {
  $Hash = (Get-FileHash $File.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
  $Lines += "$Hash  $($File.Name)"
}
$Lines | Set-Content -Encoding ascii (Join-Path $Dist "SHA256SUMS")
Get-Content (Join-Path $Dist "SHA256SUMS")
Write-Host "Desktop distribution verification: PASS"
