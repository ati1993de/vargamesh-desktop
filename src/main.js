"use strict";
const { app, BrowserWindow, ipcMain, dialog, shell, clipboard, session } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const { CoreManager } = require("./core-manager");
const { SettingsStore } = require("./settings");
const { RpcError } = require("./rpc");

if (process.platform === "win32") app.setAppUserModelId("net.vargatech.vargamesh.desktop");

let mainWindow;
let core;
let settings;
let quitting = false;

function cleanError(error) {
  if (error instanceof RpcError) return { ok: false, error: error.message, code: error.code };
  return { ok: false, error: error && error.message ? error.message : "Unknown error" };
}

function validWalletName(value) {
  return typeof value === "string" && value.length >= 1 && value.length <= 64 && /^[A-Za-z0-9._ -]+$/.test(value);
}
function validText(value, max = 128) { return typeof value === "string" && value.length <= max; }
function validPass(value) { return typeof value === "string" && value.length <= 1024; }
function selectedWallet() {
  const name = settings.getPublic().selectedWallet;
  if (!name) throw new Error("No wallet selected");
  return name;
}

function coreDir() {
  if (process.env.VARGAMESH_CORE_DIR) return process.env.VARGAMESH_CORE_DIR;
  if (app.isPackaged) return path.join(process.resourcesPath, "core");
  return path.join(__dirname, "..", "resources", "core");
}

function paths() {
  const local = app.getPath("localAppData");
  const dataDir = path.join(local, "VargaMesh");
  return { dataDir, configFile: path.join(dataDir, "vargamesh.conf") };
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1320,
    height: 840,
    minWidth: 1040,
    minHeight: 700,
    backgroundColor: "#071017",
    show: false,
    icon: path.join(__dirname, "..", "assets", "icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      devTools: !app.isPackaged
    }
  });
  const entry = path.join(__dirname, "renderer", "index.html");
  mainWindow.loadFile(entry);
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url !== mainWindow.webContents.getURL()) event.preventDefault();
  });
  mainWindow.once("ready-to-show", () => mainWindow.show());
}

async function withCore(fn) {
  try {
    if (!(await core.isRpcReady())) await core.start();
    return { ok: true, data: await fn() };
  } catch (e) { return cleanError(e); }
}

function registerIpc() {
  ipcMain.handle("app:info", async () => {
    const p = paths();
    return { ok: true, data: { version: app.getVersion(), platform: process.platform, dataDir: p.dataDir, configFile: p.configFile, coreDir: coreDir() } };
  });
  ipcMain.handle("app:settings", async () => ({ ok: true, data: settings.getPublic() }));
  ipcMain.handle("app:setLanguage", async (_e, { language } = {}) => {
    try { settings.setLanguage(language); return { ok: true, data: settings.getPublic() }; } catch (e) { return cleanError(e); }
  });
  ipcMain.handle("app:finishOnboarding", async () => { settings.setOnboardingDone(true); return { ok: true }; });
  ipcMain.handle("app:openDataDir", async () => { fs.mkdirSync(paths().dataDir, { recursive: true }); await shell.openPath(paths().dataDir); return { ok: true }; });
  ipcMain.handle("app:openConfig", async () => { core.ensureConfig(); await shell.openPath(paths().configFile); return { ok: true }; });
  ipcMain.handle("app:openWebsite", async (_e, { page } = {}) => {
    const allowed = { website: "https://vargacoin.com/", explorer: "https://vargacoin.com/explorer.html", github: "https://github.com/ati1993de/vargamesh-core" };
    if (!allowed[page]) return { ok: false, error: "Blocked URL" };
    await shell.openExternal(allowed[page]); return { ok: true };
  });
  ipcMain.handle("app:copyText", async (_e, { text } = {}) => { if (!validText(text, 4096)) return { ok: false, error: "Invalid text" }; clipboard.writeText(text); return { ok: true }; });

  ipcMain.handle("node:start", async () => { try { return { ok: true, data: await core.start() }; } catch (e) { return cleanError(e); } });
  ipcMain.handle("node:stop", async () => { try { return { ok: true, data: await core.stop() }; } catch (e) { return cleanError(e); } });
  ipcMain.handle("node:status", async () => {
    try { if (!(await core.isRpcReady())) return { ok: true, data: { running: false } }; return { ok: true, data: await core.nodeStatus() }; }
    catch (e) { return cleanError(e); }
  });

  ipcMain.handle("wallet:list", async () => withCore(async () => {
    const [loaded, dir] = await Promise.all([core.rpc.call("listwallets"), core.rpc.call("listwalletdir")]);
    return { loaded, available: dir.wallets || [], selected: settings.getPublic().selectedWallet };
  }));

  ipcMain.handle("wallet:select", async (_e, { name } = {}) => {
    if (!validWalletName(name)) return { ok: false, error: "Invalid wallet name" };
    settings.setSelectedWallet(name); return { ok: true, data: settings.getPublic() };
  });

  ipcMain.handle("wallet:load", async (_e, { name } = {}) => {
    if (!validWalletName(name)) return { ok: false, error: "Invalid wallet name" };
    return withCore(async () => { const result = await core.rpc.call("loadwallet", { filename: name }); settings.setSelectedWallet(name); return result; });
  });

  ipcMain.handle("wallet:unload", async (_e, { name } = {}) => {
    if (!validWalletName(name)) return { ok: false, error: "Invalid wallet name" };
    return withCore(async () => { const result = await core.rpc.call("unloadwallet", { wallet_name: name }); if (settings.getPublic().selectedWallet === name) settings.setSelectedWallet(""); return result; });
  });

  ipcMain.handle("wallet:create", async (_e, { name, passphrase } = {}) => {
    if (!validWalletName(name) || !validPass(passphrase || "")) return { ok: false, error: "Invalid wallet input" };
    return withCore(async () => {
      const params = { wallet_name: name, disable_private_keys: false, blank: false, load_on_startup: true };
      if (passphrase) params.passphrase = passphrase;
      const result = await core.rpc.call("createwallet", params, "", 120000);
      settings.setSelectedWallet(name);
      passphrase = null;
      return result;
    });
  });

  ipcMain.handle("wallet:info", async () => withCore(async () => {
    const wallet = selectedWallet();
    const [info, balances] = await Promise.all([
      core.rpc.call("getwalletinfo", [], wallet),
      core.rpc.call("getbalances", [], wallet)
    ]);
    return { wallet, info, balances };
  }));

  ipcMain.handle("wallet:newAddress", async (_e, { label } = {}) => {
    if (!validText(label || "", 64)) return { ok: false, error: "Invalid label" };
    return withCore(async () => core.rpc.call("getnewaddress", { label: label || "", address_type: "bech32" }, selectedWallet()));
  });

  ipcMain.handle("wallet:transactions", async () => withCore(async () => core.rpc.call("listtransactions", { label: "*", count: 50, skip: 0 }, selectedWallet())));

  ipcMain.handle("wallet:validateAddress", async (_e, { address } = {}) => {
    const a = typeof address === "string" ? address : "";
    if (!validText(a, 160) || a.length < 8) return { ok: false, error: "Invalid address" };
    return withCore(async () => core.rpc.call("validateaddress", { address: a }));
  });

  ipcMain.handle("wallet:estimateFee", async () => withCore(async () => core.rpc.call("estimatesmartfee", { conf_target: 6, estimate_mode: "conservative" })));

  ipcMain.handle("wallet:send", async (_e, { address, amount, passphrase } = {}) => {
    if (!validText(address || "", 160) || !validPass(passphrase || "")) return { ok: false, error: "Invalid send request" };
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0 || n > 52560000) return { ok: false, error: "Invalid amount" };
    return withCore(async () => {
      const wallet = selectedWallet();
      const valid = await core.rpc.call("validateaddress", { address });
      if (!valid || !valid.isvalid) throw new Error("The recipient address is not valid for this network");
      let unlocked = false;
      try {
        if (passphrase) {
          try { await core.rpc.call("walletpassphrase", { passphrase, timeout: 30 }, wallet); unlocked = true; }
          catch (e) { if (!(e instanceof RpcError) || e.code !== -15) throw e; }
        }
        return await core.rpc.call("sendtoaddress", { address, amount: n }, wallet, 120000);
      } finally {
        passphrase = null;
        if (unlocked) { try { await core.rpc.call("walletlock", [], wallet); } catch (_) {} }
      }
    });
  });

  ipcMain.handle("wallet:backup", async () => withCore(async () => {
    const wallet = selectedWallet();
    const result = await dialog.showSaveDialog(mainWindow, {
      title: "Backup VargaMesh wallet",
      defaultPath: `${wallet}-${new Date().toISOString().slice(0,10)}.dat`,
      filters: [{ name: "Wallet backup", extensions: ["dat"] }, { name: "All files", extensions: ["*"] }]
    });
    if (result.canceled || !result.filePath) return { canceled: true };
    await core.rpc.call("backupwallet", { destination: result.filePath }, wallet, 120000);
    return { canceled: false, file: result.filePath };
  }));

  ipcMain.handle("wallet:restore", async (_e, { name } = {}) => {
    if (!validWalletName(name)) return { ok: false, error: "Invalid wallet name" };
    return withCore(async () => {
      const pick = await dialog.showOpenDialog(mainWindow, { title: "Restore VargaMesh wallet backup", properties: ["openFile"], filters: [{ name: "Wallet backups", extensions: ["dat", "bak"] }, { name: "All files", extensions: ["*"] }] });
      if (pick.canceled || !pick.filePaths[0]) return { canceled: true };
      const result = await core.rpc.call("restorewallet", { wallet_name: name, backup_file: pick.filePaths[0], load_on_startup: true }, "", 600000);
      settings.setSelectedWallet(name);
      return { canceled: false, result };
    });
  });

  ipcMain.handle("wallet:migrate", async (_e, { name, passphrase } = {}) => {
    if (!validWalletName(name) || !validPass(passphrase || "")) return { ok: false, error: "Invalid migration request" };
    return withCore(async () => {
      const params = { wallet_name: name, load_wallet: true };
      if (passphrase) params.passphrase = passphrase;
      const result = await core.rpc.call("migratewallet", params, "", 900000);
      settings.setSelectedWallet(result.wallet_name || name);
      passphrase = null;
      return result;
    });
  });
}

app.whenReady().then(async () => {
  session.defaultSession.setPermissionRequestHandler((_wc, _permission, callback) => callback(false));
  session.defaultSession.setPermissionCheckHandler(() => false);
  const p = paths();
  settings = new SettingsStore(path.join(app.getPath("userData"), "settings.json"));
  if (!settings.getPublic().onboardingDone) {
    const langs = app.getPreferredSystemLanguages().map(x => x.toLowerCase());
    if (langs.some(x => x.startsWith("de"))) settings.setLanguage("de");
  }
  core = new CoreManager({ dataDir: p.dataDir, configFile: p.configFile, coreDir: coreDir() });
  core.ensureConfig();
  registerIpc();
  createWindow();
  try { await core.start(); } catch (_) {}
});

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("before-quit", event => {
  if (quitting || !core) return;
  if (!core.ownsProcess) return;
  event.preventDefault();
  quitting = true;
  core.stop().finally(() => app.quit());
});
