# VargaMesh Desktop v0.7.2 — Core v0.3.0 integration

This Desktop maintenance release upgrades the bundled VargaMesh full node from v0.2.0 to the official **Core v0.3.0** release (23 October 2026).

## Release downloads
- **Windows x64 Setup.exe**: install the app and bundled native Core.
- **Windows x64 Portable.zip**: extract the ZIP before starting the app; includes bundled Core.
- **macOS Intel x64 and Apple Silicon arm64**: separate native DMG and ZIP packages, with architecture-matched Core binaries.
- Three SHA256SUMS manifests allow verification of the Windows and both macOS package sets.

## Core v0.3.0
- Five IPv4 fixed Mainnet P2P seeds complement the existing DNS seed.
- New read-only `getvmeshminingstatus` RPC and diagnostic `checkvmeshauxpow` RPC.
- ASERT difficulty and AuxPoW verification hardening. These Core methods are not added as new Desktop UI controls.
- No hard fork or change to Mainnet history, genesis, SHA-256d, subsidy, chain ID, address formats, RPC/P2P ports or existing mining RPC behavior.

## Upgrade / compatibility
- Back up wallet data, then stop any separately managed old node that uses the same data directory.
- Existing wallets, chainstate, desktop settings, contacts and user `vargamesh.conf` files are preserved; freshly generated Core config lists five known bootstrap peers.
- Existing v0.2.0 nodes can remain on the network; the upgrade is recommended, not mandatory.
- Wallet signing, VNS, VMT-1, notifications, fee policy and NestEx market data are unchanged.

## Verification / limitations
- Build jobs validate official v0.3.0 archives against pinned SHA-256 digests before extraction and check native executable versions.
- CI verifies the packaged Core and release SHA256SUMS files; these checks do not constitute a full independent wallet security audit.
- Windows packages are unsigned unless code signing is configured separately. macOS packages are not Apple-notarized.

VargaMesh Core v0.3.0: https://github.com/ati1993de/vargamesh-core/releases/tag/v0.3.0
