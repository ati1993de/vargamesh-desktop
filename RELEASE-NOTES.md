# VargaMesh Desktop v0.5.0 candidate

VargaMesh Desktop v0.5.0 adds native VMT-1 token support while preserving the existing self-custody full-node architecture.

## VMT-1

- portfolio for token balances held by owned Native SegWit `vm1...` addresses
- token directory and token details
- CREATE, TRANSFER, BURN and authorized MINT
- CREATE policy loaded dynamically from the VMT Mainnet API
- local transaction construction/signing through the bundled VargaMesh Core
- explicit VMT vin[0] authorizer selection and verification
- read-only signed-transaction preflight
- second exact preflight immediately before broadcast
- approved metadata and token logos displayed
- per-address VMT activity where supported by the API

## Security model

The renderer remains sandboxed and does not receive the RPC cookie or an arbitrary RPC bridge. VMT private-key signing remains in VargaMesh Core. Desktop submits only the already signed raw transaction to the public VMT preflight API for deterministic protocol and mempool validation.

A prepared signed transaction is retained in memory for only a short period and is bound to the Core wallet that created it.

## CREATE fee

Desktop does not hard-code the CREATE fee amount or fee address. It reads the active VMT policy from `/api/v1/vmt/status` and relies on the exact signed-transaction preflight before allowing broadcast.

## Metadata

Approved metadata, status and logo are visible. Native metadata submission is not enabled in this candidate because the current metadata API expects a raw secp256k1 SHA-256 issuer proof while VargaMesh Core does not expose that proof format through an approved wallet RPC. Desktop deliberately does not export private keys to work around this.

## Regression vectors

The v0.5.0 source checks include the real YALCUS Mainnet vectors:

- token ID: `be95b3080519d9be5c400ef13ddc303e32ffde6b0234becb106f56aef16ee451`
- YALCUS CREATE payload
- 500 YALC TRANSFER payload to `vm1qsfsgj70pdv86nguvexzvsflmcknz4lrsj87wx9`

Bundled Core remains VargaMesh Core v0.2.0.
