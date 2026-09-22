# VargaMesh Desktop

Windows x64 desktop wallet and full-node controller for **VargaMesh (VMESH)**.

The application is an Electron UI around the real VargaMesh Core daemon. It does
not reimplement wallet cryptography in JavaScript.

## Features

- German and English UI
- bundled `vargameshd.exe` full node
- automatic safe first-start `vargamesh.conf`
- sync height, progress and peer status
- create encrypted or unencrypted descriptor wallets
- load/unload existing wallets
- restore Core wallet backups (`wallet.dat` / `.dat`)
- detect legacy BDB wallets and migrate with Core `migratewallet`
- receive addresses with local/offline QR generation
- balances and transaction history
- send VMESH with an explicit irreversible-transaction confirmation
- wallet backup through Core `backupwallet`
- Node RPC bound to localhost only
- installer and installation-free portable ZIP Windows builds
- no telemetry and no cloud wallet service

## Security architecture

```
Electron renderer (sandboxed)
       │ allow-listed IPC only
       ▼
Electron main process
       │ localhost cookie-authenticated JSON-RPC
       ▼
VargaMesh Core
       │
       ├─ wallet database / signing
       └─ VargaMesh P2P network
```

The renderer is created with `contextIsolation: true`, `nodeIntegration: false`
and `sandbox: true`. It never receives the RPC cookie.

## Wallet restore / migration

Use **Wallet → Restore backup**. The selected backup path is passed directly to
Core's `restorewallet` RPC; Desktop does not copy or parse private keys itself.
Legacy wallets reported by `listwalletdir` can be migrated with `migratewallet`.
Core creates a `*.legacy.bak` backup before migration.

Always keep an independent backup before testing migration.

## Development

Requirements:

- Node.js 24
- Windows for installer/portable packaging
- a VargaMesh Core Windows x64 package placed in `resources/core/`

For local development:

```powershell
npm install
$env:VARGAMESH_CORE_DIR='C:\path\to\VargaMesh-v0.1.0-windows-x86_64'
npm start
```

The app will also use `resources/core/` when `VARGAMESH_CORE_DIR` is not set.

## Automated Windows build

`.github/workflows/windows-release.yml` downloads the official VargaMesh Core
`v0.1.0` Windows package, validates its SHA256 checksum, verifies both Core
executables, installs Electron dependencies and produces:

- `VargaMesh-Desktop-v0.1.1-Windows-x64-Setup.exe`
- `VargaMesh-Desktop-v0.1.1-Windows-x64-Portable.zip`
- `SHA256SUMS`

A pushed `v*` tag creates a GitHub pre-release automatically. Manual workflow
runs produce Actions artifacts only.

## Important v0.1.0 Core note

VargaMesh Core v0.1.0 currently needs an explicit P2P bind. Desktop creates the
following setting automatically when the Core config does not yet exist:

```ini
bind=0.0.0.0:29666
```

RPC remains local-only on `127.0.0.1:29667`. The generated config is authoritative for P2P/RPC binding; Desktop launches Core only with the data directory, config path and console-output setting so binding options are never duplicated.

## Data location

Even the portable Desktop build deliberately keeps node and wallet data in the
normal Windows user profile:

`%LOCALAPPDATA%\VargaMesh`

This avoids accidentally carrying a live wallet around next to a portable EXE.
The portable ZIP must be extracted before launching `VargaMesh Desktop.exe`.
It means “no installation required”, not “wallet stored beside the executable”.

## Code signing

The initial build is unsigned unless a Windows code-signing certificate is
configured in CI. Windows SmartScreen may therefore display a reputation
warning for early releases. Verify published SHA256 checksums before running a
binary.
