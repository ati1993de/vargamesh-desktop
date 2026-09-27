# VargaMesh Desktop v0.3.3

VargaMesh Desktop v0.3.3 updates the bundled full node to
**VargaMesh Core v0.2.0**.

## Main change

The Windows Desktop packages now bundle the official VargaMesh Core v0.2.0
Windows x64 binaries instead of Core v0.1.0.

VargaMesh Core v0.2.0 contains both VargaMesh Mainnet and VargaMesh Public
Testnet v1 support in the same Core binaries. VargaMesh Desktop continues to
use its existing Desktop network configuration and wallet data.

## Compatibility

Existing Desktop wallet and blockchain data are retained. Users upgrading from
v0.3.2 should completely exit the previous Desktop instance, including its tray
and Core process, before starting v0.3.3.

The sparse-network fallback-fee handling introduced in v0.3.2 remains in place.

## Windows packages

- `VargaMesh-Desktop-v0.3.3-Windows-x64-Setup.exe`
- `VargaMesh-Desktop-v0.3.3-Windows-x64-Portable.zip`

## Bundled Core

- VargaMesh Core v0.2.0
- Windows x86_64
- Mainnet support
- VargaMesh Public Testnet v1 support
