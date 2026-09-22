# VargaMesh Desktop v0.1.1

Windows desktop wallet and full-node controller for VargaMesh.

## Fixes

- fixes Windows startup path handling for `%LOCALAPPDATA%`
- removes duplicate Core network/RPC command-line arguments; `vargamesh.conf` is authoritative
- serializes Core startup so concurrent wallet/UI requests cannot start duplicate daemon processes
- adds a local `desktop-runtime.log` with the exact non-secret Core launch arguments for diagnostics
- replaces the single-file portable SFX build with a portable ZIP package to avoid stale `%TEMP%` extraction/cache reuse between test builds
- adds a packaged `app.asar` CI guard that fails the build if stale `-bind`, `-rpcbind`, `-rpcport`, `-listen`, or `-server` launch arguments reappear
- release workflow now validates that the Git tag matches `package.json`

## Windows artifacts

- `VargaMesh-Desktop-v0.1.1-Windows-x64-Setup.exe`
- `VargaMesh-Desktop-v0.1.1-Windows-x64-Portable.zip`
- `SHA256SUMS`

The portable ZIP must be extracted before launching `VargaMesh Desktop.exe`.

Bundled node: VargaMesh Core v0.1.0.
