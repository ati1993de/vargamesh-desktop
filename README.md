# VargaMesh Desktop v0.2.1

Windows x64 full-node wallet and desktop controller for **VargaMesh (VMESH)**.

VargaMesh Desktop is an Electron interface around the real **VargaMesh Core** daemon. Wallet keys, signing, blockchain validation and P2P networking stay inside Core. The renderer does not implement or store private-key cryptography.

## What is new in v0.2.1

- redesigned VargaMesh-native desktop UI using the official VMESH artwork
- German and English interface
- light, dark and system themes
- hardened Electron renderer (`contextIsolation`, sandbox, no Node integration)
- explicit IPC allow-list; no arbitrary RPC or filesystem bridge
- localhost cookie-authenticated VargaMesh Core RPC
- automatic local Core startup and clean shutdown
- wallet creation with optional Core-side encryption
- wallet load/unload and active-wallet selection
- receive addresses + fully local QR generation
- VMESH sending with address validation and explicit review
- wallet unlock timeout and manual lock
- balance, unconfirmed and immature balance display
- transaction history
- UTXO / `listunspent` viewer
- wallet backups through `backupwallet`
- wallet restore through `restorewallet`
- blockchain rescan
- node sync, height, peers, difficulty and disk usage
- mempool and network hashrate view when supported by Core
- peer list with direction, client, ping and sync height
- no telemetry and no cloud wallet backend
- Linux + Wine build script for Windows x64 NSIS installer and portable ZIP
- Microsoft Store/MSIX conversion assets and checklist

## Architecture

```text
Sandboxed Electron renderer
          │
          │ explicit allow-listed IPC only
          ▼
Electron main process
          │
          │ localhost cookie-authenticated JSON-RPC
          ▼
VargaMesh Core
  ├─ wallet database / private keys
  ├─ transaction signing
  ├─ blockchain validation
  └─ VargaMesh P2P network
```

RPC is generated localhost-only on `127.0.0.1:29667`. P2P uses `29666/TCP`.

## Windows data directory

Installed and portable builds use:

```text
%LOCALAPPDATA%\VargaMesh
```

Wallet and chain data are deliberately not kept beside the executable.

## Build Windows x64 on an Ubuntu/Debian VPS

Recommended: Node.js 22+ and Wine x64.

```bash
sudo dpkg --add-architecture i386
sudo apt update
sudo apt install -y wine64 wine32 unzip git gh ca-certificates

node -v
npm -v
wine --version
```

Extract this source ZIP, then:

```bash
cd VargaMesh-Desktop-v0.2.1-Source
chmod +x scripts/*.sh
npm run build:linux-wine
```

The build script will:

1. download the official VargaMesh Core `v0.1.0` Windows x64 release using `gh`
2. verify the GitHub asset SHA256 digest when GitHub exposes one
3. extract `vargameshd.exe` and `vargamesh-cli.exe`
4. install the pinned Electron build dependencies
5. run static project/security checks
6. build Windows x64 using electron-builder + Wine
7. create SHA256 checksums

Expected artifacts:

```text
dist/VargaMesh-Desktop-v0.2.1-Windows-x64-Setup.exe
dist/VargaMesh-Desktop-v0.2.1-Windows-x64-Portable.zip
dist/SHA256SUMS
```

If Core is already available, place these files before building:

```text
resources/core/vargameshd.exe
resources/core/vargamesh-cli.exe
```

The Core download step will then be skipped.

## Microsoft Store / MSIX

The NSIS installer is intentionally `asInvoker`, keeps mutable user data outside the installation directory and has a stable AppUserModelID/appId. Store artwork is included under `build/store/`.

For conversion with Microsoft's **MSIX Packaging Tool**, see:

```text
docs/MSIX-STORE.md
```

Do not invent a Publisher CN in advance. Use the exact package identity and publisher values assigned in Microsoft Partner Center when preparing the final Store package.

## Development

```bash
npm install
npm start
```

For development, put the Windows Core binaries in `resources/core/` or set `VARGAMESH_CORE_DIR` to a folder containing them.

## Source verification

```bash
npm run check
```

The verifier checks required files, stable package identity, CSP presence, Electron security flags, preload isolation and common secret patterns.

## Security

Never publish or attach private keys, WIF keys, wallet files, wallet backups, wallet passphrases, RPC cookies, SSH keys or access tokens to an issue.

See `SECURITY.md`.

## Project links

- Website: https://vargacoin.com/
- Explorer: https://mempool.vargacoin.com/
- Core: https://github.com/ati1993de/vargamesh-core
- Desktop: https://github.com/ati1993de/vargamesh-desktop
- Wallet SDK: https://github.com/ati1993de/vargamesh-wallet-sdk
- npm: `@vargamesh/wallet-sdk`

## Status

v0.2.1 is a pre-release / public-testing build. Test upgrades and transactions with small amounts and independent wallet backups first.
