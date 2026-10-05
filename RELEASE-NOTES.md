# VargaMesh Desktop v0.6.2

VargaMesh Desktop `v0.6.2` is a focused hotfix for the NestEx VMESH/USDT market-data integration introduced in v0.6.1.

## Fixed: NestEx market data

v0.6.1 used the NestEx trade-site API route as its only ticker source. On affected Desktop installations this could result in **Market data unavailable** even though the VMESH/USDT market itself was available.

v0.6.2 now uses the dedicated NestEx API host as the primary source:

`https://api.nestex.one/cg/tickers/VMESH_USDT`

and keeps the documented trade-site route as a fallback:

`https://trade.nestex.one/api/cg/tickers/VMESH_USDT`

Desktop also uses Electron's main-process `net.fetch` implementation for these HTTPS requests instead of relying only on the Node.js global fetch implementation.

## More tolerant response parsing

The ticker parser still validates that the market is exactly `VMESH_USDT`, with base `VMESH` and target `USDT`, but now accepts the response layouts used by exchange APIs:

- a single ticker JSON object
- an array containing the VMESH/USDT ticker
- a `data` wrapper containing either form

The displayed price remains NestEx `last_price`. The wallet USDT figure remains an informational estimate:

`trusted / confirmed VMESH balance × NestEx last_price`

It is not a guaranteed execution or liquidation value.

## Reliability and privacy

- market requests remain in the Electron main process
- renderer receives normalized data only through the allow-listed IPC bridge
- one refresh cycle at most every 60 seconds
- 8-second timeout per NestEx endpoint
- 15-minute stale quote fallback after a previously valid quote
- NestEx failures never block local Core, Wallet, Send/Receive, VMT-1 or Node functions
- market data can still be disabled in Settings
- no wallet address, balance, private key, recovery phrase, passphrase or RPC credential is sent to NestEx

## Downloads

### Windows x64

- `VargaMesh-Desktop-v0.6.2-Windows-x64-Setup.exe`
- `VargaMesh-Desktop-v0.6.2-Windows-x64-Portable.zip`
- `SHA256SUMS`

### macOS Intel x86_64

- `VargaMesh-Desktop-v0.6.2-macOS-x64.dmg`
- `VargaMesh-Desktop-v0.6.2-macOS-x64.zip`
- `SHA256SUMS-macOS-x64`

### macOS Apple Silicon arm64

- `VargaMesh-Desktop-v0.6.2-macOS-arm64.dmg`
- `VargaMesh-Desktop-v0.6.2-macOS-arm64.zip`
- `SHA256SUMS-macOS-arm64`

Verify the published SHA-256 checksums before running downloaded binaries.

## Compatibility

All v0.6.1 wallet and node functionality is retained. Bundled Core remains **VargaMesh Core v0.2.0**. No consensus or wallet-format changes are included in this hotfix.

VargaMesh Desktop remains pre-1.0 public-testing software.
