# Wallet import and recovery

This document explains the difference between wallet migration, wallet restore, WIF private-key import and watch-only import in VargaMesh Desktop.

## Legacy wallet migration

**Legacy-wallet migration** converts an old Core legacy wallet into the newer descriptor-wallet format. It does not move a single address from one wallet to another.

If Core reports that a wallet is already a descriptor wallet, no migration is necessary and Desktop disables the migration action.

## Restore a wallet backup

Use wallet restore when you have a compatible VargaMesh Core wallet backup. Desktop passes the selected backup to VargaMesh Core; it does not parse or extract private keys itself.

Create an independent backup before experimenting with recovery or migration.

## Import an existing spendable address

An address is public information. To spend funds belonging to an existing address, you need the corresponding private key or a compatible wallet backup.

For a WIF private key:

1. select the destination wallet
2. open **Wallet → Schlüssel / Adresse importieren**
3. choose **Private key (WIF)**
4. choose the correct address type
5. enter the known address in **Expected address** whenever possible
6. enter the WIF locally
7. choose **Check key** before import
8. import only if the derived address matches the expected address
9. enable the full-history scan if the address may have historical transactions

For native VargaMesh addresses beginning with `vm1`, use **Bech32 / P2WPKH**.

## Descriptor wallets

For descriptor wallets, Desktop constructs the required private descriptor only for the immediate local RPC operation and uses Core `importdescriptors`.

## Legacy wallets

For legacy wallets, Desktop uses Core `importprivkey`.

## Watch-only import

A watch-only address can be monitored but cannot spend funds. Use this when you intentionally do not want the private key on the computer.

## Security

Never send or paste a WIF/private key into:

- GitHub Issues
- Discord or other chat services
- email
- websites or online forms
- screenshots
- support requests

Anyone who obtains the private key can control the corresponding funds.
