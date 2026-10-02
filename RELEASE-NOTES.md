# VargaMesh Desktop v0.5.2

VargaMesh Desktop v0.5.2 is the multilingual Windows x64 release of the self-custody VargaMesh full-node wallet.

## Russian and Simplified Chinese

The complete Desktop interface now supports four selectable languages:

- Deutsch
- English
- Русский
- 简体中文

Russian and Simplified Chinese cover the main dashboard, wallet creation and recovery, send/receive flows, transaction history, node/network status, settings, WIF/watch-only import, backup/restore, VMT-1 portfolio and token actions, validation messages, Windows tray actions, background notifications and native file dialogs.

Number and date formatting follows the active locale (`de-DE`, `en-US`, `ru-RU`, or `zh-CN`). The language choice is persisted in the local Desktop settings.

## Reliability

v0.5.2 includes the v0.5.1 first-launch fix for the renderer localization crash and expands its regression protection to every localization collection selector.

A dedicated localization test validates translation-key completeness across all four languages, dynamic renderer/VMT keys, language persistence, native UI translations and script-loading order.

## Existing v0.5 features

- native VMT-1 portfolio and token directory
- CREATE, TRANSFER, BURN and authorized MINT
- exact signed-transaction preflight before broadcast
- local VargaMesh Core signing and self-custody architecture
- BIP39/BIP32 recovery wallets
- wallet backup/restore and WIF/watch-only import
- Windows tray/background integration

## Security and compatibility

No VargaMesh consensus or network rules change in this release. Private keys remain in VargaMesh Core and the renderer remains sandboxed with allow-listed IPC only.

Bundled Core remains **VargaMesh Core v0.2.0**. Existing blockchain, wallet and settings data remains under `%LOCALAPPDATA%\VargaMesh`.

## Downloads

- `VargaMesh-Desktop-v0.5.2-Windows-x64-Setup.exe`
- `VargaMesh-Desktop-v0.5.2-Windows-x64-Portable.zip`
- `SHA256SUMS`

Verify the SHA256 checksum before running a downloaded binary. VargaMesh Desktop is pre-1.0 software; carefully verify recipient addresses and transaction amounts before sending.
