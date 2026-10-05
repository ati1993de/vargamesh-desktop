# Privacy

VargaMesh Desktop does not intentionally include telemetry, advertising trackers or a cloud wallet service.

Wallet operations are sent from the local Electron main process to the local VargaMesh Core RPC endpoint on `127.0.0.1` using Core cookie authentication.

Sensitive values such as wallet passphrases and WIF private keys are not stored in Desktop settings or Desktop runtime diagnostics. A WIF entered for import exists in application memory only for the requested local import operation and is then cleared from the visible input by the renderer.

Blockchain/P2P operation inherently communicates with VargaMesh network peers. Peer IP addresses and other network information may appear in VargaMesh Core's own `debug.log`; Core itself warns that logs may contain privacy-sensitive information.

If **NestEx market data** is enabled in Settings, VargaMesh Desktop makes a direct HTTPS request to `https://trade.nestex.one/api/cg/tickers/VMESH_USDT` at most once per minute to retrieve public VMESH/USDT ticker information. This request can reveal the user's public network IP address to NestEx. No wallet addresses, wallet balances, private keys, recovery phrases, passphrases, RPC cookies or transaction data are included in the request. Market data can be disabled in Desktop settings, and a NestEx outage does not affect local wallet or node operation.
