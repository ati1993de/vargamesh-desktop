# VargaMesh Desktop v0.7.0 – project verification record

This is a maintainer-maintained checklist and automated regression coverage, **not an independent security audit**.

- `npm run check` executes ESLint, JavaScript syntax validation, HD/import/recovery tests, fee/VMT/market tests, professional-feature tests, full four-language i18n validation and structural security checks.
- VNS names are checked against the resolver response, validated by Core, shown explicitly in the UI and checked again immediately before send.
- Contact JSON data is kept in the Desktop user-data directory. Recovery material is **never** stored in the contacts file.
- Wallet receive/confirmation notifications are deduplicated against a baseline acquired on first poll; no past activity alerts at app startup.
- Privacy: system notifications hide amounts by default; VNS lookup reveals public name and public IP.
- Known limitation: standard VMESH send still uses Core `sendtoaddress`, so displayed fee rate is an estimate rather than an exact PSBT fee.
- Core's existing three static bootstrap IPs are intentionally unchanged.
- Before public release, run live disposable-wallet payment, confirmation, VNS name-change, UI, macOS and Windows installer tests.

A green source CI job is not equivalent to independent security review or real-wallet acceptance testing.
