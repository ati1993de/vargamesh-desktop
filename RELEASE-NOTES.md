# VargaMesh Desktop v0.5.1

VargaMesh Desktop v0.5.1 is a focused Windows x64 hotfix for the v0.5.0 first-launch renderer startup error.

## Fixed: startup error on first launch

v0.5.0 could show:

`Cannot read properties of null (reading 'forEach')`

The error came from the renderer localization initialization. The single-element DOM helper `$()` was accidentally used with CSS collection selectors such as `[data-i18n]`. Because that helper uses `getElementById`, it returned `null`, and the following `.forEach()` aborted the initialization sequence before the normal Core startup refresh completed.

v0.5.1 changes those selectors to the existing `$$()` querySelectorAll helper and adds a regression check to the project verifier.

## What stays unchanged

- native VMT-1 support from v0.5.0
- local VargaMesh Core v0.2.0 full node
- self-custody wallet and local signing
- BIP39/BIP32 recovery wallets
- CREATE, TRANSFER, BURN and authorized MINT flows
- existing wallet, blockchain and settings data

## Downloads

The tagged Windows build provides:

- `VargaMesh-Desktop-v0.5.1-Windows-x64-Setup.exe`
- `VargaMesh-Desktop-v0.5.1-Windows-x64-Portable.zip`
- `SHA256SUMS`

Existing blockchain and wallet data remains under `%LOCALAPPDATA%\\VargaMesh`. Keep an independent wallet backup before upgrading.

VargaMesh Desktop is pre-1.0 software. Carefully verify recipient addresses and transaction amounts before sending.
