# Publishing a VargaMesh Desktop release

VargaMesh Desktop uses tag-driven GitHub Actions releases.

For v0.3.0:

```bash
git switch main
git pull --ff-only origin main
npm run check
git diff --check

git add -A
git commit -m "Release VargaMesh Desktop v0.3.0"
git tag -a v0.3.0 -m "VargaMesh Desktop v0.3.0"

git push origin main
git push origin v0.3.0
```

Pushing the tag triggers `.github/workflows/windows-release.yml`.

The workflow publishes:

```text
VargaMesh-Desktop-v0.3.0-Windows-x64-Setup.exe
VargaMesh-Desktop-v0.3.0-Windows-x64-Portable.zip
SHA256SUMS
```

The release is published as a normal GitHub release and explicitly marked **Latest**.

Monitor it with:

```bash
gh run list --repo ati1993de/vargamesh-desktop --limit 5
```

After the workflow succeeds:

```bash
gh release view v0.3.0 --repo ati1993de/vargamesh-desktop
```

Do not manually upload release binaries generated from an unverified working tree when the tag workflow can build them reproducibly on GitHub's Windows runner.
