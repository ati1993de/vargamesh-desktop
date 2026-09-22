# VargaMesh Desktop v0.1.0 – source audit

Prepared 2026-09-22.

## Static validation performed

- JavaScript syntax checked for main, preload, RPC, Core manager, settings and renderer.
- `package.json` parsed successfully as JSON.
- Every renderer `#id` reference used by `app.js` exists in `index.html`.
- Every preload IPC invocation has a matching explicit `ipcMain.handle` registration.
- Renderer HTML contains no remote script, stylesheet or CDN dependency.
- QR generation is local-only using the existing VargaMesh browser QR implementation.
- Windows icon was derived from the supplied VMESH coin artwork.

## Security properties implemented

- `contextIsolation: true`
- `nodeIntegration: false`
- Electron renderer sandbox enabled
- permission requests denied by default
- navigation and new-window creation denied
- strict Content Security Policy
- no RPC cookie exposed through preload
- no arbitrary RPC method exposed through preload
- no arbitrary filesystem read/write exposed through preload
- RPC bound to `127.0.0.1:29667` both in generated config and enforced Core launch arguments
- P2P explicitly bound to `0.0.0.0:29666` to work around the Core v0.1.0 first-start bind issue
- wallet passphrases are not persisted or logged
- backups/restores use Core RPC rather than manual wallet-file manipulation
- legacy migration uses Core `migratewallet`, which creates its own legacy backup

## Build validation still required on GitHub Windows runner

The source package intentionally does not contain Core binaries or Electron
`node_modules`. The supplied Windows GitHub Actions workflow downloads the
published VargaMesh Core v0.1.0 package, verifies its SHA256 checksum and binary
identity, then builds the installer and portable executable.

Before tagging the Desktop v0.1.0 release, test both generated Windows artifacts
on a normal Windows 11 machine with a disposable test wallet first.
