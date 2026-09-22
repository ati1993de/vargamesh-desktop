# VargaMesh Desktop

<p align="center">
  <strong>Windows full-node wallet and desktop interface for VargaMesh (VMESH).</strong>
</p>

<p align="center">
  Full Node · Wallet · Windows x64 · VargaMesh Core · No Cloud Wallet
</p>

---

## Overview

**VargaMesh Desktop** is the graphical Windows wallet and full-node controller
for the **VargaMesh (VMESH)** network.

The application provides a desktop interface around the real
**VargaMesh Core** daemon.

Wallet cryptography, private-key storage, transaction signing, blockchain
validation and peer-to-peer networking remain inside VargaMesh Core.

The Electron interface does **not** implement its own cryptocurrency wallet
or private-key cryptography in JavaScript.

| Project | Link |
| --- | --- |
| VargaMesh Website | https://vargacoin.com |
| VargaMesh Core | https://github.com/ati1993de/vargamesh-core |
| Core Releases | https://github.com/ati1993de/vargamesh-core/releases |
| Desktop Releases | https://github.com/ati1993de/vargamesh-desktop/releases |
| Explorer Development | https://mempool.vargacoin.com |

---

## Current Release

Current Desktop version:

**VargaMesh Desktop v0.1.1**

Bundled Core version:

**VargaMesh Core v0.1.0**

Current status:

**Pre-release / public testing**

Available Windows x64 packages:

- Windows installer
- installation-free portable ZIP
- SHA256 checksum file

Download releases here:

https://github.com/ati1993de/vargamesh-desktop/releases

---

## Features

### Full Node

- bundled `vargameshd.exe`
- automatic VargaMesh Core startup
- full VargaMesh blockchain validation
- blockchain synchronization status
- current chain height
- synchronization progress
- peer count
- network status
- safe first-start Core configuration
- automatic connection to the VargaMesh network
- clean Core shutdown with the application

### Wallet

- create new wallets
- create encrypted wallets
- create unencrypted wallets
- load existing wallets
- unload wallets
- wallet balance display
- generate receiving addresses
- locally generated QR codes
- transaction history
- send VMESH
- destination-address validation
- fee estimation
- explicit irreversible-transaction confirmation
- temporary wallet unlocking for transactions
- automatic wallet locking after protected operations
- wallet backup through VargaMesh Core
- restore existing VargaMesh Core wallet backups
- legacy wallet detection
- legacy wallet migration through Core `migratewallet`

### Desktop

- German interface
- English interface
- Windows x64 installer
- installation-free portable ZIP
- persistent Core and wallet data outside the application directory
- no telemetry
- no cloud wallet service
- no remote wallet backend

---

## Architecture

VargaMesh Desktop follows a simple security model:

```text
┌─────────────────────────────────────┐
│          Electron Renderer          │
│                                     │
│  User interface only                │
│  No Node.js access                  │
│  No RPC credentials                 │
│  No private-key handling            │
└──────────────────┬──────────────────┘
                   │
                   │ allow-listed IPC
                   ▼
┌─────────────────────────────────────┐
│        Electron Main Process        │
│                                     │
│  Starts and monitors Core           │
│  Performs approved RPC operations   │
└──────────────────┬──────────────────┘
                   │
                   │ localhost
                   │ cookie-authenticated
                   │ JSON-RPC
                   ▼
┌─────────────────────────────────────┐
│          VargaMesh Core             │
│                                     │
│  Blockchain validation              │
│  P2P networking                     │
│  Wallet database                    │
│  Private keys                       │
│  Transaction signing                │
└─────────────────────────────────────┘
```

The renderer is created with:

```text
contextIsolation: true
nodeIntegration: false
sandbox: true
webSecurity: true
```

Navigation outside the application is restricted and renderer access to
system functionality is exposed only through explicitly allow-listed IPC
operations.

The renderer never receives the VargaMesh Core RPC authentication cookie.

---

## Wallet Security Model

Private keys remain under the control of **VargaMesh Core**.

VargaMesh Desktop does not:

- implement private-key cryptography in JavaScript
- store private keys in Electron settings
- transmit wallet keys to a cloud service
- expose the Core RPC cookie to the renderer
- operate a remote custodial wallet service

Wallet signing is performed by VargaMesh Core.

For encrypted wallets, Desktop temporarily unlocks the wallet only when
required for an approved operation and requests that Core lock it again
afterward.

---

## Wallet Creation

New wallets can be created directly through the Desktop interface.

Supported options include:

- encrypted wallet
- unencrypted wallet

Encryption is strongly recommended for wallets containing funds.

Wallet passwords should be stored securely and independently from the
computer running VargaMesh Desktop.

Losing both the wallet backup and wallet password may result in permanent
loss of access to funds.

---

## Receiving VMESH

The wallet can generate VargaMesh receiving addresses directly through Core.

QR codes are generated locally by the Desktop application.

No third-party QR generation service is required.

---

## Sending VMESH

VargaMesh Desktop supports VMESH transactions through the VargaMesh Core
wallet.

Before sending, the application performs address validation and displays an
explicit transaction confirmation.

Cryptocurrency transactions are irreversible after confirmation by the
network.

Always verify:

- destination address
- amount
- selected wallet

before approving a transaction.

For early testing, use small amounts.

---

## Wallet Backup

Wallet backups are created through the Core `backupwallet` RPC.

Users should maintain at least one independent backup outside the normal
Windows data directory.

A backup should ideally be stored on separate media.

Do not rely exclusively on the computer running VargaMesh Desktop as the
only location of your wallet data.

---

## Wallet Restore

Use:

**Wallet → Restore backup**

Supported VargaMesh Core wallet backup files can be restored through Core's
`restorewallet` functionality.

The selected backup file is passed to VargaMesh Core.

Desktop does not extract or parse private keys from the backup itself.

After restoration, allow the node sufficient time to synchronize and detect
wallet transactions.

---

## Legacy Wallet Migration

VargaMesh Desktop can detect compatible legacy wallets reported by
VargaMesh Core and request migration using:

```text
migratewallet
```

VargaMesh Core creates a legacy backup during migration.

Nevertheless, always keep an independent copy of the original wallet before
testing migration.

---

## Current Wallet Limitations

The current v0.1.1 release does **not** yet provide all advanced wallet
management functionality.

Not currently available through the Desktop interface:

- WIF private-key import
- WIF private-key export
- individual private-key management
- advanced coin control
- manual UTXO selection
- PSBT workflow
- hardware-wallet integration

Users who only possess an individual WIF private key should **not** assume
that it can currently be imported through VargaMesh Desktop.

WIF import is planned for a future Desktop release.

---

## VargaMesh Core

VargaMesh Desktop uses the real VargaMesh Core implementation.

Core repository:

https://github.com/ati1993de/vargamesh-core

Core releases:

https://github.com/ati1993de/vargamesh-core/releases

The current Desktop v0.1.1 package bundles:

```text
VargaMesh Core v0.1.0
```

Consensus rules, blockchain validation, AuxPoW validation, monetary policy
and network behavior are defined by VargaMesh Core.

---

## VargaMesh Network

Default VargaMesh Mainnet ports:

| Service | Port |
| --- | --- |
| P2P | `29666/TCP` |
| JSON-RPC | `29667/TCP` |

VargaMesh Desktop keeps RPC bound to localhost.

The RPC interface is not intended to be publicly exposed.

---

## Important VargaMesh Core v0.1.0 Note

VargaMesh Core v0.1.0 currently requires an explicit P2P bind in the
generated configuration.

Desktop creates:

```ini
bind=0.0.0.0:29666
```

RPC remains local-only:

```ini
rpcbind=127.0.0.1
rpcallowip=127.0.0.1
rpcport=29667
```

The generated `vargamesh.conf` is authoritative for P2P and RPC binding.

Desktop launches Core using only the required runtime arguments:

```text
-datadir=<path>
-conf=<path>
-printtoconsole=0
```

Network binding arguments are intentionally not duplicated on the Core
command line.

---

## Windows Data Location

VargaMesh Desktop deliberately stores blockchain and wallet data in the
normal Windows user profile.

Default location:

```text
%LOCALAPPDATA%\VargaMesh
```

This applies to both:

- installed version
- portable ZIP version

The portable build does **not** store live wallet data beside the executable.

This prevents users from accidentally carrying a live wallet inside the
portable application folder.

---

## Portable ZIP

The portable release means:

**installation is not required**

It does **not** mean:

**wallet data is stored beside the executable**

The ZIP must be fully extracted before launching:

```text
VargaMesh Desktop.exe
```

Do not run the application directly from inside the ZIP archive.

---

## VargaMesh Explorer

A VargaMesh-specific blockchain explorer and mempool stack is currently
under development.

Development endpoint:

https://mempool.vargacoin.com

The explorer project is intended to provide information such as:

- blocks
- transactions
- mempool activity
- chain height
- network activity
- mining information

The VMESH-specific indexing backend is still undergoing development and
testing.

Until it is explicitly marked production-ready, consensus-critical
information should be verified directly against VargaMesh Core.

---

## VargaMesh Website

Project information and ecosystem links are available at:

https://vargacoin.com

The website is informational only.

Consensus behavior and wallet balances are determined by the VargaMesh
network and VargaMesh Core, not by the website.

---

## Installing a Release

Download the latest Desktop release from:

https://github.com/ati1993de/vargamesh-desktop/releases

Choose either:

```text
VargaMesh-Desktop-vX.Y.Z-Windows-x64-Setup.exe
```

or:

```text
VargaMesh-Desktop-vX.Y.Z-Windows-x64-Portable.zip
```

Also download:

```text
SHA256SUMS
```

Verify the downloaded file before executing it.

---

## SHA256 Verification

Example using PowerShell:

```powershell
Get-FileHash `
  .\VargaMesh-Desktop-v0.1.1-Windows-x64-Setup.exe `
  -Algorithm SHA256
```

Portable ZIP:

```powershell
Get-FileHash `
  .\VargaMesh-Desktop-v0.1.1-Windows-x64-Portable.zip `
  -Algorithm SHA256
```

Compare the resulting hash with the corresponding value in:

```text
SHA256SUMS
```

Never install a release if the checksum does not match.

---

## Code Signing

Early VargaMesh Desktop builds may be unsigned unless a Windows
code-signing certificate is configured in the release workflow.

Windows SmartScreen may therefore display a reputation warning.

This does not replace checksum verification.

Always verify the downloaded artifact against the official `SHA256SUMS`
file published with the GitHub release.

---

## First Start

During first startup VargaMesh Desktop:

1. determines the local VargaMesh data directory
2. creates a safe initial `vargamesh.conf` if one does not already exist
3. launches the bundled VargaMesh Core daemon
4. waits for the Core RPC service
5. authenticates using the local Core cookie
6. retrieves blockchain and network state
7. displays synchronization progress in the Desktop interface

Initial blockchain synchronization may take time depending on:

- current chain height
- available peers
- network connection
- disk performance
- CPU performance

Closing the application requests a clean Core shutdown.

---

## No Telemetry

VargaMesh Desktop does not intentionally include application telemetry,
advertising tracking or a cloud wallet backend.

Wallet operations occur locally between the Desktop application and
VargaMesh Core.

---

## Development

Requirements:

- Node.js 24
- npm
- Windows for official Windows packaging
- VargaMesh Core Windows x64 package

Clone:

```powershell
git clone https://github.com/ati1993de/vargamesh-desktop.git
cd vargamesh-desktop
```

Install dependencies:

```powershell
npm install
```

Set a local Core build:

```powershell
$env:VARGAMESH_CORE_DIR='C:\path\to\VargaMesh-v0.1.0-windows-x86_64'
```

Start development mode:

```powershell
npm start
```

When `VARGAMESH_CORE_DIR` is not configured, Desktop can use Core binaries
from:

```text
resources/core/
```

---

## Automated Windows Builds

The GitHub Actions workflow:

```text
.github/workflows/windows-release.yml
```

performs the Windows release build.

The workflow:

1. checks out the requested Desktop revision
2. configures Node.js 24
3. downloads the official VargaMesh Core Windows package
4. verifies the Core package SHA256 checksum
5. verifies required Core executables
6. installs Desktop dependencies
7. performs static checks
8. builds the Windows installer
9. builds the portable ZIP
10. verifies the packaged runtime code
11. creates SHA256 checksums
12. uploads Windows build artifacts

Tag-based builds can additionally create a GitHub release.

---

## Packaged Runtime Verification

The release workflow verifies the actual packaged application before it is
published.

Among other checks, it ensures that deprecated duplicate Core launch
arguments are not present in the packaged application.

The generated Core configuration remains authoritative for network binding.

This prevents regression of startup failures caused by passing the same
network binding options through both configuration and command-line
arguments.

---

## Release Artifacts

For v0.1.1 the Windows workflow produces:

```text
VargaMesh-Desktop-v0.1.1-Windows-x64-Setup.exe
VargaMesh-Desktop-v0.1.1-Windows-x64-Portable.zip
SHA256SUMS
```

Manual GitHub Actions runs create build artifacts.

A version tag can create a GitHub release according to the configured
release workflow.

---

## Testing

Community testing is welcome.

Useful areas to test include:

- clean first startup
- Core startup
- initial blockchain synchronization
- peer connectivity
- application restart
- Core restart
- wallet creation
- wallet encryption
- wallet unlock / lock behavior
- receiving addresses
- QR generation
- incoming transactions
- outgoing transactions
- transaction history
- wallet backup
- wallet restore
- legacy wallet migration
- installer installation
- installer removal
- portable ZIP startup
- upgrade from earlier Desktop releases

Use small amounts when testing wallet transactions.

---

## Reporting Issues

Desktop-specific issues:

https://github.com/ati1993de/vargamesh-desktop/issues

VargaMesh Core or consensus-related issues:

https://github.com/ati1993de/vargamesh-core/issues

When reporting a Desktop issue, useful information includes:

- Desktop version
- VargaMesh Core version
- Windows version
- installed or portable build
- relevant error message
- reproduction steps

Do **not** include:

- private keys
- WIF keys
- seed material
- wallet passwords
- RPC cookies
- wallet files
- authentication credentials

---

## Security

Never publish:

- private keys
- WIF private keys
- wallet files
- wallet backups
- wallet passwords
- seed phrases
- RPC authentication cookies
- API credentials
- SSH private keys
- production secrets

Do not send private keys to anyone claiming that they need them for support.

Anyone with access to a private key may be able to control the associated
funds.

---

## Project Relationship

VargaMesh Desktop is a user interface for VargaMesh Core.

```text
VargaMesh
│
├── VargaMesh Core
│   ├── consensus
│   ├── blockchain
│   ├── P2P
│   ├── AuxPoW
│   ├── RPC
│   └── wallet / signing
│
├── VargaMesh Desktop
│   └── Windows graphical full-node wallet
│
├── VargaMesh Explorer
│   └── blocks / transactions / mempool
│
└── VargaMesh Website
    └── project and ecosystem information
```

This separation is intentional.

The Desktop interface can evolve independently while consensus-critical
behavior remains inside VargaMesh Core.

---

## Upstream and Attribution

VargaMesh Desktop interfaces with VargaMesh Core.

VargaMesh Core is derived from Bitcoin Core and retains the applicable
upstream licensing, copyright and attribution information.

See the VargaMesh Core repository for Core-specific attribution:

https://github.com/ati1993de/vargamesh-core

---

## License

See the repository license file for the licensing terms applicable to
VargaMesh Desktop.

---

## Important Notice

VargaMesh Desktop and the wider VargaMesh ecosystem are under active
development.

The current v0.1.1 release is intended for public testing.

Users should:

- keep independent wallet backups
- verify downloaded release checksums
- test new versions with small amounts first
- never disclose private keys
- never expose Core RPC publicly
- report reproducible bugs through GitHub Issues

Consensus-critical behavior is defined by VargaMesh Core, not by the
Desktop interface, website or blockchain explorer.
