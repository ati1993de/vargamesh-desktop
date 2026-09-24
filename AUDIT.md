# VargaMesh Desktop v0.3.0 – verification summary

This document records project-level checks included with the v0.3.0 source tree. It is not a third-party security audit.

## Automated checks

`npm run check` performs:

- JavaScript syntax checks for the Electron main process, preload, RPC, Core manager, settings, wallet-import helper and renderer
- wallet-import helper tests
- project structure/security regression checks

Expected result:

```text
Wallet import helper tests: PASS
VargaMesh Desktop source verification: PASS
```

## Security properties represented in the source

- renderer sandbox enabled
- `contextIsolation: true`
- `nodeIntegration: false`
- `webSecurity: true`
- allow-listed preload/IPC surface
- no arbitrary RPC bridge exposed to the renderer
- RPC cookie remains in the main process/Core boundary
- Core RPC configured for localhost
- wallet passphrases and WIF keys are not stored in Desktop settings
- private-key-like values are redacted from surfaced application errors
- descriptor-aware wallet import and legacy migration handling

## Release checks

The tagged Windows workflow:

1. uses `windows-latest`
2. downloads the official VargaMesh Core v0.1.0 Windows x64 release
3. preserves the complete Core runtime directory
4. runs `npm run check`
5. builds Setup and Portable ZIP artifacts
6. creates SHA256 checksums
7. publishes the tag as the GitHub Latest release

See `docs/RELEASE-CHECKLIST.md` for the manual validation expected before release publication.
