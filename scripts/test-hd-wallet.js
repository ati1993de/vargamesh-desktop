"use strict";

const assert = require("assert");
const {
  COIN_TYPE,
  PATHS,
  VMESH_BIP32_NETWORK,
  createMnemonic,
  requireMnemonic,
  deriveWalletDescriptors
} = require("../src/hd-wallet");

const TEST_MNEMONIC =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

assert.strictEqual(COIN_TYPE, 22093);

assert.strictEqual(VMESH_BIP32_NETWORK.bip32.public, 0x024D771C);
assert.strictEqual(VMESH_BIP32_NETWORK.bip32.private, 0x024D7707);

assert.strictEqual(PATHS.bip44Account, "m/44'/22093'/0'");
assert.strictEqual(PATHS.bip84Account, "m/84'/22093'/0'");
assert.strictEqual(requireMnemonic(TEST_MNEMONIC), TEST_MNEMONIC);

const a = deriveWalletDescriptors(TEST_MNEMONIC);
const b = deriveWalletDescriptors(TEST_MNEMONIC);

assert.deepStrictEqual(a, b);
assert.match(a.fingerprint, /^[0-9a-f]{8}$/);

assert.ok(a.descriptors.legacyExternal.startsWith("pkh(["));
assert.ok(a.descriptors.legacyExternal.includes("/44h/22093h/0h]"));
assert.ok(a.descriptors.legacyExternal.endsWith("/0/*)"));
assert.ok(a.descriptors.legacyInternal.endsWith("/1/*)"));

assert.ok(a.descriptors.segwitExternal.startsWith("wpkh(["));
assert.ok(a.descriptors.segwitExternal.includes("/84h/22093h/0h]"));
assert.ok(a.descriptors.segwitExternal.endsWith("/0/*)"));
assert.ok(a.descriptors.segwitInternal.endsWith("/1/*)"));

// Regression: VMESH must never serialize HD private keys with
// Bitcoin's xprv version bytes.
assert.ok(!a.descriptors.legacyExternal.includes("xprv"));
assert.ok(!a.descriptors.segwitExternal.includes("xprv"));

const m12 = createMnemonic(12);
const m24 = createMnemonic(24);

assert.strictEqual(m12.split(" ").length, 12);
assert.strictEqual(m24.split(" ").length, 24);
requireMnemonic(m12);
requireMnemonic(m24);

console.log("VargaMesh HD wallet tests: PASS");
console.log("SLIP-0044 candidate:", COIN_TYPE);
console.log("BIP44 receive:", PATHS.bip44Receive);
console.log("BIP84 receive:", PATHS.bip84Receive);
