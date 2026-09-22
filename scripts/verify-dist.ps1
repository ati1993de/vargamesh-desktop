$ErrorActionPreference = "Stop"
$Dist = Join-Path $PSScriptRoot "..\dist"
$Setup = Get-ChildItem $Dist -Filter "VargaMesh-Desktop-v0.1.0-Windows-x64-Setup.exe" | Select-Object -First 1
$Portable = Get-ChildItem $Dist -Filter "VargaMesh-Desktop-v0.1.0-Windows-x64-Portable.exe" | Select-Object -First 1
if (!$Setup) { throw "Installer missing" }
if (!$Portable) { throw "Portable executable missing" }
$Lines = @()
foreach ($File in @($Setup,$Portable)) {
  if ($File.Length -lt 20MB) { throw "Suspiciously small artifact: $($File.Name)" }
  $Hash = (Get-FileHash $File.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
  $Lines += "$Hash  $($File.Name)"
}
$Lines | Set-Content -Encoding ascii (Join-Path $Dist "SHA256SUMS")
Get-Content (Join-Path $Dist "SHA256SUMS")
Write-Host "Desktop distribution verification: PASS"
