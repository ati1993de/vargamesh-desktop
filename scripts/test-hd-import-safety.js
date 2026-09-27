"use strict";

const assert = require("assert");
const fs = require("fs");
const {
  deriveWalletDescriptors
} = require("../src/hd-wallet");

const main = fs.readFileSync(
  require.resolve("../src/main.js"),
  "utf8"
);

/*
 * getdescriptorinfo().descriptor is public-only.
 * It must never become the descriptor imported into the wallet.
 */
assert.ok(
  !/descriptors\s*\[\s*key\s*\]\s*=\s*info\.descriptor\s*;/.test(main),
  "HD import must not use getdescriptorinfo().descriptor"
);

assert.match(
  main,
  /descriptors\s*\[\s*key\s*\]\s*=\s*addDescriptorChecksum\(\w+,\s*info\.checksum\)/,
  "HD import must preserve the original private descriptor and add Core checksum"
);

const TEST =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

const bundle = deriveWalletDescriptors(TEST);

for (const [name, descriptor] of Object.entries(bundle.descriptors)) {
  assert.ok(
    descriptor.includes("VMPR"),
    `${name} must contain a VargaMesh private extended key`
  );

  assert.ok(
    !descriptor.includes("VMPUL"),
    `${name} unexpectedly contains only a public extended key`
  );
}

console.log("VargaMesh HD import safety tests: PASS");
