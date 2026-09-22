# Security Policy

## Wallet security model

VargaMesh Desktop does **not** implement private-key cryptography itself.
Wallet creation, encryption, signing, backup, restore and migration are delegated
to the bundled VargaMesh Core daemon through localhost JSON-RPC.

The renderer has no Node.js integration, no direct filesystem access, no direct
RPC credentials and no arbitrary command execution. IPC is limited to an
explicit allow-list in `preload.js` and `main.js`.

Wallet passphrases are never written to application settings or logs. They are
held only long enough to perform the requested RPC operation. JavaScript strings
cannot be guaranteed to be securely zeroed from process memory; users who need
higher-assurance key isolation should use a dedicated signing setup rather than
an Electron wallet UI.

RPC is bound to `127.0.0.1:29667`. Never expose the RPC port to the public
Internet.

## Reporting

Do not open public issues containing wallet backups, private keys, passphrases,
RPC cookies or other secrets. Report security-sensitive findings privately to
the project maintainer.
