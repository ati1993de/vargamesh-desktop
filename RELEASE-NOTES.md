# VargaMesh Desktop v0.3.0

**Current recommended Windows release.**

VargaMesh Desktop v0.3.0 is a major usability and wallet-management release. It combines a local VargaMesh Core full node with a hardened desktop interface, private-key recovery/import tools and native Windows background/tray operation.

## Highlights

### Wallet recovery and import

- WIF private-key import for descriptor and legacy wallets
- expected-address verification before a private key is imported
- Bech32/P2WPKH, P2SH-SegWit and legacy P2PKH import choices
- watch-only address import
- optional full-history rescan for recovered keys/addresses
- descriptor/legacy wallet detection before migration
- legacy migration is disabled when the selected wallet is already descriptor-based
- temporary passphrase unlock for protected import operations followed by wallet relock

### Windows background operation

- system-tray / notification-area support
- optional close-to-tray
- optional minimize-to-tray
- optional start minimized
- optional start with Windows in the background
- tray command to lock all loaded wallets
- clean **Quit and stop Core** command

### Node and diagnostics

- bundled VargaMesh Core v0.1.0 Windows x64 runtime
- complete Core runtime directory is preserved in release packages
- automatic local Core startup
- localhost-only cookie-authenticated RPC
- node height, sync, peer, difficulty, mempool and hashrate views
- improved Core startup diagnostics and runtime logging
- hardened Linux/Wine build support for headless VPS builders through Xvfb

## Security model

Private keys remain under VargaMesh Core control. The Electron renderer is sandboxed, Node.js integration is disabled, RPC credentials are not exposed to the renderer and arbitrary RPC calls are not available through the preload bridge.

WIF keys and wallet passphrases are used only for the requested local operation and are not persisted in Desktop settings or runtime diagnostics. Sensitive-looking private-key values are redacted from surfaced application errors.

## Downloads

Use one of the Windows x64 packages attached to this release:

- `VargaMesh-Desktop-v0.3.0-Windows-x64-Setup.exe`
- `VargaMesh-Desktop-v0.3.0-Windows-x64-Portable.zip`
- `SHA256SUMS`

The portable package must be extracted before running `VargaMesh Desktop.exe`.

## Verify the download

PowerShell:

```powershell
Get-FileHash .\VargaMesh-Desktop-v0.3.0-Windows-x64-Setup.exe -Algorithm SHA256
Get-FileHash .\VargaMesh-Desktop-v0.3.0-Windows-x64-Portable.zip -Algorithm SHA256
```

Compare both values with `SHA256SUMS` attached to this release.

## Upgrade notes

Existing blockchain and wallet data remains under:

```text
%LOCALAPPDATA%\VargaMesh
```

Installing v0.3.0 over an older Desktop version does not intentionally delete this data. Keep an independent wallet backup before upgrading.

## Private-key import warning

A VargaMesh address alone is public information and does not grant spending access. Importing an existing spendable address requires its matching WIF/private key or an appropriate wallet backup.

Never paste a WIF/private key into GitHub Issues, chat, Discord, email or a website. Use the Desktop import dialog locally and, when recovering a known address, fill in **Expected address** so Desktop can verify that the supplied WIF derives the intended address before import.

## Bundled software

- VargaMesh Desktop: `v0.3.0`
- VargaMesh Core: `v0.1.0`
- Windows architecture: `x64`

VargaMesh Desktop is pre-1.0 software. Independent backups and careful verification remain strongly recommended.
