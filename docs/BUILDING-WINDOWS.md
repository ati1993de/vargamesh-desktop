# Building VargaMesh Desktop for Windows x64

## Native Windows build

Requirements:

- Node.js 22+
- npm
- VargaMesh Core Windows x64 runtime in `resources/core/`

Run:

```powershell
npm install
npm run check
npm run dist:win
```

Expected artifacts:

```text
VargaMesh-Desktop-v0.3.0-Windows-x64-Setup.exe
VargaMesh-Desktop-v0.3.0-Windows-x64-Portable.zip
```

## Linux + Wine build

Ubuntu/Debian packages:

```bash
sudo dpkg --add-architecture i386
sudo apt update
sudo apt install -y wine wine32:i386 xvfb xauth unzip git gh ca-certificates
```

Authenticate GitHub CLI if required, then run:

```bash
chmod +x scripts/*.sh
npm run build:linux-wine
```

The build helper:

1. verifies the local build environment
2. downloads the official VargaMesh Core `v0.1.0` Windows x64 release
3. preserves the complete Core runtime directory
4. runs project checks
5. runs electron-builder for Windows x64
6. produces SHA256 checksums
7. automatically uses Xvfb on a headless Linux host

## Release signing

Local/GitHub builds are unsigned unless a Windows code-signing identity is configured. Microsoft Store/MSIX distribution uses its own package identity and certification flow. See `MSIX-STORE.md`.
