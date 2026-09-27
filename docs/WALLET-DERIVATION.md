# VargaMesh HD Wallet Derivation

VargaMesh Desktop v0.4.0 implements deterministic recovery-phrase wallets.

## Standards

- BIP39 mnemonic: 12 or 24 English words
- BIP32 hierarchical deterministic key derivation
- Proposed SLIP-0044 coin type: 22093
- secp256k1

## BIP44 / Legacy P2PKH

Receive:

    m/44'/22093'/0'/0/index

Change:

    m/44'/22093'/0'/1/index

## BIP84 / Native SegWit P2WPKH

BIP84 is the default VargaMesh Desktop HD receive/change family.

Receive:

    m/84'/22093'/0'/0/index

Change:

    m/84'/22093'/0'/1/index

## Core integration

The mnemonic is converted into ranged private descriptors in the Electron main
process. Those descriptors are imported into a blank VargaMesh Core descriptor
wallet.

VargaMesh Core remains the authoritative wallet store and signing engine.

Existing Core wallets, Core .dat backups, legacy wallets and WIF imports remain
supported.

No blockchain consensus, block format, AuxPoW or network change is required.

## Security

The recovery phrase is not persisted in Desktop settings and is not deliberately
written to log files.

During new-wallet creation it is shown only for backup confirmation. During
recovery it is entered by the user and cleared from the renderer after the
operation.

The optional Desktop/Core wallet encryption passphrase is NOT the optional
BIP39 mnemonic passphrase. VargaMesh Desktop v0.4.0 deliberately does not expose
the optional BIP39 passphrase feature to avoid ambiguous recovery procedures.

## VargaMesh Mainnet BIP32 serialization

VargaMesh Mainnet uses chain-specific BIP32 extended-key version bytes:

    Extended public key:  0x024D771C
    Extended private key: 0x024D7707

Wallet implementations MUST use these values when serializing BIP32
extended keys for VargaMesh Mainnet.

Bitcoin xpub/xprv serialization MUST NOT be used for VMESH descriptors.
