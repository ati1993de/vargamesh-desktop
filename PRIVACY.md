# Privacy

VargaMesh Desktop does not intentionally include telemetry, advertising trackers or a cloud wallet service.

Wallet operations are sent from the local Electron main process to the local VargaMesh Core RPC endpoint on `127.0.0.1` using Core cookie authentication.

Sensitive values such as wallet passphrases and WIF private keys are not stored in Desktop settings or Desktop runtime diagnostics. A WIF entered for import exists in application memory only for the requested local import operation and is then cleared from the visible input by the renderer.

Blockchain/P2P operation inherently communicates with VargaMesh network peers. Peer IP addresses and other network information may appear in VargaMesh Core's own `debug.log`; Core itself warns that logs may contain privacy-sensitive information.

If **NestEx market data** is enabled in Settings, VargaMesh Desktop makes direct HTTPS requests to NestEx market-data endpoints under `api.nestex.one` and, if the primary endpoint is unavailable, `trade.nestex.one`. Desktop starts at most one refresh cycle per minute; a fallback request can occur within that cycle if the primary NestEx endpoint fails. This request can reveal the user's public network IP address to NestEx. No wallet addresses, wallet balances, private keys, recovery phrases, passphrases, RPC cookies or transaction data are included in the request. Market data can be disabled in Desktop settings, and a NestEx outage does not affect local wallet or node operation.


## v0.7.0 contacts, VNS, alerts and local exports
Desktop contacts are stored locally in the app-data directory as JSON. No contact list is automatically uploaded. Resolving a public .vmesh name makes an HTTPS request to vargamesh.com, revealing the looked-up name and the device's public IP to the API; no wallet address, balance, key, seed, passphrase or RPC cookie is included. Native OS notifications are configurable, with amounts hidden by default. On some systems, notifications are also shown on the lock screen. The transactions CSV export is plaintext and saved only to a user-selected local file. Standard OS backups or sync tools might copy the contact file or CSV if configured by the user.
