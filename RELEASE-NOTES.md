# VargaMesh Desktop v0.7.1 – Startup hotfix

This is a recommended hotfix for v0.7.0 users.

## Fixed
- Resolved the renderer initialization failure that left the dashboard on **Starting VargaMesh Core** even after the local Core was ready.
- Root cause: the external-link handler used the ID lookup `$()` instead of the collection lookup `$$()`. This aborted initialization before automatic polling started; clicking **Refresh** still updated the wallet and blockchain information.
- Event binding errors now surface through the startup error handler.
- Added source regression verification so the same selector mistake fails future builds.

## Compatibility
- Safe to install over v0.7.0; existing blockchain data, wallets, address book and settings are preserved.
- VargaMesh Core v0.2.0 and the original three bootstrap peer IP addresses remain unchanged.
- No changes to signing, transaction policy, VNS mapping, wallet notifications or key storage.
- Windows x64 and native macOS x64/arm64 releases include SHA-256 checksum lists.

## Important
These builds are checked by GitHub Actions for syntax, regression tests and packaging. This is not an independent security audit. macOS builds are not Apple-notarized. Verify addresses and test larger transfers with a small amount first.
