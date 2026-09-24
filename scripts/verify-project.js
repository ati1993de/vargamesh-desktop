"use strict";
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const required = [
  "package.json","src/main.js","src/preload.js","src/rpc.js","src/core-manager.js","src/settings.js",
  "src/renderer/index.html","src/renderer/styles.css","src/renderer/app.js","src/renderer/qr.js","src/wallet-import.js",
  "assets/vmesh_coin.png","assets/vmesh_mark.png","build/icon.ico","docs/MSIX-STORE.md",
  "scripts/build-windows-linux.sh","scripts/prepare-core-linux.sh"
];
for (const rel of required) if (!fs.existsSync(path.join(root, rel))) throw new Error(`Missing required file: ${rel}`);
const pkg = JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8"));
if (pkg.name !== "vargamesh-desktop" || pkg.version !== "0.3.0") throw new Error("Unexpected package identity/version");
if (pkg.build?.appId !== "net.vargatech.vargamesh.desktop") throw new Error("Stable appId missing");
const html = fs.readFileSync(path.join(root,"src/renderer/index.html"),"utf8");
if (/(?:src|href)=["\']https?:\/\//i.test(html)) throw new Error("Renderer HTML must not load remote resources");
if (!html.includes("Content-Security-Policy")) throw new Error("Renderer CSP missing");
const main = fs.readFileSync(path.join(root,"src/main.js"),"utf8");
for (const token of ["contextIsolation: true","nodeIntegration: false","sandbox: true","webSecurity: true","setPermissionRequestHandler","requestSingleInstanceLock"]) {
  if (!main.includes(token)) throw new Error(`Security token missing: ${token}`);
}
const preload = fs.readFileSync(path.join(root,"src/preload.js"),"utf8");
if (!preload.includes("contextBridge.exposeInMainWorld")) throw new Error("Safe preload bridge missing");
if (/ipcRenderer\.send\s*\(/.test(preload)) throw new Error("Unrestricted async IPC send not allowed");
for (const secret of ["rpcpassword=","BEGIN OPENSSH PRIVATE KEY","_authToken="]) {
  const corpus=[main,preload,fs.readFileSync(path.join(root,"src/core-manager.js"),"utf8")].join("\n");
  if (corpus.includes(secret)) throw new Error(`Potential secret pattern in source: ${secret}`);
}

const appjs = fs.readFileSync(path.join(root,"src/renderer/app.js"),"utf8");
const ids = new Set([...html.matchAll(/\sid="([A-Za-z0-9_-]+)"/g)].map(m => m[1]));
for (const m of appjs.matchAll(/\$\(\"([A-Za-z0-9_-]+)\"\)/g)) {
  if (!ids.has(m[1])) throw new Error(`Renderer references missing HTML id: ${m[1]}`);
}
const mainChannels = new Set([...main.matchAll(/register\(\"([^\"]+)\"/g)].map(m => m[1]));
for (const m of preload.matchAll(/call\(\"([^\"]+)\"/g)) {
  if (!mainChannels.has(m[1])) throw new Error(`Preload channel has no explicit main handler: ${m[1]}`);
}


const coreManager = fs.readFileSync(path.join(root,"src/core-manager.js"),"utf8");
for (const token of ["STATUS_DLL_NOT_FOUND","path.join(win, \"System32\")","cwd: this.coreDir","env }"]) {
  if (!coreManager.includes(token)) throw new Error(`Core runtime hardening token missing: ${token}`);
}
const prep = fs.readFileSync(path.join(root,"scripts/prepare-core-linux.sh"),"utf8");
if (!prep.includes('cp -a "$daemon_dir"/. "$DEST"/')) throw new Error("Full Core runtime copy is missing");
if (!appjs.includes('unwrap(await api.startCore())')) throw new Error("Renderer does not surface Core startup errors");
for (const token of ["importPrivateKey","importWatchAddress","expectedAddress","migrate_descriptor_hint","closeToTray","launchAtLogin"]) {
  if (!appjs.includes(token) && !preload.includes(token) && !main.includes(token)) throw new Error(`v0.3.0 feature token missing: ${token}`);
}
for (const token of ["new Tray","setLoginItemSettings","hideToTray","Beenden und Core stoppen","wallet:importPrivateKey","wallet:importWatchAddress","importdescriptors","getdescriptorinfo","deriveaddresses","redacted-private-key"]) {
  if (!main.includes(token)) throw new Error(`Main-process v0.3.0 token missing: ${token}`);
}
const settings = fs.readFileSync(path.join(root,"src/settings.js"),"utf8");
for (const token of ["closeToTray","minimizeToTray","startMinimized","launchAtLogin"]) if (!settings.includes(token)) throw new Error(`Tray setting missing: ${token}`);
const importer = fs.readFileSync(path.join(root,"src/wallet-import.js"),"utf8");
for (const token of ["wpkh(","pkh(","sh(wpkh(","requireWif","addDescriptorChecksum"]) if (!importer.includes(token)) throw new Error(`Wallet importer token missing: ${token}`);
const buildScript = fs.readFileSync(path.join(root,"scripts/build-windows-linux.sh"),"utf8");
if (!buildScript.includes("xvfb-run") || !buildScript.includes("wine32:i386")) throw new Error("Headless Wine build preflight missing");

console.log("VargaMesh Desktop source verification: PASS");
