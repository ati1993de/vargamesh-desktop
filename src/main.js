"use strict";

const { app, BrowserWindow, ipcMain, dialog, shell, clipboard, session, powerMonitor } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const { CoreManager } = require("./core-manager");
const { SettingsStore } = require("./settings");

app.setAppUserModelId("net.vargatech.vargamesh.desktop");

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();

let mainWindow = null;
let core = null;
let settings = null;
let closing = false;

const EXTERNAL_ALLOWLIST = new Set([
  "https://vargacoin.com/",
  "https://mempool.vargacoin.com/",
  "https://github.com/ati1993de/vargamesh-core",
  "https://github.com/ati1993de/vargamesh-core/releases",
  "https://github.com/ati1993de/vargamesh-desktop",
  "https://github.com/ati1993de/vargamesh-desktop/releases",
  "https://github.com/ati1993de/vargamesh-wallet-sdk",
  "https://www.npmjs.com/package/@vargamesh/wallet-sdk"
]);

function localBaseDir() {
  return process.env.LOCALAPPDATA || app.getPath("userData");
}

function paths() {
  const dataDir = path.join(localBaseDir(), "VargaMesh");
  const configFile = path.join(dataDir, "vargamesh.conf");
  const coreDir = process.env.VARGAMESH_CORE_DIR || (app.isPackaged
    ? path.join(process.resourcesPath, "core")
    : path.join(__dirname, "..", "resources", "core"));
  return { dataDir, configFile, coreDir };
}

function requireWalletName(name) {
  if (typeof name !== "string") throw new Error("Invalid wallet name.");
  const value = name.trim();
  if (!value || value.length > 96 || !/^[A-Za-z0-9._ -]+$/.test(value) || value.includes("..")) {
    throw new Error("Wallet name may contain letters, numbers, spaces, dot, dash and underscore only.");
  }
  return value;
}

function requireTxid(txid) {
  if (typeof txid !== "string" || !/^[0-9a-fA-F]{64}$/.test(txid)) throw new Error("Invalid transaction ID.");
  return txid.toLowerCase();
}

function requireAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 21_000_000) throw new Error("Invalid VMESH amount.");
  return Number(amount.toFixed(8));
}

function requireAddress(value) {
  if (typeof value !== "string") throw new Error("Invalid address.");
  const address = value.trim();
  if (address.length < 14 || address.length > 128) throw new Error("Invalid address.");
  return address;
}

function errorText(err) {
  if (!err) return "Unknown error";
  const text = String(err.message || err);
  return text.replace(/Basic\s+[A-Za-z0-9+/=]+/gi, "[redacted-auth]").slice(0, 1200);
}

function register(channel, handler) {
  ipcMain.handle(channel, async (_event, payload) => {
    try {
      return { ok: true, data: await handler(payload || {}) };
    } catch (err) {
      return { ok: false, error: errorText(err), code: Number.isFinite(err?.code) ? err.code : null };
    }
  });
}

async function walletRpc(method, params, wallet, timeout) {
  const name = requireWalletName(wallet);
  return core.rpc.call(method, params, name, timeout);
}

async function walletSummary(name) {
  const wallet = requireWalletName(name);
  const [info, balances] = await Promise.all([
    walletRpc("getwalletinfo", [], wallet),
    walletRpc("getbalances", [], wallet).catch(() => null)
  ]);
  return { name: wallet, info, balances };
}

function installHandlers() {
  register("app:info", async () => {
    const p = paths();
    return {
      name: app.getName(),
      version: app.getVersion(),
      platform: process.platform,
      arch: process.arch,
      electron: process.versions.electron,
      dataDir: p.dataDir,
      coreDir: p.coreDir,
      packaged: app.isPackaged
    };
  });

  register("settings:get", async () => settings.get());
  register("settings:update", async payload => settings.update(payload));

  register("core:start", async () => core.start());
  register("core:stop", async () => core.stop());
  register("core:status", async () => {
    if (!(await core.isRpcReady())) return { running: false, lastExit: core.lastExit };
    return core.nodeStatus();
  });
  register("core:mempool", async () => core.rpc.call("getmempoolinfo"));
  register("core:mining", async () => core.rpc.call("getmininginfo"));
  register("core:peers", async () => {
    const peers = await core.rpc.call("getpeerinfo");
    return peers.map(peer => ({
      id: peer.id,
      addr: peer.addr,
      addrbind: peer.addrbind,
      inbound: !!peer.inbound,
      subver: peer.subver,
      version: peer.version,
      startingheight: peer.startingheight,
      synced_headers: peer.synced_headers,
      synced_blocks: peer.synced_blocks,
      pingtime: peer.pingtime,
      bytessent: peer.bytessent,
      bytesrecv: peer.bytesrecv,
      connection_type: peer.connection_type || ""
    }));
  });

  register("wallet:list", async () => {
    const [loaded, directory] = await Promise.all([
      core.rpc.call("listwallets"),
      core.rpc.call("listwalletdir").catch(() => ({ wallets: [] }))
    ]);
    const entries = (directory.wallets || []).map(item => ({
      name: typeof item === "string" ? item : item.name,
      loaded: loaded.includes(typeof item === "string" ? item : item.name)
    }));
    for (const name of loaded) if (!entries.some(x => x.name === name)) entries.push({ name, loaded: true });
    return { loaded, wallets: entries.sort((a, b) => a.name.localeCompare(b.name)) };
  });

  register("wallet:create", async payload => {
    const name = requireWalletName(payload.name);
    const passphrase = typeof payload.passphrase === "string" ? payload.passphrase : "";
    if (passphrase && passphrase.length < 8) throw new Error("Wallet passphrase must contain at least 8 characters.");
    const result = await core.rpc.call("createwallet", [name, false, false, passphrase, false, true, true], "", 30_000);
    settings.update({ activeWallet: name });
    return result;
  });

  register("wallet:load", async payload => {
    const name = requireWalletName(payload.name);
    const result = await core.rpc.call("loadwallet", [name, true], "", 30_000);
    settings.update({ activeWallet: name });
    return result;
  });

  register("wallet:unload", async payload => {
    const name = requireWalletName(payload.name);
    const result = await core.rpc.call("unloadwallet", [name, true], "", 30_000);
    if (settings.get().activeWallet === name) settings.update({ activeWallet: "" });
    return result;
  });

  register("wallet:summary", async payload => walletSummary(payload.wallet));
  register("wallet:transactions", async payload => {
    const count = Math.min(200, Math.max(10, Number(payload.count) || settings.get().txPageSize));
    const skip = Math.max(0, Number(payload.skip) || 0);
    return walletRpc("listtransactions", ["*", count, skip, true], payload.wallet, 30_000);
  });
  register("wallet:unspent", async payload => walletRpc("listunspent", [0, 9999999, [], true], payload.wallet, 30_000));
  register("wallet:newaddress", async payload => {
    const label = typeof payload.label === "string" ? payload.label.slice(0, 96) : "";
    return walletRpc("getnewaddress", [label, "bech32"], payload.wallet);
  });
  register("wallet:validate", async payload => core.rpc.call("validateaddress", [requireAddress(payload.address)]));
  register("wallet:fee", async payload => {
    const target = Math.min(1008, Math.max(1, Number(payload.target) || 6));
    return core.rpc.call("estimatesmartfee", [target, "conservative"]);
  });
  register("wallet:unlock", async payload => {
    const passphrase = typeof payload.passphrase === "string" ? payload.passphrase : "";
    if (!passphrase) throw new Error("Passphrase is required.");
    const seconds = Math.min(3600, Math.max(15, Number(payload.seconds) || settings.get().autoLockSeconds));
    await walletRpc("walletpassphrase", [passphrase, seconds], payload.wallet, 30_000);
    return { unlockedFor: seconds };
  });
  register("wallet:lock", async payload => walletRpc("walletlock", [], payload.wallet));
  register("wallet:send", async payload => {
    const wallet = requireWalletName(payload.wallet);
    const address = requireAddress(payload.address);
    const amount = requireAmount(payload.amount);
    const check = await core.rpc.call("validateaddress", [address]);
    if (!check?.isvalid) throw new Error("Destination address is not valid for VargaMesh.");
    const comment = typeof payload.comment === "string" ? payload.comment.slice(0, 120) : "";
    const subtract = !!payload.subtractFee;
    return walletRpc("sendtoaddress", [address, amount, comment, "", subtract], wallet, 60_000);
  });
  register("wallet:backup", async payload => {
    const wallet = requireWalletName(payload.wallet);
    const result = await dialog.showSaveDialog(mainWindow, {
      title: "VargaMesh wallet backup",
      defaultPath: path.join(app.getPath("documents"), `${wallet}-${new Date().toISOString().slice(0, 10)}-wallet.dat`),
      filters: [{ name: "Wallet backup", extensions: ["dat"] }]
    });
    if (result.canceled || !result.filePath) return { canceled: true };
    await walletRpc("backupwallet", [result.filePath], wallet, 60_000);
    return { canceled: false, file: result.filePath };
  });
  register("wallet:restore", async payload => {
    const wallet = requireWalletName(payload.wallet);
    const selected = await dialog.showOpenDialog(mainWindow, {
      title: "Restore VargaMesh wallet backup",
      properties: ["openFile"],
      filters: [{ name: "Wallet backup", extensions: ["dat", "bak"] }, { name: "All files", extensions: ["*"] }]
    });
    if (selected.canceled || !selected.filePaths[0]) return { canceled: true };
    const result = await core.rpc.call("restorewallet", [wallet, selected.filePaths[0], true], "", 120_000);
    settings.update({ activeWallet: wallet });
    return { canceled: false, result };
  });
  register("wallet:migrate", async payload => {
    const name = requireWalletName(payload.wallet);
    const passphrase = typeof payload.passphrase === "string" ? payload.passphrase : "";
    return core.rpc.call("migratewallet", passphrase ? [name, passphrase] : [name], "", 120_000);
  });
  register("wallet:rescan", async payload => walletRpc("rescanblockchain", [], payload.wallet, 0));
  register("wallet:abandon", async payload => walletRpc("abandontransaction", [requireTxid(payload.txid)], payload.wallet, 30_000));

  register("clipboard:write", async payload => {
    const text = typeof payload.text === "string" ? payload.text : "";
    if (text.length > 8192) throw new Error("Clipboard content too large.");
    clipboard.writeText(text);
    return true;
  });
  register("external:open", async payload => {
    const url = typeof payload.url === "string" ? payload.url : "";
    if (!EXTERNAL_ALLOWLIST.has(url)) throw new Error("External URL is not allow-listed.");
    await shell.openExternal(url);
    return true;
  });
  register("system:showDataDir", async () => {
    fs.mkdirSync(paths().dataDir, { recursive: true });
    await shell.openPath(paths().dataDir);
    return true;
  });
  register("system:showDebugLog", async () => {
    const file = path.join(paths().dataDir, "debug.log");
    if (!fs.existsSync(file)) throw new Error("debug.log does not exist yet.");
    shell.showItemInFolder(file);
    return true;
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1420,
    height: 900,
    minWidth: 1080,
    minHeight: 700,
    show: false,
    backgroundColor: "#07131c",
    icon: path.join(__dirname, "..", "assets", "vmesh_mark.png"),
    title: "VargaMesh Desktop",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      devTools: !app.isPackaged
    }
  });

  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.webContents.on("will-navigate", event => event.preventDefault());
  mainWindow.on("close", event => {
    if (!closing) {
      event.preventDefault();
      closing = true;
      Promise.race([core?.stop?.(), new Promise(resolve => setTimeout(resolve, 4000))])
        .catch(() => {})
        .finally(() => { mainWindow?.destroy(); });
    }
  });
  mainWindow.on("closed", () => { mainWindow = null; });
}

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});

app.whenReady().then(async () => {
  const p = paths();
  settings = new SettingsStore(path.join(app.getPath("userData"), "settings.json"));
  core = new CoreManager(p);
  core.ensureConfig();

  session.defaultSession.setPermissionRequestHandler((_wc, _permission, callback) => callback(false));
  session.defaultSession.setPermissionCheckHandler(() => false);
  register("noop", async () => true);
  installHandlers();
  createWindow();

  powerMonitor.on("lock-screen", () => {
    core.rpc.call("listwallets").then(wallets => Promise.allSettled(wallets.map(w => core.rpc.call("walletlock", [], w)))).catch(() => {});
  });

  core.start().catch(err => core.writeDiagnostic("core-autostart-error", { message: errorText(err) }));
});

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
