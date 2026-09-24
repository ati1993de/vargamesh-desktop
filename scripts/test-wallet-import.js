"use strict";
const assert = require("node:assert/strict");
const { requireWif, requireAddressType, privateDescriptorForWif, addDescriptorChecksum } = require("../src/wallet-import");

const fakeWif = "V".repeat(52);
assert.equal(requireWif(fakeWif), fakeWif);
assert.equal(requireAddressType("bech32"), "bech32");
assert.equal(privateDescriptorForWif(fakeWif, "bech32"), `wpkh(${fakeWif})`);
assert.equal(privateDescriptorForWif(fakeWif, "legacy"), `pkh(${fakeWif})`);
assert.equal(privateDescriptorForWif(fakeWif, "p2sh-segwit"), `sh(wpkh(${fakeWif}))`);
assert.equal(addDescriptorChecksum("addr(vm1example)", "abcd1234"), "addr(vm1example)#abcd1234");
assert.throws(() => requireWif("not-a-key"));
assert.throws(() => requireAddressType("taproot"));
console.log("Wallet import helper tests: PASS");
