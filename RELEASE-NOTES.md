# VargaMesh Desktop v0.6.0

VargaMesh Desktop `v0.6.0` is the first public Desktop release for **Windows x64 and macOS**.

It keeps the existing self-custody architecture: VargaMesh Desktop is the graphical interface, while the bundled **VargaMesh Core v0.2.0** performs wallet operations, signing, blockchain validation, peer-to-peer networking and local JSON-RPC.

## New: native macOS support

VargaMesh Desktop is now packaged for both current Mac CPU families:

- **macOS Intel x86_64**
- **macOS Apple Silicon arm64**

Each macOS package bundles the matching official VargaMesh Core v0.2.0 runtime.

The application uses the native VargaMesh Core data directory on macOS:

```text
~/Library/Application Support/VargaMesh
```

The Windows data directory remains:

```text
%LOCALAPPDATA%\VargaMesh
```

## Downloads

### Windows x64

- `VargaMesh-Desktop-v0.6.0-Windows-x64-Setup.exe`
- `VargaMesh-Desktop-v0.6.0-Windows-x64-Portable.zip`
- `SHA256SUMS`

### macOS Intel x86_64

- `VargaMesh-Desktop-v0.6.0-macOS-x64.dmg`
- `VargaMesh-Desktop-v0.6.0-macOS-x64.zip`
- `SHA256SUMS-macOS-x64`

### macOS Apple Silicon arm64

- `VargaMesh-Desktop-v0.6.0-macOS-arm64.dmg`
- `VargaMesh-Desktop-v0.6.0-macOS-arm64.zip`
- `SHA256SUMS-macOS-arm64`

Verify the SHA-256 checksums before running downloaded binaries.

## macOS signing / Gatekeeper notice

The first public macOS v0.6.0 packages are **unsigned and not Apple-notarized**.

They are built and verified through native GitHub macOS runners, but because no Apple Developer ID certificate/notarization credentials are configured yet, macOS Gatekeeper may show a warning or block first launch.

This is a distribution-signing limitation, not a different wallet or consensus implementation. Users should download only from the official VargaMesh Desktop GitHub release and verify the published SHA-256 checksum.

A later release can add Developer ID signing and Apple notarization without changing wallet formats or VargaMesh consensus rules.

## Cross-platform Core runtime

Desktop now selects the platform-native Core daemon automatically:

```text
Windows: vargameshd.exe
macOS:   vargameshd
```

The packaged Core runtime is architecture-matched:

```text
Windows x64       -> Core Windows x86_64
macOS Intel       -> Core macOS x86_64
macOS Apple Silicon -> Core macOS arm64
```

## CI verification

The v0.6.0 source line has passed the project test suite on Windows and on both native macOS architectures.

macOS verification includes:

- official VargaMesh Core v0.2.0 download
- matching Intel/Apple-Silicon Core architecture
- execution of packaged Core command-line programs
- Desktop source verification and regression tests
- platform-aware Core executable selection
- native Electron application build
- packaged Desktop binary verification
- packaged `vargameshd` / `vargamesh-cli` verification
- DMG and ZIP generation
- SHA-256 checksum generation

Windows continues to use the existing validated Windows x64 release path.

## Existing Desktop functionality

v0.6.0 retains the v0.5.x wallet and VMT-1 feature set, including:

- deterministic 12/24-word BIP39 Recovery Wallets
- BIP32 HD derivation
- VargaMesh BIP84 Native SegWit descriptors
- Recovery Wallet creation and restore
- VMESH send/receive
- wallet encryption, lock/unlock and backup/restore
- WIF private-key import
- watch-only address import
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
- wallet passphrases and WIF keys are not stored in Desktop settings
- no telemetry
- no advertising trackers
- no cloud wallet backend

No VargaMesh consensus, network, address or wallet-derivation rules change in this release.

## Bundled Core

**VargaMesh Core v0.2.0**

Core v0.2.0 supports VargaMesh Mainnet and Public Testnet v1 and is available separately for Linux x86_64, Windows x86_64, macOS Intel x86_64 and macOS Apple Silicon arm64.

## Upgrade / backup notice

Before upgrading:

1. stop the previous Desktop/Core instance cleanly
2. keep an independent wallet backup and/or verified Recovery Phrase
3. verify the downloaded v0.6.0 checksum
4. install/extract the correct package for the operating system and architecture
5. verify wallet availability before sending meaningful funds

Existing supported Core wallets are not automatically converted into BIP39 Recovery Wallets.

## Important notice

VargaMesh Desktop remains pre-1.0 public-testing software.

Cryptocurrency transactions are irreversible after confirmation. Verify recipient addresses, amounts, wallet backups and recovery procedures carefully before relying on the software with meaningful funds.
