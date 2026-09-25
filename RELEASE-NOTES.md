# VargaMesh Desktop v0.3.2

**Recommended Windows release.**

VargaMesh Desktop v0.3.2 fixes the v0.3.1 send regression on sparse/new VargaMesh networks.

## Fixed: `Method not found` while sending

v0.3.1 correctly detected that `estimatesmartfee` had insufficient history, but attempted to apply the temporary rate through the `settxfee` RPC. VargaMesh Core v0.1.0 does not expose that RPC, so clicking the send/review flow could end with **“Method not found.”**

v0.3.2 uses the Core-supported fallback mechanism instead:

- bundled VargaMesh Core starts with `-fallbackfee=0.00001000`
- this equals a 1 sat/vB baseline for an 8-decimal VMESH network
- `estimatesmartfee` remains preferred when sufficient history exists
- normal `sendtoaddress` transaction creation is used; no `settxfee` RPC is called
- the UI continues to show `Fallback` while estimator history is insufficient
- if an old/external Core is still running without fallback fees enabled, Desktop returns an actionable restart message

After installing v0.3.2, fully quit the old Desktop instance (including tray/Core) before launching v0.3.2 so the bundled Core is restarted with the new fee setting.

## Downloads

- `VargaMesh-Desktop-v0.3.2-Windows-x64-Setup.exe`
- `VargaMesh-Desktop-v0.3.2-Windows-x64-Portable.zip`
- `SHA256SUMS`

Existing blockchain and wallet data remains under `%LOCALAPPDATA%\VargaMesh`. Keep an independent wallet backup before upgrading.

VargaMesh Desktop is pre-1.0 software. Carefully verify recipient addresses and transaction amounts before sending.
