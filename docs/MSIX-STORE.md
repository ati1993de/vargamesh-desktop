# Microsoft Store / MSIX preparation

VargaMesh Desktop v0.2.1 is prepared so the normal Windows x64 installer can be converted with Microsoft's **MSIX Packaging Tool**.

## Before conversion

Build and test:

```text
VargaMesh-Desktop-v0.2.1-Windows-x64-Setup.exe
```

Use a clean Windows 11 VM for the conversion. Install the Microsoft MSIX Packaging Tool and reserve the application name in Partner Center first.

## Package identity

Desktop application identity used by the source project:

```text
appId / AppUserModelID: net.vargatech.vargamesh.desktop
Product: VargaMesh Desktop
Architecture: x64
Execution level: asInvoker
```

For the **MSIX package identity**, use the exact values from Microsoft Partner Center. In particular, do not guess the `Publisher` or `Package/Identity/Name` fields.

## Conversion flow

1. Start from a clean Windows VM snapshot.
2. Open MSIX Packaging Tool → Application package → Create package on this computer.
3. Select `VargaMesh-Desktop-v0.2.1-Windows-x64-Setup.exe`.
4. Let the installer complete normally.
5. Launch VargaMesh Desktop once only if the tool requires first-run capture; do not create or fund a real wallet during capture.
6. Finish monitoring and review captured files/registry entries.
7. Ensure mutable blockchain/wallet data remains under `%LOCALAPPDATA%\VargaMesh`, not in the package installation directory.
8. Apply the Partner Center package identity.
9. Use the supplied store artwork from `build/store/` as a starting set where the Partner Center field dimensions match.
10. Validate the MSIX on a clean Windows 11 VM before Store submission.

## Included store artwork

```text
build/store/Square44x44Logo.png
build/store/Square150x150Logo.png
build/store/StoreLogo.png
build/store/Wide310x150Logo.png
build/store/SplashScreen.png
```

They are derived from the existing official VargaMesh mark used by the project.

## Important packaging behavior

- the app does not require Administrator privileges for normal operation
- no self-updater modifies the package installation directory
- Core/wallet/chain data stays in `%LOCALAPPDATA%\VargaMesh`
- VargaMesh Core RPC remains localhost-only
- the renderer has no direct filesystem or arbitrary RPC access
- release signing and Store certification are separate from VMESH/network validation

After Store certification, follow Microsoft's current Partner Center/MSIX signing workflow for the final package.
