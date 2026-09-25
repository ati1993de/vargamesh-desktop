# Publishing VargaMesh Desktop v0.3.2

VargaMesh Desktop uses tag-driven GitHub Actions releases.

```bash
git switch main
git pull --ff-only origin main
npm run check
git diff --check

git add -A
git commit -m "Release VargaMesh Desktop v0.3.2: Core fallbackfee send fix"
git tag -a v0.3.2 -m "VargaMesh Desktop v0.3.2"

git push origin main
git push origin v0.3.2
```

Pushing the tag triggers `.github/workflows/windows-release.yml` and publishes:

```text
VargaMesh-Desktop-v0.3.2-Windows-x64-Setup.exe
VargaMesh-Desktop-v0.3.2-Windows-x64-Portable.zip
SHA256SUMS
```

Monitor:

```bash
gh run list --repo ati1993de/vargamesh-desktop --limit 5
```

After success:

```bash
gh release view v0.3.2 --repo ati1993de/vargamesh-desktop
```

Do not reuse or move the existing `v0.3.0` tag. v0.3.2 must be a new tag so the old release remains reproducible.
