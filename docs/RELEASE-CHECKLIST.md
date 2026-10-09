# Release checklist

Use this checklist before publishing a VargaMesh Desktop release.

## Source

- version in `package.json` matches the intended Git tag
- `CHANGELOG.md` and `RELEASE-NOTES.md` are updated
- `npm run check` passes
- `git diff --check` passes
- no generated `dist/`, `node_modules/`, Core binaries or secrets are committed

## Wallet/security

- create/load/unload wallet tested
- encrypted-wallet unlock/lock tested
- receive address generation tested
- send flow tested with a small amount
- backup/restore tested with disposable data
- descriptor wallet does not offer legacy migration
- legacy migration tested only with disposable backup data
- WIF check/import tested with a disposable key
- expected-address mismatch is refused
- watch-only import tested
- no WIF/passphrase/RPC cookie appears in logs

## VMT-1

- VMT portfolio loads for owned `vm1...` addresses
- approved token logo/metadata rendering tested
- YALCUS regression vectors pass
- CREATE policy is loaded from the VMT API and is not hard-coded
- fixed-supply CREATE tested with a disposable token plan before any real fee is paid
- TRANSFER tested with a small token amount
- BURN tested only with a disposable amount
- MINT is shown only for the issuer of a mintable token
- input 0 resolves to the selected VMT authorizer address
- signed transaction preflight returns VMT ledger PASS and mempool PASS
- final preflight runs again immediately before broadcast
- MAIN/HU VMT ledger state remains identical after confirmation
- locked-wallet behavior is tested
- no seed, WIF, private key or RPC cookie reaches the renderer or VMT API

## Market data

- NestEx `VMESH_USDT` quote loads without exposing wallet data
- displayed price uses the normalized NestEx `last_price`
- wallet USDT estimate uses trusted/confirmed balance only
- hide-balances also hides the USDT wallet estimate
- market-data setting disables external NestEx requests
- NestEx failure does not block Core or wallet functionality
- cached/stale quote is visibly identified
- market regression tests pass without live network access

## Node

- bundled Core starts automatically
- RPC remains on `127.0.0.1:29667`
- P2P connects on the VargaMesh network
- sync progress and peers are visible
- closing/quit behavior cleanly follows tray settings

## Windows packaging

- Setup installer launches on a clean Windows x64 system
- Portable ZIP launches after extraction
- uninstall does not intentionally delete `%LOCALAPPDATA%\VargaMesh`
- `SHA256SUMS` matches both release artifacts

## GitHub

- push `main`
- create annotated `vX.Y.Z` tag
- push tag
- GitHub Actions build is green
- release assets include Setup, Portable ZIP and SHA256SUMS
- release is marked **Latest** and is not marked pre-release


## v0.7.0 professional wallet verification
- Local contacts: add/edit/remove VMESH address and VNS name; reload persistence; malformed input rejected
- VNS: active name resolves; unavailable, mismatched, expired and malformed responses fail closed
- Send UI: review shows actual VNS name and full resolved VMESH address; changed name mapping blocks send
- No VNS sender private data or RPC cookie is sent to the resolver
- Duplicate send requests are rejected while an earlier send is pending
- Notifications: initial snapshot silent; one alert per new inbound tx and first confirmation; amounts hidden by default
- Re-enable notifications and ensure no flood of old alerts
- CSV export: confirmed transactions, local file, user-selected path, no secrets
- All four language packs include every new label and button; responsive layout tested at 800/1080/1440 widths
- Old Core/bootstrap IPs, existing wallets, backup recovery, VMT-1 and NestEx features are regression tested
- Installer binaries are still **unsigned** unless a separate code-signing and notarization process is configured
