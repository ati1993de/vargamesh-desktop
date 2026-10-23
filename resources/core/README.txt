VargaMesh Core v0.3.0 is downloaded during packaging, not committed as binaries.
SHA-256 of every official platform archive is pinned in resources/core-release.json.

For Windows x64 packaging from Linux/Wine:
  npm run prepare:core:linux

For native macOS builds: see docs/BUILDING-MACOS.md.

Release packages include the matching native Core daemon, CLI and runtime files.
Source archives do not include prebuilt Core binaries.
