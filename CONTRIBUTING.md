# Contributing to VargaMesh Desktop

Contributions, reproducible bug reports and focused pull requests are welcome.

## Development setup

Requirements:

- Node.js 22+
- npm
- Windows for native runtime testing, or Linux with Wine for Windows packaging

Install dependencies and run the project checks:

```bash
npm install
npm run check
```

Start the Electron application in development mode:

```bash
npm start
```

A VargaMesh Core Windows x64 runtime is required under `resources/core/` unless a development Core directory is supplied by the supported environment configuration.

## Pull requests

Keep changes focused and explain:

- what behavior changed
- why the change is needed
- how it was tested
- whether wallet, RPC, Core lifecycle, packaging or security boundaries are affected

Before opening a pull request, run:

```bash
npm run check
git diff --check
```

Do not commit generated `dist/` artifacts, `node_modules/`, live wallet data or downloaded Core binaries.

## Security-sensitive changes

Changes involving wallet keys, passphrases, RPC authentication, preload IPC, filesystem access, external navigation or Core startup should be reviewed as security-sensitive.

Never add debugging that prints:

- WIF/private keys
- wallet passphrases
- RPC cookie contents
- wallet files/backups
- access tokens or SSH keys

See `SECURITY.md` for the project security boundaries.
