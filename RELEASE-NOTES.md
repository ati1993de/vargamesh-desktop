# VargaMesh Desktop v0.6.1

VargaMesh Desktop `v0.6.1` adds **live VMESH/USDT market information and an estimated wallet value in USDT** while preserving the existing self-custody full-node architecture.

The bundled **VargaMesh Core remains v0.2.0**. No consensus, address, wallet-format, derivation or VMT-1 protocol rules change in this release.

## New: NestEx VMESH/USDT market data

Desktop can now display the public NestEx `VMESH_USDT` ticker:

- last traded VMESH/USDT price
- current bid and ask when supplied by NestEx
- clear NestEx source indication
- cached/stale indication if a previously valid quote is temporarily reused
- automatic refresh with a maximum of one live request per minute
- manual refresh from the Desktop refresh button

The public ticker endpoint is:

`https://trade.nestex.one/api/cg/tickers/VMESH_USDT`

## New: estimated wallet value in USDT

For the active Core wallet, Desktop shows an estimate calculated as:

`trusted / confirmed VMESH balance × NestEx last_price`

The value is shown on both the Dashboard and Wallet views.

This is intentionally labelled as an **estimate**. It is not a guaranteed sale price, liquidation value or promise that the full wallet balance can be executed at the displayed price. Actual execution depends on the live NestEx order book, spread, liquidity, slippage and market movement.

When **Hide balances** is enabled, the USDT wallet estimate is hidden together with the VMESH balance.

## Reliability

Market data is isolated from wallet operation:

- NestEx requests run in the Electron **main process**, not in the sandboxed renderer.
- The renderer receives only a normalized quote through one explicit allow-listed IPC method.
- Request timeout: 8 seconds.
- Fresh quote cache: 60 seconds.
- A previously valid quote may be shown as **cached** for up to 15 minutes if NestEx is temporarily unreachable.
- If no quote is available, Desktop shows market data as unavailable.
- Core startup, wallet loading, send/receive, VMT-1 and node functions continue normally if NestEx is unavailable.

## Privacy control

A new **Market data** setting lets users disable NestEx market requests.

When enabled, VargaMesh Desktop connects to `trade.nestex.one` to retrieve the public VMESH/USDT ticker. This may expose the user's network IP address to NestEx in the same way as any direct HTTPS request. No wallet addresses, balances, private keys, recovery phrases, passphrases or RPC credentials are sent to NestEx.

## Downloads

### Windows x64

- `VargaMesh-Desktop-v0.6.1-Windows-x64-Setup.exe`
- `VargaMesh-Desktop-v0.6.1-Windows-x64-Portable.zip`
- `SHA256SUMS`

### macOS Intel x86_64

- `VargaMesh-Desktop-v0.6.1-macOS-x64.dmg`
- `VargaMesh-Desktop-v0.6.1-macOS-x64.zip`
- `SHA256SUMS-macOS-x64`

### macOS Apple Silicon arm64

- `VargaMesh-Desktop-v0.6.1-macOS-arm64.dmg`
- `VargaMesh-Desktop-v0.6.1-macOS-arm64.zip`
- `SHA256SUMS-macOS-arm64`

Verify the published SHA-256 checksums before running downloaded binaries.

## Existing functionality retained

v0.6.1 retains the complete v0.6.0 feature set, including:

- Windows x64 and native macOS Intel / Apple Silicon packages
- deterministic 12/24-word BIP39 Recovery Wallets
- BIP32 HD derivation and VargaMesh BIP84 Native SegWit descriptors
- Recovery Wallet creation and restore
- VMESH send/receive
- wallet encryption, lock/unlock and backup/restore
- WIF private-key import and watch-only addresses
- transaction history and UTXO view
- local VargaMesh full-node synchronization
- peer, mempool, difficulty and network diagnostics
- native VMT-1 portfolio
- VMT-1 CREATE, TRANSFER, BURN and authorized MINT
- exact signed-transaction VMT preflight before broadcast
- German, English, Russian and Simplified Chinese UI

## Security architecture

VargaMesh Desktop remains self-custody software.

- private keys remain under VargaMesh Core control
- transaction signing is performed through the local Core wallet
- renderer sandbox remains enabled
- `contextIsolation: true`
- `nodeIntegration: false`
- `webSecurity: true`
- renderer IPC remains explicitly allow-listed
- the RPC cookie is never exposed to the renderer
- market requests never include wallet addresses, balances or wallet secrets
- wallet passphrases and WIF keys are not stored in Desktop settings
- no telemetry
- no advertising trackers
- no cloud wallet backend

## Bundled Core

**VargaMesh Core v0.2.0**

## Important notice

VargaMesh Desktop remains pre-1.0 public-testing software.

Cryptocurrency market prices are volatile and exchange liquidity may be limited. The displayed USDT value is informational only and can differ materially from the amount obtainable in an actual trade.

Keep independent wallet backups, verify recovery procedures and verify recipient addresses and transaction amounts before sending funds.
