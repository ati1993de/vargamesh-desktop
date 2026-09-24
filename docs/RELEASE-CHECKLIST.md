# Release checklist

Use this checklist before publishing a VargaMesh Desktop release.

## Source

- version in `package.json` matches the intended Git tag
- `CHANGELOG.md` and `RELEASE-NOTES.md` are updated
- `npm run check` passes
- `git diff --check` passes
- no generated `dist/`, `node_modules/`, Core binaries or secrets are committed

## Wallet/security

- create/load/unload wallet tested
- encrypted-wallet unlock/lock tested
- receive address generation tested
- send flow tested with a small amount
- backup/restore tested with disposable data
- descriptor wallet does not offer legacy migration
- legacy migration tested only with disposable backup data
- WIF check/import tested with a disposable key
- expected-address mismatch is refused
- watch-only import tested
- no WIF/passphrase/RPC cookie appears in logs

## Node

- bundled Core starts automatically
- RPC remains on `127.0.0.1:29667`
- P2P connects on the VargaMesh network
- sync progress and peers are visible
- closing/quit behavior cleanly follows tray settings

## Windows packaging

- Setup installer launches on a clean Windows x64 system
- Portable ZIP launches after extraction
- uninstall does not intentionally delete `%LOCALAPPDATA%\VargaMesh`
- `SHA256SUMS` matches both release artifacts

## GitHub

- push `main`
- create annotated `vX.Y.Z` tag
- push tag
- GitHub Actions build is green
- release assets include Setup, Portable ZIP and SHA256SUMS
- release is marked **Latest** and is not marked pre-release
