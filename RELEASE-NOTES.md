# VargaMesh Desktop v0.1.0

Initial Windows x64 pre-release of the VargaMesh desktop wallet and full-node UI.

## Included

- German / English user interface
- bundled VargaMesh Core v0.1.0
- automatic safe Core configuration
- full-node synchronization and peer status
- create/load/unload wallets
- encrypted wallet support
- receive addresses and offline QR codes
- send VMESH through Core wallet RPC
- transaction history
- Core-native wallet backup and restore
- legacy wallet detection and Core-native migration
- Windows installer and portable executable

## Security

Private-key operations are performed by VargaMesh Core, not by Electron.
RPC remains on localhost. The renderer has no Node integration, no filesystem
access and no RPC cookie access. Wallet passphrases are not persisted.

**Back up your wallet before upgrades or migration. Never share wallet backups,
private keys or passphrases.**

## Core v0.1.0 known issue

VargaMesh Core v0.1.0 requires an explicit `bind=0.0.0.0:29666` setting.
VargaMesh Desktop creates this automatically on first start when no config exists.

## Unsigned early release

Unless the release is built with a configured Windows code-signing certificate,
the installer/portable binary is unsigned and may trigger SmartScreen. Verify
`SHA256SUMS` before execution.
