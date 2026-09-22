"use strict";
const fs = require("node:fs");
const path = require("node:path");

class SettingsStore {
  constructor(file) {
    this.file = file;
    this.state = { language: "en", selectedWallet: "", onboardingDone: false };
    this.load();
  }

  load() {
    try {
      const raw = JSON.parse(fs.readFileSync(this.file, "utf8"));
      if (raw && typeof raw === "object") {
        if (["de", "en"].includes(raw.language)) this.state.language = raw.language;
        if (typeof raw.selectedWallet === "string") this.state.selectedWallet = raw.selectedWallet.slice(0, 128);
        if (typeof raw.onboardingDone === "boolean") this.state.onboardingDone = raw.onboardingDone;
      }
    } catch (_) {}
  }

  save() {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    const tmp = `${this.file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(this.state, null, 2), { encoding: "utf8", mode: 0o600 });
    fs.renameSync(tmp, this.file);
  }

  getPublic() { return { ...this.state }; }
  setLanguage(language) { if (!["de", "en"].includes(language)) throw new Error("Invalid language"); this.state.language = language; this.save(); }
  setSelectedWallet(name) { this.state.selectedWallet = String(name || "").slice(0, 128); this.save(); }
  setOnboardingDone(v) { this.state.onboardingDone = Boolean(v); this.save(); }
}

module.exports = { SettingsStore };
