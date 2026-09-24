"use strict";

const fs = require("node:fs");
const path = require("node:path");

const DEFAULTS = Object.freeze({
  language: "de",
  theme: "system",
  activeWallet: "",
  autoLockSeconds: 90,
  confirmSend: true,
  hideBalances: false,
  txPageSize: 50
});

function clean(input = {}) {
  const out = { ...DEFAULTS };
  if (["de", "en"].includes(input.language)) out.language = input.language;
  if (["system", "light", "dark"].includes(input.theme)) out.theme = input.theme;
  if (typeof input.activeWallet === "string" && input.activeWallet.length <= 128) out.activeWallet = input.activeWallet;
  if (Number.isInteger(input.autoLockSeconds) && input.autoLockSeconds >= 15 && input.autoLockSeconds <= 3600) out.autoLockSeconds = input.autoLockSeconds;
  if (typeof input.confirmSend === "boolean") out.confirmSend = input.confirmSend;
  if (typeof input.hideBalances === "boolean") out.hideBalances = input.hideBalances;
  if (Number.isInteger(input.txPageSize) && input.txPageSize >= 10 && input.txPageSize <= 200) out.txPageSize = input.txPageSize;
  return out;
}

class SettingsStore {
  constructor(file) {
    this.file = file;
    this.value = { ...DEFAULTS };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.file)) this.value = clean(JSON.parse(fs.readFileSync(this.file, "utf8")));
    } catch (_) {
      this.value = { ...DEFAULTS };
    }
    return this.value;
  }

  get() { return { ...this.value }; }

  update(patch) {
    this.value = clean({ ...this.value, ...(patch || {}) });
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    const tmp = `${this.file}.tmp`;
    fs.writeFileSync(tmp, `${JSON.stringify(this.value, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
    fs.renameSync(tmp, this.file);
    return this.get();
  }
}

module.exports = { SettingsStore, DEFAULTS };
