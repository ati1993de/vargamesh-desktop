# Publishing VargaMesh Desktop

VargaMesh Desktop releases are built by GitHub Actions for Windows x64 and native macOS Intel / Apple Silicon.

## Preferred release path

1. Prepare the release on a branch.
2. Update `package.json`, `package-lock.json`, `CHANGELOG.md` and `RELEASE-NOTES.md`.
3. Open a pull request and require the Windows and macOS checks to pass.
4. Merge to `main` with a commit message containing `[release]`.

Example squash-merge title:

```text
[release] Publish VargaMesh Desktop v0.6.2
```

The Windows workflow then creates the GitHub Release for the version in `package.json`, and the macOS workflow uploads Intel x64 and Apple Silicon arm64 DMG/ZIP artifacts to the same release.

## Local verification

Before publishing:

```bash
npm install
npm run check
git diff --check
```

## Expected v0.6.2 assets

```text
VargaMesh-Desktop-v0.6.2-Windows-x64-Setup.exe
VargaMesh-Desktop-v0.6.2-Windows-x64-Portable.zip
SHA256SUMS

VargaMesh-Desktop-v0.6.2-macOS-x64.dmg
VargaMesh-Desktop-v0.6.2-macOS-x64.zip
SHA256SUMS-macOS-x64

VargaMesh-Desktop-v0.6.2-macOS-arm64.dmg
VargaMesh-Desktop-v0.6.2-macOS-arm64.zip
SHA256SUMS-macOS-arm64
```

Do not reuse or move an existing release tag. Every release version must remain reproducible.
