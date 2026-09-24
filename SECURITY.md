# Security Policy

VargaMesh Desktop is non-custodial desktop software. Private keys are managed by VargaMesh Core.

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
- Core RPC stays on localhost
- wallet passphrases and WIF keys are used only for the immediate requested operation and are not persisted in Desktop settings
- sensitive-looking Base58 private keys are redacted from surfaced main-process errors
- the screen-lock event requests `walletlock` for all loaded wallets

## WIF import

For descriptor wallets, Desktop builds the selected descriptor form around the supplied WIF, asks Core to validate it, derives the public address, optionally verifies it against an expected address, then imports it with `importdescriptors`.

The private descriptor is not written to Desktop logs or settings. If a wallet passphrase is supplied for the import operation, Desktop temporarily unlocks the wallet and requests `walletlock` afterward.

Always use the **Expected address** field when recovering a known address if possible.

## Tray mode

Closing or minimizing to tray does not terminate the process. Core continues running locally. Use the tray action **Quit and stop Core** when you want a full shutdown.

Use independent backups and test new pre-release builds with small amounts first.
