"use strict";
class WalletNotifier {
  constructor({ rpc, getSettings, notify }) {
    this.rpc = rpc;
    this.getSettings = getSettings;
    this.notify = notify;
    this.previous = new Map();
    this.synced = null;
    this.active = false;
    this.timer = null;
  }
  start() {
    if (this.timer) return;
    this.timer = setInterval(() => { void this.tick(); }, 20000);
    this.timer.unref?.();
    void this.tick();
  }
  stop() { if (this.timer) clearInterval(this.timer); this.timer = null; }
  async tick() {
    if (this.active) return;
    this.active = true;
    try {
      const config = this.getSettings();
      if (!config.notificationsEnabled) return;
      const wallets = await this.rpc.call("listwallets", [], "", 10000);
      const loaded = new Set(wallets);
      for (const name of this.previous.keys()) if (!loaded.has(name)) this.previous.delete(name);
      for (const name of wallets) {
        let txs;
        try { txs = await this.rpc.call("listtransactions", ["*", 100, 0, true], name, 10000); }
        catch (_) { continue; }
        if (!Array.isArray(txs)) continue;
        const current = new Map();
        for (const tx of txs) {
          if (!["receive", "generate", "immature"].includes(tx.category)) continue;
          if (!tx.txid || !Number.isFinite(Number(tx.amount))) continue;
          const key = [tx.txid, tx.vout ?? "", tx.category, tx.address || ""].join("|");
          current.set(key, { confirmations: Number(tx.confirmations) || 0, amount: Number(tx.amount), category: tx.category });
        }
        const previous = this.previous.get(name);
        if (previous) {
          for (const [key, item] of current) {
            const old = previous.get(key);
            if (!old && item.category === "receive" && config.notifyReceived) {
              this.emit("received", item.amount, config);
            } else if (old && old.confirmations <= 0 && item.confirmations > 0 && item.category === "receive" && config.notifyConfirmed) {
              this.emit("confirmed", item.amount, config);
            }
          }
        }
        this.previous.set(name, current);
      }
      if (config.notifySync) {
        try {
          const chain = await this.rpc.call("getblockchaininfo", [], "", 10000);
          const isSynced = !chain.initialblockdownload && Number(chain.verificationprogress) >= 0.99999 && chain.blocks >= chain.headers;
          if (this.synced === false && isSynced) this.notify("VargaMesh", "Blockchain synchronization completed.");
          this.synced = isSynced;
        } catch (_) {}
      }
    } catch (_) {
      // Temporarily unavailable Core is not a reason to alert or erase the baseline.
    } finally {
      this.active = false;
    }
  }
  emit(kind, amount, config) {
    const suffix = config.notificationShowAmounts && Number.isFinite(amount) ? " (" + amount.toFixed(8) + " VMESH)" : "";
    try { this.notify("VargaMesh", (kind === "received" ? "Incoming VMESH transaction" : "VMESH transaction confirmed") + suffix); }
    catch (_) {}
  }
}
module.exports = { WalletNotifier };
