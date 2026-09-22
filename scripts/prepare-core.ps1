$ErrorActionPreference = "Stop"
$Repo = "ati1993de/vargamesh-core"
$Tag = "v0.1.0"
$ZipName = "VargaMesh-v0.1.0-windows-x86_64.zip"
$HashName = "$ZipName.sha256"
$Download = Join-Path $PSScriptRoot "..\core-download"
$Core = Join-Path $PSScriptRoot "..\resources\core"

Remove-Item $Download -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $Download | Out-Null

Write-Host "Downloading VargaMesh Core $Tag..."
gh release download $Tag --repo $Repo --pattern $ZipName --pattern $HashName --dir $Download

$ExpectedLine = (Get-Content (Join-Path $Download $HashName) | Select-Object -First 1).Trim()
$Expected = ($ExpectedLine -split '\s+')[0].ToLowerInvariant()
$Actual = (Get-FileHash (Join-Path $Download $ZipName) -Algorithm SHA256).Hash.ToLowerInvariant()
if ($Expected -ne $Actual) { throw "Core SHA256 mismatch: expected $Expected actual $Actual" }

Remove-Item $Core -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $Core | Out-Null
Expand-Archive -Path (Join-Path $Download $ZipName) -DestinationPath $Core -Force

$Daemon = Join-Path $Core "vargameshd.exe"
$Cli = Join-Path $Core "vargamesh-cli.exe"
if (!(Test-Path $Daemon) -or !(Test-Path $Cli)) { throw "Core executables missing after extraction" }
$DaemonVersion = & $Daemon --version | Out-String
$CliVersion = & $Cli --version | Out-String
if ($DaemonVersion -notmatch "VargaMesh Core daemon version v0\.1\.0") { throw "Wrong daemon identity" }
if ($CliVersion -notmatch "VargaMesh Core RPC client version v0\.1\.0") { throw "Wrong CLI identity" }
Write-Host $DaemonVersion
Write-Host $CliVersion
Write-Host "Core package verification: PASS"
