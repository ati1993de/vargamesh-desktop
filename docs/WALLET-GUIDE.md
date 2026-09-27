# VargaMesh Desktop Wallet – Quick Guide

This guide applies to **VargaMesh Desktop v0.4.0**.

VargaMesh Desktop runs a local VargaMesh Core full node.
Private keys and transaction signing remain local on your computer.

## Which wallet should I use?

### Recovery Wallet

Recommended for new wallets.

Recovery Wallets use:

- 12 or 24 BIP39 recovery words
- BIP32 HD derivation
- BIP84 Native SegWit by default
- BIP44 legacy compatibility

Default receive path:

    m/84'/22093'/0'/0/index

Legacy compatibility path:

    m/44'/22093'/0'/0/index

The proposed VargaMesh SLIP-0044 coin type is:

    22093

This value is not an official SLIP-0044 assignment until accepted upstream.

### New Wallet

**New Wallet** creates a regular VargaMesh Core wallet.

It does not provide a 12/24-word BIP39 Recovery Phrase.

For classic wallets, keeping a Core wallet backup is especially important.

## Create a Recovery Wallet

1. Open **Wallet**.
2. Select **Recovery Wallet**.
3. Enter a wallet name.
4. Choose 12 or 24 recovery words.
5. Optionally set a wallet encryption passphrase.
6. Select **Generate Recovery Phrase**.
7. Store all words securely and in the correct order.
8. Optionally copy the phrase or save it as a TXT file.
9. Confirm that the Recovery Phrase has been backed up.
10. Create the wallet.

Anyone with the Recovery Phrase can reconstruct the wallet and control its funds.

## Recovery Phrase security

Recommended:

- write the words down offline
- keep secure backup copies
- store copies in separate secure locations

Do not:

- send the phrase by email
- post it in Discord or messaging apps
- upload screenshots to cloud storage
- send it to support

VargaMesh support will never need your Recovery Phrase.

The optional TXT export is **not encrypted**.

The wallet encryption passphrase is not written to the recovery TXT file.

## Restore a Recovery Wallet

If the computer is lost, wallet files are deleted, or VargaMesh Desktop is reinstalled:

1. Open **Wallet**.
2. Select **Recovery Restore**.
3. Choose a new wallet name.
4. Enter the original 12 or 24 words.
5. Choose a local wallet encryption passphrase.
6. Start recovery.

The restored wallet name does not need to match the old wallet name.

The same Recovery Phrase reconstructs the same keys and addresses.

VargaMesh Core rescans the blockchain to rediscover transactions and UTXOs.

## Recovery Phrase vs wallet passphrase

They are different.

### Recovery Phrase

The 12 or 24 words determine the wallet keys.

They are used for deterministic recovery.

### Wallet passphrase

The wallet passphrase encrypts the local Core wallet.

It protects the wallet data stored on the computer.

When restoring from a Recovery Phrase, a new local wallet passphrase may be chosen.

## Existing wallets from older versions

Existing VargaMesh Core wallets remain supported.

Upgrading to v0.4.0 does not replace or automatically convert existing wallets.

Use:

    Load Wallet

to load an existing local wallet.

An older wallet does **not** automatically receive a BIP39 Recovery Phrase.

Continue keeping Core wallet backups for wallets that were originally created
without a Recovery Phrase.

## Backup Restore vs Recovery Restore

These are two different recovery methods.

### Backup Restore

Restores an existing Core wallet backup, for example:

    wallet.dat
    *.dat
    *.bak

### Recovery Restore

Restores a deterministic wallet from:

    12 or 24 recovery words

## Wallet Backup

**Wallet Backup** creates a Core wallet backup.

A Core backup can also be useful for Recovery Wallets.

For a Recovery Wallet, however, the correctly stored Recovery Phrase remains
the primary long-term recovery method.

## Lock and Unlock

Encrypted wallets are normally locked.

### Unlock Wallet

Enter the wallet passphrase.

The wallet is temporarily unlocked for the duration configured in Settings.

### Lock Wallet

Immediately locks the wallet again.

Receiving VMESH works while the wallet is locked.

Signing and sending transactions may require the wallet to be unlocked.

## Receive VMESH

1. Open **Receive**.
2. Select **Generate New Address**.
3. A new Native SegWit address is generated.

VargaMesh Mainnet Native SegWit addresses typically begin with:

    vm1...

The QR code is generated locally.

## Send VMESH

1. Open **Send**.
2. Enter the destination address.
3. Enter the amount.
4. Verify destination, amount and fee.
5. Confirm the transaction.
6. If the wallet is locked, enter its wallet passphrase.

Transaction signing is performed locally by VargaMesh Core.

## Rescan Blockchain

**Rescan Blockchain** searches the blockchain again for transactions belonging
to the current wallet.

This can be useful after:

- Recovery Phrase restoration
- private-key import
- missing transaction history

A complete rescan may take some time.

## Import Key / Address

VargaMesh Desktop continues to support:

- WIF private keys
- Bech32 / P2WPKH
- P2SH-SegWit
- Legacy / P2PKH
- watch-only addresses

Never share private keys.

## Legacy Wallet Migration

Older non-descriptor wallets may be migrated using:

    Migrate Legacy Wallet

If a wallet already uses descriptor format, no migration is required.

Always create a wallet backup before migration.

## Unload Wallet

**Unload Wallet does not delete the wallet.**

It only removes the wallet from the currently running VargaMesh Core instance.

The wallet remains stored locally and may later be loaded again.

## Does creating a wallet write data to the blockchain?

No.

Creating:

- a wallet
- a Recovery Phrase
- private keys
- addresses

does not write anything to the blockchain.

On-chain data is created only when addresses are actually used in transactions.

## What should I back up?

### Recovery Wallet

At minimum:

    Recovery Phrase

Additionally recommended:

    Core wallet backup

### Classic wallet without Recovery Phrase

Keep:

    Core wallet backup

and any separately exported private keys where applicable.

## Security rules

1. Never share your Recovery Phrase.
2. Never share private keys.
3. Protect your wallet passphrase.
4. Store Recovery TXT exports securely and offline.
5. Test recovery with a small amount before relying on the wallet for significant funds.
6. Verify release downloads against `SHA256SUMS`.
7. Maintain current backups.
