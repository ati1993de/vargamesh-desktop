# Building VargaMesh Desktop on macOS

VargaMesh Desktop v0.6.0 adds native macOS packaging for both supported Mac
CPU families while continuing to use the official VargaMesh Core v0.2.0
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
- official VargaMesh Core v0.2.0 macOS archive for the target architecture

Install Xcode Command Line Tools when needed:

```bash
xcode-select --install
```

## Prepare VargaMesh Core

Create `resources/core` and copy the binaries from the matching official Core
archive into it.

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
VargaMesh-Desktop-v0.6.0-macOS-x64.dmg
VargaMesh-Desktop-v0.6.0-macOS-x64.zip
```

## Build Apple Silicon

On an Apple Silicon Mac:

```bash
npm run dist:mac:arm64
```

Expected release artifacts:

```text
VargaMesh-Desktop-v0.6.0-macOS-arm64.dmg
VargaMesh-Desktop-v0.6.0-macOS-arm64.zip
```

## Core data directory

VargaMesh Desktop uses the native VargaMesh Core macOS data directory:

```text
~/Library/Application Support/VargaMesh
```

Desktop settings remain in Electron's own application data directory and are
separate from Core wallet/blockchain data.

## Signing and notarization

The first macOS CI builds are intended for controlled testing and are unsigned.
macOS Gatekeeper may therefore warn or block a first launch.

A polished public macOS release should be signed with an Apple Developer ID
certificate and notarized by Apple. Signing/notarization is a distribution
step and does not change VargaMesh consensus or wallet formats.

## CI

`.github/workflows/macos-build.yml` builds both architectures on native GitHub
macOS runners, downloads the matching official VargaMesh Core v0.2.0 runtime,
runs source checks, builds DMG/ZIP artifacts and verifies that the packaged Core
binary has the expected architecture.

The macOS workflow intentionally does not publish a GitHub Release yet. The
artifacts are for testing until the macOS Desktop path has been validated on
real user hardware.
