# Building VargaMesh Desktop on macOS

VargaMesh Desktop v0.7.2 adds native macOS packaging for both supported Mac
CPU families while continuing to use the official VargaMesh Core v0.3.0
runtime.

## Architectures

- Intel Mac: `x64` / Core asset `macos-x86_64`
- Apple Silicon: `arm64` / Core asset `macos-arm64`

The Desktop package must always bundle the Core runtime matching the target
architecture.

## Requirements

- macOS
- Node.js 22+
- npm
- Xcode Command Line Tools
- official VargaMesh Core v0.3.0 macOS archive for the target architecture

Install Xcode Command Line Tools when needed:

```bash
xcode-select --install
```

## Prepare VargaMesh Core

Verify the matching official Core archive with `node scripts/verify-core-archive.js <archive-path>` against the pinned SHA-256 manifest `resources/core-release.json`, then create `resources/core` and copy the complete runtime directory from the archive.

Required files include:

```text
vargameshd
vargamesh-cli
vargamesh-wallet
vargamesh-tx
vargamesh-util
```

They must be executable:

```bash
chmod 0755 resources/core/vargamesh*
```

Check the runtime:

```bash
./resources/core/vargameshd --version
./resources/core/vargamesh-cli --version
```

## Install and verify

```bash
npm ci --no-audit --no-fund
npm run check
```

## Build Intel

On an Intel Mac:

```bash
npm run dist:mac:x64
```

Expected release artifacts:

```text
VargaMesh-Desktop-v0.7.2-macOS-x64.dmg
VargaMesh-Desktop-v0.7.2-macOS-x64.zip
```

## Build Apple Silicon

On an Apple Silicon Mac:

```bash
npm run dist:mac:arm64
```

Expected release artifacts:

```text
VargaMesh-Desktop-v0.7.2-macOS-arm64.dmg
VargaMesh-Desktop-v0.7.2-macOS-arm64.zip
```

## Core data directory

VargaMesh Desktop uses the native VargaMesh Core macOS data directory:

```text
~/Library/Application Support/VargaMesh
```

Desktop settings remain in Electron's own application data directory and are
separate from Core wallet/blockchain data.

## Signing and notarization

The initial public macOS v0.7.2 builds are unsigned and not Apple-notarized.
macOS Gatekeeper may therefore warn or block a first launch.

A polished public macOS release should be signed with an Apple Developer ID
certificate and notarized by Apple. Signing/notarization is a distribution
step and does not change VargaMesh consensus or wallet formats.

## CI

`.github/workflows/desktop-ci-release.yml` builds both architectures on native GitHub
macOS runners, downloads the matching official VargaMesh Core v0.3.0 runtime,
runs source checks, builds DMG/ZIP artifacts and verifies that the packaged Core
binary has the expected architecture.

The final release job waits for Windows plus native Intel and Apple Silicon builds to complete, checks all release checksums, then publishes the complete asset set together.
