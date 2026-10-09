# VargaMesh Desktop v0.7.0

VargaMesh Desktop v0.7.0 focuses on local contact management, VNS-assisted recipient review, native desktop alerts and improved accessibility.

## New
- Local address book supporting VMESH Mainnet addresses and .vmesh names
- VNS name resolution with strict HTTPS endpoint and local Core validation; recipients are re-resolved at broadcast and changed destinations are rejected
- Native incoming-payment, first-confirmation and completed-sync notifications
- Independent notification preferences; amounts hidden by default
- Transaction history CSV export via local Save dialog
- Responsive navigation and contact editor
- Exact decimal input validation (maximum 8 digits) before Core RPC
- Duplicate-send request guard
- Regression tests covering contacts, VNS response validation, notification deduplication and full translation keys for DE/EN/RU/ZH

## Unchanged
- Original three configured bootstrap node IPs
- Existing VargaMesh Core v0.2.0 runtime and full-node process
- Private-key and wallet backup formats
- VMT-1 token transactions and preflight
- NestEx market data opt-out

## Security and limitations
- VNS requests expose the looked-up name and public IP to vargamesh.com, but never send wallet balances, seeds, keys or RPC cookies.
- VNS name changes cancel the payment. Always verify the full resolved address.
- Network fees in the send dialog are **estimates**, not exact funded-transaction fees.
- Plaintext recovery TXT and unencrypted CSV exports remain sensitive. Store offline.
- Native notification settings control display; the OS may still require notification permission.
- macOS packages remain unsigned and not notarized; Windows packages are not guaranteed Authenticode-signed.
- This is not an independent security audit and has not been validated against a funded live wallet.
- Please test on a disposable wallet before using significant funds.

## Download
The coordinated GitHub Actions workflow builds Windows x64 Setup/Portable ZIP,
macOS Intel and Apple Silicon DMG/ZIP and accompanying SHA256SUMS.
Download from the official GitHub release and verify the checksum.
