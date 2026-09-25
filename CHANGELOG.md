# Changelog

All notable VargaMesh Desktop changes are documented here.

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
