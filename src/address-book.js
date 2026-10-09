"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

function normalizeTarget(value) {
  if (typeof value !== "string") throw new Error("Recipient is required.");
  const target = value.trim();
  if (/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.vmesh$/i.test(target)) return target.toLowerCase();
  if (target.length >= 14 && target.length <= 128 && /^[A-Za-z0-9]+$/.test(target)) return target;
  throw new Error("Enter a VMESH address or a valid name.vmesh.");
}
function cleanLabel(value) {
  if (typeof value !== "string") throw new Error("Contact name is required.");
  const label = value.trim();
  if (!label || label.length > 80 || /[\u0000-\u001f\u007f]/.test(label)) throw new Error("Contact name must be 1–80 characters.");
  return label;
}
class AddressBook {
  constructor(filename) {
    this.filename = filename;
    this.contacts = [];
    try {
      const saved = JSON.parse(fs.readFileSync(filename, "utf8"));
      if (!Array.isArray(saved) || saved.length > 1000) throw new Error("Invalid address book format.");
      for (const entry of saved) {
        if (!entry || typeof entry !== "object") throw new Error("Corrupt address book entry.");
        const id = typeof entry.id === "string" && /^[0-9a-f-]{36}$/.test(entry.id) ? entry.id : randomUUID();
        this.contacts.push({ id, label: cleanLabel(entry.label), target: normalizeTarget(entry.target) });
      }
    } catch (err) {
      if (err.code !== "ENOENT") throw new Error("Cannot read address book. Existing data was not overwritten.");
    }
  }
  list() { return this.contacts.map(c => ({ ...c })).sort((a, b) => a.label.localeCompare(b.label)); }
  save(entry) {
    const label = cleanLabel(entry?.label);
    const target = normalizeTarget(entry?.target);
    const id = typeof entry?.id === "string" ? entry.id : "";
    const existing = id ? this.contacts.find(c => c.id === id) : null;
    if (id && !existing) throw new Error("Contact not found.");
    if (this.contacts.length >= 1000 && !existing) throw new Error("Address book is full.");
    const updated = { id: existing?.id || randomUUID(), label, target };
    const next = existing ? this.contacts.map(c => c.id === id ? updated : c) : [...this.contacts, updated];
    this.persist(next);
    return updated;
  }
  remove(id) {
    if (!this.contacts.some(c => c.id === id)) throw new Error("Contact not found.");
    this.persist(this.contacts.filter(c => c.id !== id));
    return { removed: true };
  }
  persist(next) {
    fs.mkdirSync(path.dirname(this.filename), { recursive: true });
    const tmp = this.filename + "." + process.pid + ".tmp";
    try {
      fs.writeFileSync(tmp, JSON.stringify(next, null, 2) + "\n", { mode: 0o600, flag: "wx" });
      fs.renameSync(tmp, this.filename);
      this.contacts = next;
    } finally {
      try { fs.unlinkSync(tmp); } catch (_) {}
    }
  }
}
module.exports = { AddressBook, normalizeTarget, cleanLabel };
