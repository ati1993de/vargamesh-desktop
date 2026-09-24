#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$ROOT/resources/core"
REPO="ati1993de/vargamesh-core"
TAG="${VMESH_CORE_TAG:-v0.1.0}"
ASSET="${VMESH_CORE_ASSET:-VargaMesh-v0.1.0-windows-x86_64.zip}"

mkdir -p "$DEST"

if [[ -f "$DEST/vargameshd.exe" && -f "$DEST/vargamesh-cli.exe" ]]; then
  echo "VargaMesh Core already present in resources/core"
  file "$DEST/vargameshd.exe" "$DEST/vargamesh-cli.exe" || true
  sha256sum "$DEST/vargameshd.exe" "$DEST/vargamesh-cli.exe" | tee "$DEST/CORE-BINARIES.sha256"
  exit 0
fi

command -v gh >/dev/null 2>&1 || {
  echo "ERROR: gh CLI is required to download Core automatically."
  echo "Alternative: place vargameshd.exe and vargamesh-cli.exe in $DEST"
  exit 1
}
command -v unzip >/dev/null 2>&1 || { echo "ERROR: unzip is required."; exit 1; }

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "Downloading $REPO $TAG / $ASSET"
gh release download "$TAG" --repo "$REPO" --pattern "$ASSET" --dir "$tmp"
zip="$tmp/$ASSET"
[[ -f "$zip" ]] || { echo "ERROR: release asset not downloaded: $ASSET"; exit 1; }

actual="$(sha256sum "$zip" | awk '{print $1}')"
echo "$actual  $ASSET" | tee "$DEST/CORE-PACKAGE.sha256"

# GitHub release assets may expose a sha256 digest. Verify it when available.
expected="$(gh api "repos/$REPO/releases/tags/$TAG" --jq ".assets[] | select(.name == \"$ASSET\") | .digest // empty" 2>/dev/null | head -n1 || true)"
if [[ "$expected" == sha256:* ]]; then
  expected="${expected#sha256:}"
  if [[ "$expected" != "$actual" ]]; then
    echo "ERROR: Core release asset digest mismatch"
    echo "Expected: $expected"
    echo "Actual:   $actual"
    exit 1
  fi
  echo "GitHub asset digest verification: PASS"
else
  echo "INFO: GitHub did not expose an asset digest; recorded local SHA256 above."
fi

mkdir -p "$tmp/unpack"
unzip -q "$zip" -d "$tmp/unpack"
daemon="$(find "$tmp/unpack" -type f -iname 'vargameshd.exe' -print -quit)"
cli="$(find "$tmp/unpack" -type f -iname 'vargamesh-cli.exe' -print -quit)"
[[ -n "$daemon" && -n "$cli" ]] || { echo "ERROR: Core archive does not contain both Windows executables."; exit 1; }
daemon_dir="$(dirname "$daemon")"
cli_dir="$(dirname "$cli")"
[[ "$daemon_dir" == "$cli_dir" ]] || { echo "ERROR: Core daemon and CLI are not in the same runtime directory."; exit 1; }
# Preserve the complete Windows runtime directory, not only the two EXEs.
# This ensures any release-shipped DLL/runtime files are bundled with Desktop.
find "$DEST" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
cp -a "$daemon_dir"/. "$DEST"/
[[ -f "$DEST/vargameshd.exe" && -f "$DEST/vargamesh-cli.exe" ]] || { echo "ERROR: Runtime copy failed."; exit 1; }
find "$DEST" -type f -iname '*.exe' -exec chmod 0644 {} +
sha256sum "$DEST/vargameshd.exe" "$DEST/vargamesh-cli.exe" | tee "$DEST/CORE-BINARIES.sha256"
echo "Bundled Core runtime files:"
find "$DEST" -maxdepth 1 -type f -printf '  %f\n' | sort

echo "Core preparation: PASS"
