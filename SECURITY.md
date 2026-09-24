# Security Policy

VargaMesh Desktop is non-custodial desktop software. Private keys remain in VargaMesh Core wallet databases.

## Never include in bug reports

- private keys or WIF strings
- seed material
- wallet.dat or wallet backups
- wallet passphrases
- `.cookie` RPC authentication contents
- SSH private keys
- npm/GitHub/API access tokens

## Desktop security boundaries

- Electron renderer sandbox enabled
- `contextIsolation: true`
- `nodeIntegration: false`
- strict local Content Security Policy
- external navigation denied
- permission requests denied by default
- renderer has only explicit preload methods
- no arbitrary RPC method bridge
- RPC cookie is never returned to the renderer
- passphrases are sent only for the immediate Core operation and are not persisted by Desktop settings

Use independent backups and test new pre-release builds with small amounts first.
