#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

need(){ command -v "$1" >/dev/null 2>&1 || { echo "ERROR: missing command: $1"; exit 1; }; }
need node
need npm
need unzip

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if (( NODE_MAJOR < 22 )); then
  echo "ERROR: Node.js 22 or newer is required. Current: $(node -v)"
  exit 1
fi

if ! command -v wine64 >/dev/null 2>&1 && ! command -v wine >/dev/null 2>&1; then
  echo "ERROR: Wine is required for the Windows x64 electron-builder target."
  exit 1
fi

echo "=============================================================="
echo " VARGAMESH DESKTOP v$(node -p 'require("./package.json").version')"
echo " WINDOWS x64 BUILD ON LINUX + WINE"
echo "=============================================================="
echo "Node: $(node -v)"
echo "npm : $(npm -v)"
(command -v wine64 >/dev/null 2>&1 && wine64 --version) || wine --version

echo "[1/6] Preparing VargaMesh Core"
bash scripts/prepare-core-linux.sh

echo "[2/6] Installing pinned build dependencies"
npm install --no-audit --no-fund

echo "[3/6] Static/source verification"
npm run check

echo "[4/6] Cleaning previous distribution"
rm -rf dist

echo "[5/6] Building Windows x64 installer + portable ZIP"
export CSC_IDENTITY_AUTO_DISCOVERY=false
npm run dist:win

echo "[6/6] Verifying artifacts + checksums"
VERSION="$(node -p 'require("./package.json").version')"
SETUP="dist/VargaMesh-Desktop-v${VERSION}-Windows-x64-Setup.exe"
PORTABLE="dist/VargaMesh-Desktop-v${VERSION}-Windows-x64-Portable.zip"
[[ -s "$SETUP" ]] || { echo "ERROR: installer missing: $SETUP"; exit 1; }
[[ -s "$PORTABLE" ]] || { echo "ERROR: portable ZIP missing: $PORTABLE"; exit 1; }
sha256sum "$SETUP" "$PORTABLE" > dist/SHA256SUMS
cat dist/SHA256SUMS

echo
printf 'PASS\nInstaller: %s\nPortable : %s\n' "$SETUP" "$PORTABLE"
