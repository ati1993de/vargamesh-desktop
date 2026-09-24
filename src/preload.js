"use strict";

const { contextBridge, ipcRenderer } = require("electron");

const call = (channel, payload = {}) => ipcRenderer.invoke(channel, payload);

contextBridge.exposeInMainWorld("vmesh", Object.freeze({
  appInfo: () => call("app:info"),
  getSettings: () => call("settings:get"),
  updateSettings: patch => call("settings:update", patch),
  startCore: () => call("core:start"),
  stopCore: () => call("core:stop"),
  coreStatus: () => call("core:status"),
  mempool: () => call("core:mempool"),
  mining: () => call("core:mining"),
  peers: () => call("core:peers"),
  listWallets: () => call("wallet:list"),
  createWallet: data => call("wallet:create", data),
  loadWallet: name => call("wallet:load", { name }),
  unloadWallet: name => call("wallet:unload", { name }),
  walletSummary: wallet => call("wallet:summary", { wallet }),
  transactions: (wallet, count = 50, skip = 0) => call("wallet:transactions", { wallet, count, skip }),
  unspent: wallet => call("wallet:unspent", { wallet }),
  newAddress: (wallet, label = "") => call("wallet:newaddress", { wallet, label }),
  validateAddress: address => call("wallet:validate", { address }),
  estimateFee: (target = 6) => call("wallet:fee", { target }),
  unlockWallet: (wallet, passphrase, seconds) => call("wallet:unlock", { wallet, passphrase, seconds }),
  lockWallet: wallet => call("wallet:lock", { wallet }),
  send: data => call("wallet:send", data),
  backupWallet: wallet => call("wallet:backup", { wallet }),
  restoreWallet: (wallet) => call("wallet:restore", { wallet }),
  migrateWallet: (wallet, passphrase = "") => call("wallet:migrate", { wallet, passphrase }),
  previewPrivateKey: data => call("wallet:previewPrivateKey", data),
  importPrivateKey: data => call("wallet:importPrivateKey", data),
  importWatchAddress: data => call("wallet:importWatchAddress", data),
  lockAllWallets: () => call("wallet:lockAll"),
  rescanWallet: wallet => call("wallet:rescan", { wallet }),
  abandonTransaction: (wallet, txid) => call("wallet:abandon", { wallet, txid }),
  copy: text => call("clipboard:write", { text }),
  openExternal: url => call("external:open", { url }),
  showDataDir: () => call("system:showDataDir"),
  showDebugLog: () => call("system:showDebugLog")
}));
