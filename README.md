# VargaMesh Desktop

<p align="center">
  <img src="assets/vmesh_mark.png" alt="VargaMesh" width="128" />
</p>

<p align="center">
  <strong>Self-custody Windows wallet and full-node desktop client for VargaMesh (VMESH).</strong>
</p>

<p align="center">
  <a href="https://github.com/ati1993de/vargamesh-desktop/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/ati1993de/vargamesh-desktop?display_name=tag&sort=semver"></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
  <img alt="Platform" src="https://img.shields.io/badge/platform-Windows%20x64-0078D6">
  <img alt="Core" src="https://img.shields.io/badge/VargaMesh%20Core-v0.1.0-00bfe8">
</p>

VargaMesh Desktop is the recommended graphical Windows client for running a local VargaMesh full node and managing a self-custody VMESH wallet. It is an Electron interface around the real **VargaMesh Core** daemon: private keys, signing, blockchain validation and P2P networking remain inside Core.

> **Current public release:** `v0.3.2`
> **Bundled Core:** `VargaMesh Core v0.1.0`
> **Platform:** Windows 10/11 x64

## Download

Use the official GitHub Releases page:

**https://github.com/ati1993de/vargamesh-desktop/releases/latest**

Release assets:

```text
VargaMesh-Desktop-v0.3.2-Windows-x64-Setup.exe
VargaMesh-Desktop-v0.3.2-Windows-x64-Portable.zip
SHA256SUMS
```

Verify the SHA256 checksum before running a downloaded binary. The portable ZIP must be extracted before starting `VargaMesh Desktop.exe`.

## What v0.3.2 provides

### Wallet

- create encrypted or unencrypted wallets
- load and unload existing wallets
- wallet balance, transaction history and UTXO view
- generate native `vm1...` receiving addresses
- local/offline QR-code generation
- send VMESH with address validation and explicit confirmation
- wallet encryption, temporary unlock and lock controls
- Core-backed wallet backup and restore
- descriptor/legacy wallet detection
- legacy wallet migration only when migration is applicable
- WIF private-key import into descriptor and legacy wallets
- expected-address verification before WIF import
- Bech32/P2WPKH, P2SH-SegWit and legacy P2PKH import choices
- watch-only address import
- optional full-history rescan during recovery/import

### Full node

- bundled VargaMesh Core Windows x64 runtime
- automatic Core startup and clean shutdown
- localhost-only cookie-authenticated JSON-RPC
- blockchain height and synchronization progress
- connected peers and peer details
- network difficulty and hashrate estimate
- mempool information
- node/runtime diagnostics
- persistent blockchain and wallet data under the Windows user profile

### Windows integration

- Windows x64 NSIS installer
- portable ZIP build
- Windows notification-area / system-tray mode
- optional close-to-tray and minimize-to-tray
- optional start minimized
- optional start with Windows in the background
- tray action to lock all loaded wallets
- clean **Quit and stop Core** action
- Microsoft Store/MSIX preparation assets

### Privacy and security

- no telemetry
- no advertising trackers
- no cloud wallet backend
- renderer sandbox enabled
- `contextIsolation: true`
- `nodeIntegration: false`
- `webSecurity: true`
- explicit allow-listed IPC only
- no arbitrary RPC bridge exposed to the renderer
- RPC cookie never exposed to the renderer
- private keys remain under VargaMesh Core control
- wallet passphrases and WIF keys are not stored in Desktop settings
- private-key-like values are redacted from surfaced application errors

## Architecture

```text
┌─────────────────────────────────────┐
│        Electron renderer            │
│  sandboxed · no Node.js · no RPC    │
└──────────────────┬──────────────────┘
                   │ allow-listed IPC
                   ▼
┌─────────────────────────────────────┐
│       Electron main process         │
│  Core lifecycle + approved RPC      │
└──────────────────┬──────────────────┘
                   │ 127.0.0.1
                   │ cookie-authenticated JSON-RPC
                   ▼
┌─────────────────────────────────────┐
│          VargaMesh Core             │
│  wallet · signing · chain · P2P     │
└─────────────────────────────────────┘
```

The Desktop UI does not reimplement private-key cryptography or blockchain consensus logic. Consensus-critical behavior remains in VargaMesh Core.

## First start

On first launch, Desktop creates or uses:

```text
%LOCALAPPDATA%\VargaMesh
```

The local Core configuration is:

```text
%LOCALAPPDATA%\VargaMesh\vargamesh.conf
```

Desktop starts the bundled Core, waits for local RPC readiness and begins synchronizing the VargaMesh blockchain. Initial synchronization time depends on current chain height, available peers, CPU, storage and network speed.

RPC is intended to remain local-only:

```ini
rpcbind=127.0.0.1
rpcallowip=127.0.0.1
rpcport=29667
```

Default VargaMesh P2P port:

```text
29666/TCP
```

## Import an existing address

An address by itself cannot make another wallet spendable. To take control of an existing address, you need its matching private key or an appropriate wallet backup.

Open:

**Wallet → Schlüssel / Adresse importieren**

For an existing native `vm1...` address:

1. choose **Private key (WIF)**
2. choose **Bech32 / P2WPKH**
3. enter the known address in **Expected address**
4. enter the matching WIF locally
5. use **Check key** first
6. import only when the derived address matches
7. enable full-history scan when recovering an address with older transactions

For monitoring without spending capability, choose **Watch-only address**.

**Never send a WIF/private key to support, GitHub Issues, Discord, email or any website.**

Detailed recovery/import documentation: [`docs/WALLET-IMPORT.md`](docs/WALLET-IMPORT.md)

## Tray and background mode

By default, closing the main window can keep VargaMesh Desktop and VargaMesh Core running in the Windows notification area.

Available behavior:

- close window → keep running in tray
- minimize → optionally minimize to tray
- start Desktop minimized
- start with Windows in background
- tray → reopen Desktop
- tray → lock all loaded wallets
- tray → **Quit and stop Core**

Use **Quit and stop Core** when you want the node to stop completely.

## Wallet backups

Wallet backups are created through VargaMesh Core. Keep at least one independent backup on separate storage. Do not rely on the local PC as the only copy of wallet data.

Before importing private keys, restoring wallets or performing legacy migration, create a fresh independent backup whenever possible.

## Verify release downloads

PowerShell example:

```powershell
Get-FileHash .\VargaMesh-Desktop-v0.3.2-Windows-x64-Setup.exe -Algorithm SHA256
Get-FileHash .\VargaMesh-Desktop-v0.3.2-Windows-x64-Portable.zip -Algorithm SHA256
```

Compare the resulting values with `SHA256SUMS` from the same GitHub release.

## Build from source

### Requirements

- Node.js 22+
- npm
- VargaMesh Core Windows x64 runtime

Local source verification:

```bash
npm install
npm run check
```

### Windows x64 build on Linux/Wine

On Ubuntu/Debian:

```bash
sudo dpkg --add-architecture i386
sudo apt update
sudo apt install -y wine wine32:i386 xvfb xauth unzip git gh ca-certificates
```

Then:

```bash
chmod +x scripts/*.sh
npm run build:linux-wine
```

The build script downloads the official VargaMesh Core Windows x64 release, preserves its complete runtime directory, performs project checks and builds:

```text
dist/VargaMesh-Desktop-v0.3.2-Windows-x64-Setup.exe
dist/VargaMesh-Desktop-v0.3.2-Windows-x64-Portable.zip
dist/SHA256SUMS
```

Detailed build documentation: [`docs/BUILDING-WINDOWS.md`](docs/BUILDING-WINDOWS.md)

## Automated releases

Tagged `v*` builds run through GitHub Actions on `windows-latest`. The release workflow validates the source, downloads the official Core runtime, builds the Windows artifacts, creates SHA256 checksums and publishes the tagged version as the GitHub **Latest** release.

Maintainer checklist: [`docs/RELEASE-CHECKLIST.md`](docs/RELEASE-CHECKLIST.md)

## Support and security

- Usage/support information: [`SUPPORT.md`](SUPPORT.md)
- Security policy: [`SECURITY.md`](SECURITY.md)
- Privacy information: [`PRIVACY.md`](PRIVACY.md)
- Contribution guide: [`CONTRIBUTING.md`](CONTRIBUTING.md)
- Release history: [`CHANGELOG.md`](CHANGELOG.md)

When reporting a problem, never attach wallet files, backups, WIF/private keys, wallet passwords, RPC cookies, SSH keys or access tokens.

## Project links

| Resource | Link |
| --- | --- |
| VargaMesh | https://vargacoin.com/ |
| Explorer | https://mempool.vargacoin.com/ |
| VargaMesh Core | https://github.com/ati1993de/vargamesh-core |
| Desktop releases | https://github.com/ati1993de/vargamesh-desktop/releases |
| Wallet SDK | https://github.com/ati1993de/vargamesh-wallet-sdk |
| npm SDK | `@vargamesh/wallet-sdk` |

## License

VargaMesh Desktop is released under the MIT License. See [`LICENSE`](LICENSE).

VargaMesh Core is a separate project derived from Bitcoin Core and retains the applicable upstream copyright, license and attribution notices in its own repository and distribution.

## Important notice

VargaMesh Desktop is self-custody software. Cryptocurrency transactions are irreversible after confirmation. Keep independent backups, verify destination addresses, and test recovery/import procedures carefully before relying on them for significant funds.
