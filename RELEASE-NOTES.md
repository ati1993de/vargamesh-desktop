# VargaMesh Desktop v0.2.1

Windows x64 full-node wallet hotfix.

## Fixes

- preserves the complete VargaMesh Core Windows runtime directory during packaging instead of extracting only the daemon and CLI executables
- hardens the child-process PATH with the bundled Core directory and Windows system runtime paths
- decodes Windows loader exit `0xC0000135` as `STATUS_DLL_NOT_FOUND` in `desktop-runtime.log`
- surfaces Core startup failures directly in the Desktop startup banner instead of remaining indefinitely on “Starting VargaMesh Core”
- keeps the existing localhost-only RPC and Core-owned private-key security model

This is a testing pre-release. Verify SHA256 checksums and test with small amounts first.
