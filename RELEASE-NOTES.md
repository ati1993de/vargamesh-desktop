# VargaMesh Desktop v0.4.0

VargaMesh Desktop v0.4.0 introduces deterministic recovery-phrase wallets while preserving compatibility with existing VargaMesh Core wallets.

## Recovery Wallets

- Create new wallets with 12- or 24-word BIP39 recovery phrases
- Restore wallets deterministically from the recovery phrase
- BIP32 HD key derivation
- Proposed SLIP-0044 coin type: 22093
- Native SegWit / BIP84 is the default:
  `m/84'/22093'/0'/0/index`
- Legacy BIP44 compatibility:
  `m/44'/22093'/0'/0/index`
- VargaMesh-specific BIP32 extended-key serialization
- Full blockchain rescan when recovering an existing wallet

## Recovery safety

- Recovery phrases are not stored in Desktop settings
- Private HD descriptors remain under VargaMesh Core wallet control
- Core descriptor errors are sanitized before reaching the UI
- Recovery phrase can be copied explicitly during creation
- Optional TXT export is available with a security warning
- Wallet encryption passphrases are not written to the recovery TXT file

## Compatibility

Existing functionality remains supported:

- existing descriptor wallets
- encrypted and unencrypted Core wallets
- wallet backup and restore
- WIF private-key import
- watch-only addresses
- wallet lock/unlock
- VMESH send and receive
- local full node and transaction history
- system tray/background operation

## Validation performed

The v0.4.0 recovery implementation was validated against VargaMesh Core with:

- all four private BIP44/BIP84 receive/change descriptors accepted by Core
- deterministic `vm1...` Native SegWit address generation
- recovery under a different wallet name from the same mnemonic
- blockchain rescan recovering the same transaction and UTXO
- encrypted wallet operation
- ESLint undefined-symbol checks
- HD derivation and private-descriptor regression tests

Bundled Core: VargaMesh Core v0.2.0

## Important

The SLIP-0044 value `22093` is currently the proposed VargaMesh coin type and is not an official SLIP-0044 registry assignment until accepted upstream.

Keep recovery phrases offline and private. Anyone who obtains the recovery phrase can reconstruct the wallet.

Verify downloaded binaries against `SHA256SUMS`.

## Wallet documentation

New and existing users should read the wallet quick-start documentation:

- `docs/WALLET-GUIDE.md` – English
- `docs/WALLET-GUIDE-DE.md` – Deutsch
- `docs/WALLET-DERIVATION.md` – technical HD derivation specification

Existing wallets remain fully supported. Older wallets are not automatically
converted into BIP39 Recovery Wallets.
