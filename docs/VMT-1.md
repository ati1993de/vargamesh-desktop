# VargaMesh Desktop VMT-1

VargaMesh Desktop v0.5.0 adds native VMT-1 token support on VargaMesh Mainnet.

## Architecture

Desktop keeps the existing self-custody split:

```text
Electron renderer
    |
    | allow-listed IPC only
    v
Electron main process
    |
    | localhost cookie-authenticated RPC
    v
VargaMesh Core
```

The VMT-1 main process also performs read-only HTTPS queries against the public
VMT API for indexed token state, metadata, the active CREATE policy and exact
signed-transaction preflight.

The renderer never receives:

- the Core RPC cookie
- an arbitrary RPC bridge
- private keys
- wallet backup files

## Address model

VMT-1 balances belong to one concrete native SegWit `vm1...` address, not to a
wallet name.

A Desktop Core wallet can contain many addresses, so Desktop:

1. enumerates known owned `vm1...` addresses,
2. queries the VMT indexer per address,
3. keeps token holdings separated by owner address,
4. uses that exact address as the VMT authorizer when spending.

This is required because VMT-1 authorization is defined by transaction input 0.

## Sending, burning and minting

For a token operation Desktop:

1. selects a confirmed spendable VMESH UTXO from the VMT owner/issuer address,
2. inserts that outpoint as input 0,
3. builds the VMT OP_RETURN payload,
4. lets Core fund the remaining network fee and change,
5. verifies that Core did not reorder input 0,
6. signs with `signrawtransactionwithwallet`,
7. verifies input 0 again on the signed transaction,
8. submits the exact signed transaction to `/api/v1/vmt/preflight`,
9. stores the signed candidate only briefly in main-process memory,
10. repeats the same preflight immediately before broadcast,
11. broadcasts with local Core only if the final checks still pass.

TRANSFER, BURN and MINT pay the normal VMESH network fee. They do not pay the
VMT CREATE fee.

MINT is only allowed when the selected address is the token issuer and the token
is mintable. Lifetime `minted_atomic`, not current supply, is used when checking
maximum supply. Burns therefore do not reopen mint capacity.

## CREATE

Desktop builds CREATE payloads locally and obtains the current CREATE fee policy
from:

```text
GET /api/v1/vmt/status
```

The fee amount, activation height and fee recipient are not hard-coded in the
Desktop renderer.

Before broadcast the signed transaction must pass:

- VMT protocol parsing
- ledger validation
- CREATE policy validation
- authorizer validation
- base-chain `testmempoolaccept`

The CREATE transaction TXID becomes the VMT token ID after confirmation.

## Receive

The same native `vm1...` address receives VMESH and VMT-1 tokens.

A token can be displayed even without a token-specific Core UTXO because VMT
balances are reconstructed by the VMT indexer. To spend from that address,
however, VMT-1 requires a confirmed spendable VMESH UTXO at that same address so
input 0 can prove authorization. Additional wallet inputs may pay the remaining
network fee.

## Token directory and metadata

Desktop displays indexed token details and approved metadata/logo information.

Native issuer metadata submission is intentionally not enabled in the first
v0.5.0 candidate. The current VMT metadata API requires a compressed secp256k1
public key plus a DER ECDSA signature over SHA-256 of its challenge. VargaMesh
Core does not currently expose that exact arbitrary-message proof through an
approved wallet RPC.

Desktop does not export a private key merely to work around that limitation.

## Public API dependency

Token balances and metadata are obtained from the public VMT indexer. Base-chain
validation, keys and transaction broadcast remain local through VargaMesh Core.

If the public VMT API is temporarily unavailable, ordinary VMESH wallet and full
node functionality continue to work.

## Regression vectors

The source tests include the first real Mainnet VMT token:

```text
YALCUS / YALC
token id:
be95b3080519d9be5c400ef13ddc303e32ffde6b0234becb106f56aef16ee451
```

CREATE payload:

```text
564d5401010008016345785d8a0000016345785d8a00000659414c4355530459414c43
```

500 YALC TRANSFER payload to
`vm1qsfsgj70pdv86nguvexzvsflmcknz4lrsj87wx9`:

```text
564d540103be95b3080519d9be5c400ef13ddc303e32ffde6b0234becb106f56aef16ee4510000000ba43b740082608979e16b0fa9a38cc984c827fbc5a62afc70
```
