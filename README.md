# VargaMesh Desktop

<p align="center">
  <img src="assets/vmesh_mark.png" alt="VargaMesh" width="128" />
</p>

<p align="center">
  <strong>Self-custody Windows and macOS wallet and full-node desktop client for VargaMesh (VMESH).</strong>
</p>

<p align="center">
  <a href="https://github.com/ati1993de/vargamesh-desktop/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/ati1993de/vargamesh-desktop?display_name=tag&sort=semver"></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
  <img alt="Platform" src="https://img.shields.io/badge/platform-Windows%20x64%20%7C%20macOS-0078D6">
  <img alt="Core" src="https://img.shields.io/badge/VargaMesh%20Core-v0.2.0-00bfe8">
</p>

VargaMesh Desktop is the graphical full-node client for running a local VargaMesh node and managing a self-custody VMESH wallet on supported desktop platforms. It is an Electron interface around the real **VargaMesh Core** daemon: private keys, signing, blockchain validation and P2P networking remain inside Core.

> **Target release:** `v0.7.0` (after automated build and publication)
> **Platforms:** Windows 10/11 x64 · macOS Intel x86_64 · macOS Apple Silicon arm64
> **Bundled Core:** `VargaMesh Core v0.2.0`

## v0.7.0 – Wallet UX, contacts, VNS and notifications

- Local contacts address book for plain VMESH addresses and `.vmesh` names; private contacts stored in the user's Desktop app-data directory (not on a server).
- VNS resolver via `https://vargamesh.com/api/vns/v1/resolve/{name}` used for name-to-address resolution with VargaMesh Core address validation.
- Resolved VNS destination shown in the send review; fresh name resolution immediately before the actual broadcast. If the destination has changed, the send fails and must be reviewed again.
- Electron native notifications for incoming transactions, first confirmation and completed initial sync, configurable in Settings. Amounts hidden by default; first polling snapshot never triggers old transaction alerts.
- Transaction CSV export, accessible in transaction history. The local export is unencrypted; store it securely.
- Responsive contacts navigation and layout changes for smaller windows. Existing wallet storage and Core launch arguments remain unchanged.
- Entirely local address book; no contacts, wallet IDs or balances are sent to the VNS resolver. Looking up a public name reveals the requested name and your public IP address to the VNS API.
- SHA-256 checksums are provided with releases. Windows code signing and macOS notarization remain pending and must not be claimed as implemented.

**Important:** The send review still displays an estimated fee rate, not an exact funded-transaction fee. For high-value payments, verify the address and confirm with a small test amount. VNS registration/renewal is not built into the Desktop client.

## v0.6.2 – NestEx market-data hotfix

VargaMesh Desktop `v0.6.2` fixes the VMESH/USDT price source used by v0.6.1.

- primary ticker: `https://api.nestex.one/cg/tickers/VMESH_USDT`
- fallback ticker: `https://trade.nestex.one/api/cg/tickers/VMESH_USDT`
- Electron main-process `net.fetch` for exchange HTTPS requests
- supports object, array and `data`-wrapped ticker responses
- still validates the exact `VMESH_USDT` market
- wallet USDT estimate remains `trusted VMESH balance × NestEx last_price`
- Core/wallet operation stays independent from NestEx availability

## v0.6.1 – NestEx price + wallet USDT estimate

VargaMesh Desktop `v0.6.1` adds optional public VMESH/USDT market data from NestEx.

- live NestEx `last_price` plus bid/ask context
- estimated wallet value: trusted VMESH balance × NestEx last trade price
- market data remains independent from Core/wallet operation
- at most one live NestEx request per minute
- 8-second timeout and short-lived in-memory stale fallback
- market-data requests can be disabled in Settings
- the displayed USDT wallet value is informational and is not a guaranteed execution/liquidation value

No wallet address, balance, private key, recovery phrase, passphrase or RPC credential is sent to NestEx. See [PRIVACY.md](PRIVACY.md).

## v0.6.0 – Windows + macOS

VargaMesh Desktop `v0.6.0` extends the existing Windows Desktop client to native macOS packaging while preserving the same self-custody/Core architecture.

The v0.6.0 release includes:

- native **Intel x86_64** Desktop build
- native **Apple Silicon arm64** Desktop build
- matching official VargaMesh Core v0.2.0 runtime for each architecture
- macOS `.dmg` and `.zip` packages
- native Core data directory at `~/Library/Application Support/VargaMesh`
- platform-aware Core executable selection (`vargameshd.exe` on Windows, `vargameshd` on macOS)
- native CI builds on Intel and Apple Silicon GitHub macOS runners
- packaged Core architecture/runtime verification before artifacts are published

The first public macOS packages are **unsigned and not Apple-notarized**. They are built and verified on native Intel and Apple Silicon GitHub runners, but macOS Gatekeeper may show a warning or block first launch. Download only from the official GitHub release and verify the published SHA-256 checksum.

Build documentation: [`docs/BUILDING-MACOS.md`](docs/BUILDING-MACOS.md)

## v0.5.2 – VMT-1 + multilingual desktop

VargaMesh Desktop v0.5.2 combines native VMT-1 token support with a complete four-language interface without turning Desktop into a custodial or cloud wallet.

Supported UI languages: **Deutsch · English · Русский · 简体中文**.

- discover VMT-1 balances across owned `vm1...` addresses in the active Core wallet
- show approved token metadata, logos, supply, issuer, holders and transfer counts
- create VMT-1 tokens using the live Mainnet CREATE policy
- transfer, burn and — for authorized mintable issuers — mint tokens
- build and sign transactions with the local VargaMesh Core
- force the VMT owner address to remain input 0 and verify that invariant after signing
- run exact signed-transaction preflight before broadcast and repeat it immediately before broadcast
- browse/search the VMT token directory
- no hard-coded CREATE fee amount or fee recipient in Desktop

The renderer still has no arbitrary Core RPC access. Private keys remain in Core for token transaction signing.

Native metadata submission is intentionally not enabled in the v0.5.x line because the existing metadata proof format cannot be produced through an approved VargaMesh Core wallet RPC without exporting private-key material. Approved metadata remains visible.

Technical VMT-1 Desktop documentation: [`docs/VMT-1.md`](docs/VMT-1.md)

## Download

Use the official GitHub Releases page:

**https://github.com/ati1993de/vargamesh-desktop/releases/latest**

Release assets:

```text
VargaMesh-Desktop-v0.7.0-Windows-x64-Setup.exe
VargaMesh-Desktop-v0.7.0-Windows-x64-Portable.zip
VargaMesh-Desktop-v0.7.0-macOS-x64.dmg
VargaMesh-Desktop-v0.7.0-macOS-x64.zip
VargaMesh-Desktop-v0.7.0-macOS-arm64.dmg
VargaMesh-Desktop-v0.7.0-macOS-arm64.zip

SHA256SUMS
SHA256SUMS-macOS-x64
SHA256SUMS-macOS-arm64
```

Verify the SHA256 checksum before running a downloaded binary. The portable ZIP must be extracted before starting `VargaMesh Desktop.exe`.

## What v0.7.0 provides

### Contacts, VNS and notifications

- Open **Contacts** to add an address or a `.vmesh` name.
- Click **Use** to prefill the recipient, or type a name directly in **Send**.
- Review the full resolved address. The name must resolve again to the same address immediately before the final send.
- Enable or disable native notifications under **Settings → Desktop notifications**.
- Notification bodies hide amounts by default. A notification can be visible on the operating system lock screen.
- Export the latest 1,000 visible wallet entries as CSV from **Transactions**.
- The three existing VargaMesh Core bootstrap peer IPs are unchanged.

### Wallet

* deterministic Recovery Wallets with 12- or 24-word BIP39 recovery phrases
* BIP32 HD derivation using VargaMesh Mainnet extended-key prefixes
* proposed SLIP-0044 coin type `22093`
* BIP84 Native SegWit default path: `m/84'/22093'/0'/0/index`
* BIP44 legacy compatibility path: `m/44'/22093'/0'/0/index`
* recovery from mnemonic with blockchain rescan
* recovery phrase copy and explicit TXT export during wallet creation

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

### Market price and estimated wallet value

- optional public NestEx VMESH/USDT ticker with dedicated API-host primary and trade-site fallback
- last trade price with bid/ask context
- active-wallet USDT estimate based on trusted VMESH balance × last trade price
- external market requests are isolated to the main process
- one-minute refresh-cycle limit with endpoint fallback, timeout and stale-cache handling
- wallet and node features do not depend on NestEx availability

### Full node

- bundled platform-matched VargaMesh Core runtime
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

### macOS integration

- Intel x86_64 DMG and ZIP packages
- Apple Silicon arm64 DMG and ZIP packages
- native macOS VargaMesh Core v0.2.0 runtime
- native Core data directory under `~/Library/Application Support/VargaMesh`
- menu-bar/tray-compatible background behavior through Electron
- macOS builds verified separately for Intel and Apple Silicon

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

On first launch, Desktop creates or uses the native VargaMesh Core data directory.

Windows:

```text
%LOCALAPPDATA%\VargaMesh
```

macOS:

```text
~/Library/Application Support/VargaMesh
```

The local Core configuration is `vargamesh.conf` inside that platform-specific Core data directory.

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
Get-FileHash .\VargaMesh-Desktop-v0.7.0-Windows-x64-Setup.exe -Algorithm SHA256
Get-FileHash .\VargaMesh-Desktop-v0.7.0-Windows-x64-Portable.zip -Algorithm SHA256
```

Compare the resulting values with `SHA256SUMS` from the same GitHub release.

## Build from source

### Requirements

- Node.js 22+
- npm
- matching VargaMesh Core runtime for the target platform/architecture

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
dist/VargaMesh-Desktop-v0.7.0-Windows-x64-Setup.exe
dist/VargaMesh-Desktop-v0.7.0-Windows-x64-Portable.zip
dist/SHA256SUMS
```

Detailed Windows build documentation: [`docs/BUILDING-WINDOWS.md`](docs/BUILDING-WINDOWS.md)

### macOS build

See [`docs/BUILDING-MACOS.md`](docs/BUILDING-MACOS.md) for Intel and Apple Silicon builds.

## Automated releases

Public releases build Windows x64 plus native Intel and Apple Silicon macOS packages. The Windows workflow creates the GitHub Release, and the native macOS jobs attach the verified DMG/ZIP packages and architecture-specific SHA-256 files to the same release.

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
| VargaMesh | https://vargamesh.com/ |
| Explorer | https://mempool.vargamesh.com/ |
| VargaMesh Core | https://github.com/ati1993de/vargamesh-core |
| Desktop releases | https://github.com/ati1993de/vargamesh-desktop/releases |
| Wallet SDK | https://github.com/ati1993de/vargamesh-wallet-sdk |
| npm SDK | `@vargamesh/wallet-sdk` |

## License

VargaMesh Desktop is released under the MIT License. See [`LICENSE`](LICENSE).

VargaMesh Core is a separate project derived from Bitcoin Core and retains the applicable upstream copyright, license and attribution notices in its own repository and distribution.

## Important notice

VargaMesh Desktop is self-custody software. Cryptocurrency transactions are irreversible after confirmation. Keep independent backups, verify destination addresses, and test recovery/import procedures carefully before relying on them for significant funds.


## Wallet Quick Start

New to VargaMesh Desktop or upgrading from an older wallet?

- [Wallet Quick Guide – English](docs/WALLET-GUIDE.md)
- [Wallet-Kurzanleitung – Deutsch](docs/WALLET-GUIDE-DE.md)
- [HD Wallet Derivation Specification](docs/WALLET-DERIVATION.md)

The two recovery methods are different:

| Function | Purpose |
|---|---|
| **Recovery Wallet** | Create a new 12/24-word deterministic wallet |
| **Recovery Restore** | Restore a wallet from its 12/24 words |
| **Backup Restore** | Restore an existing Core `.dat` / backup wallet |
| **Load Wallet** | Load an existing local wallet |
| **Unload Wallet** | Unload from Core; does **not** delete the wallet |

Existing wallets remain supported and are not converted automatically into
BIP39 Recovery Wallets.
