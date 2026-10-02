# Changelog

## [0.5.1] - 2026-10-02

### Fixed

- Fixed the renderer startup crash `Cannot read properties of null (reading 'forEach')` that could be shown as a Core startup failure on first launch.
- `applyI18n()` now uses the `$$()` querySelectorAll helper for `[data-i18n]` and `[data-i18n-placeholder]` collections instead of the single-element `$()` helper.
- The normal startup sequence can now continue directly into Core startup and wallet refresh without requiring a manual reload/refresh.

### Tests

- Added a source-verification regression guard so collection-style i18n selectors cannot accidentally be switched back to `$()`.

## [0.5.0] - 2026-10-01

### Added

- Native VMT-1 portfolio across owned `vm1...` addresses in the active Core wallet.
- VMT-1 token directory and token detail view.
- VMT-1 CREATE, TRANSFER, BURN and issuer-only MINT transaction flows.
- Dynamic CREATE fee policy from the public VMT API; no hard-coded 1000 VMESH fee in Desktop.
- Exact signed-transaction VMT preflight before broadcast and a second preflight immediately before `sendrawtransaction`.
- VMT authorizer hardening: input 0 is explicitly selected from the token owner address and verified before and after signing.
- VMT token logo retrieval with size/type limits.
- YALCUS CREATE and 500 YALC TRANSFER regression vectors.

### Security

- Private keys remain in VargaMesh Core for VMT transaction signing.
- Renderer receives only allow-listed VMT IPC methods; no arbitrary Core RPC or RPC cookie access.
- Prepared signed VMT transactions are short-lived in the Electron main process and bound to the wallet that created them.
- Mint capacity uses lifetime minted supply; burns do not reopen mint capacity.

### Notes

- Off-chain issuer metadata submission remains read-only in Desktop v0.5.0 until a Core-native issuer-proof method is added. Existing approved metadata is displayed.

## 0.4.0

- Added BIP39 12/24-word recovery phrase wallets.
- Added BIP32 HD derivation.
- Added BIP44 VMESH derivation at coin type 22093.
- Added BIP84 Native SegWit VMESH derivation at coin type 22093.
- Added recovery-phrase wallet creation and restore UI.
- Existing Core wallets, wallet.dat backups and WIF imports remain supported.
- No VargaMesh consensus or network changes.


All notable VargaMesh Desktop changes are documented here.

## [0.3.3] - 2026-09-27

### Changed

- upgraded the bundled VargaMesh Core from v0.1.0 to v0.2.0
- Windows builds now use the official VargaMesh Core v0.2.0 Windows x64 release
- synchronized Desktop package metadata for v0.3.3
- retained the existing sparse-network fallback-fee compatibility behavior

### Core

- bundled Core: VargaMesh Core v0.2.0
- Mainnet remains the default network
- the bundled Core also contains VargaMesh Public Testnet v1 support

## [0.3.2] - 2026-09-25

### Fixed

- removed the `settxfee` RPC call used by v0.3.1 because VargaMesh Core v0.1.0 does not expose that RPC
- bundled Core now starts with `-fallbackfee=0.00001000` (1 sat/vB equivalent), which is the Core-supported path when fee-estimator history is insufficient
- sending again uses the normal `sendtoaddress` flow; smart estimates are used when available and Core falls back only when necessary
- if an already-running Core still has fallback fees disabled, Desktop now tells the user to fully stop the old Core and restart v0.3.2 instead of showing only a generic RPC error

## [0.3.1] - 2026-09-25

### Fixed

- sending no longer fails on a new or low-traffic VargaMesh network when `estimatesmartfee` has insufficient history
- Desktop now derives a temporary fallback fee from the local node's relay/mempool policy, with a 1 sat/vB minimum and a defensive automatic ceiling
- the temporary wallet fee override is cleared immediately after the send attempt so normal automatic fee selection resumes
- the Send page now shows when the displayed rate is a fallback instead of presenting fee-estimator insufficiency as a fatal error
- the selected confirmation target is carried into the send request for consistent fee-policy resolution

## [0.3.0] - 2026-09-24

### Added

- Windows system-tray/background mode.
- Close-to-tray, minimize-to-tray, start-minimized and start-with-Windows settings.
- Tray command to lock all loaded wallets.
- WIF private-key import for descriptor wallets through Core `importdescriptors`.
- WIF private-key import for legacy wallets through Core `importprivkey`.
- Bech32/P2WPKH, P2SH-SegWit and P2PKH import choices.
- Expected-address verification before private-key import.
- Watch-only address import.
- Optional full-chain history scan for imported keys/addresses.
- Optional temporary wallet unlock for protected imports, followed by relock.
- Wallet format/encryption state display.
- Professional release, build, support and wallet-import documentation.

### Changed

- Descriptor wallets no longer expose an actionable legacy-migration flow.
- Headless Linux/Wine build preflight now uses Xvfb when required.
- Tagged GitHub builds are published as the primary/Latest release rather than a pre-release.

### Security

- Private-key-like Base58 strings are redacted from surfaced main-process errors.
- WIF keys and wallet passphrases are not persisted in Desktop settings or runtime diagnostics.
- The tray screen-lock action can lock loaded wallets without opening the main window.

## [0.2.1]

- Fixed bundled Core Windows runtime handling and startup diagnostics.
- Preserved the complete Core runtime directory required by `vargameshd.exe`.

## [0.2.0]

- Redesigned VargaMesh-native UI.
- Expanded wallet, transaction, node, peer, mempool and diagnostic functionality.
