"use strict";
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const manifest = require("../resources/core-release.json");

// Verify the pinned official Core archive BEFORE unpacking.
function verifyCoreArchive(file) {
  if (!file) throw new Error("Usage: node scripts/verify-core-archive.js <archive>");
  const name = path.basename(file);
  const expected = Object.hasOwn(manifest.assets, name) ? manifest.assets[name] : null;
  if (!expected) throw new Error("Unrecognized Core archive: " + name);
  const digest = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  if (digest !== expected) throw new Error("Core release SHA-256 mismatch for " + name);
  console.log("PASS " + manifest.coreTag + " " + name + " SHA256=" + digest);
  return digest;
}
if (require.main === module) {
  try { verifyCoreArchive(process.argv[2]); }
  catch (e) { console.error(e.message); process.exitCode = 1; }
}
module.exports = { verifyCoreArchive };
