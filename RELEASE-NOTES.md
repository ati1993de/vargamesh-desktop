# VargaMesh Desktop v0.3.1

**Recommended Windows release.**

VargaMesh Desktop v0.3.1 is a focused transaction-fee reliability update for the Windows x64 self-custody wallet and local full-node client.

## Fixed: sending on a sparse/new network

VargaMesh Core's smart fee estimator can legitimately have no estimate when the chain has not yet observed enough transaction and block history. In v0.3.0 that state was shown as **“Insufficient data or no feerate found”**, and a send could then fail with **“Fee estimation failed. Fallbackfee is disabled.”**

v0.3.1 handles that condition inside Desktop:

- use `estimatesmartfee` when a valid estimate exists
- otherwise derive a conservative temporary fallback from the local node's relay/mempool minimums
- never fall below 1 sat/vB (0.00001000 VMESH/kvB)
- refuse an unexpectedly high automatic fallback above 100 sat/vB instead of silently overpaying
- apply the fallback only to the active wallet for the send attempt
- immediately reset the wallet to automatic fee selection afterwards
- show **Fallback** in the Send UI when estimator history is not yet sufficient

No persistent `fallbackfee=` setting is added to the user's Core configuration.

## Existing v0.3 features

- local VargaMesh Core v0.1.0 full node
- self-custody wallet with local signing
- WIF private-key import with expected-address verification
- watch-only import and optional blockchain rescan
- wallet backup/restore and descriptor/legacy handling
- Windows tray/background mode and optional start with Windows
- local cookie-authenticated RPC only
- no telemetry, advertising or cloud wallet backend

## Downloads

- `VargaMesh-Desktop-v0.3.1-Windows-x64-Setup.exe`
- `VargaMesh-Desktop-v0.3.1-Windows-x64-Portable.zip`
- `SHA256SUMS`

## Verify the download

```powershell
Get-FileHash .\VargaMesh-Desktop-v0.3.1-Windows-x64-Setup.exe -Algorithm SHA256
Get-FileHash .\VargaMesh-Desktop-v0.3.1-Windows-x64-Portable.zip -Algorithm SHA256
```

Compare the values with `SHA256SUMS` attached to the GitHub release.

Existing blockchain and wallet data remains under `%LOCALAPPDATA%\VargaMesh`. Keep an independent wallet backup before upgrading.

VargaMesh Desktop is pre-1.0 software. Carefully verify recipient addresses and transaction amounts before sending.
