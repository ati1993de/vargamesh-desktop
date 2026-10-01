"use strict";

const assert = require("node:assert/strict");
const {
  decimalToAtomic,
  displayAtomic,
  buildCreatePayload,
  buildTokenPayload,
  strictOperation
} = require("../src/vmt");

const TOKEN = "be95b3080519d9be5c400ef13ddc303e32ffde6b0234becb106f56aef16ee451";
const ISSUER = "vm1qsakm3ew9gur0agt475mj7evgzrqd7tlrs0jfg6";
const RECIPIENT = "vm1qsfsgj70pdv86nguvexzvsflmcknz4lrsj87wx9";
const RECIPIENT_PROGRAM = "82608979e16b0fa9a38cc984c827fbc5a62afc70";

const create = buildCreatePayload({
  name: "YALCUS",
  symbol: "YALC",
  decimals: 8,
  initialAtomic: 100000000000000000n,
  maxAtomic: 100000000000000000n,
  mintable: false
});
assert.equal(
  create.toString("hex"),
  "564d5401010008016345785d8a0000016345785d8a00000659414c4355530459414c43"
);

const transfer = buildTokenPayload("TRANSFER", TOKEN, 50000000000n, RECIPIENT_PROGRAM);
assert.equal(
  transfer.toString("hex"),
  "564d540103be95b3080519d9be5c400ef13ddc303e32ffde6b0234becb106f56aef16ee4510000000ba43b740082608979e16b0fa9a38cc984c827fbc5a62afc70"
);

assert.equal(decimalToAtomic("500.00000000", 8), 50000000000n);
assert.equal(decimalToAtomic("1", 0), 1n);
assert.equal(displayAtomic(50000000000n, 8), "500.00000000");
assert.throws(() => decimalToAtomic("1.000000001", 8), /Maximum 8/);
assert.throws(() => buildTokenPayload("TRANSFER", TOKEN, 1n, "00"), /native P2WPKH/);

assert.equal(strictOperation({
  ready: true,
  authorizer: ISSUER,
  operation: {
    operation: "TRANSFER",
    token_id: TOKEN,
    amount_atomic: "50000000000",
    recipient: RECIPIENT
  },
  ledger: { valid: true },
  base_chain: { mempool_allowed: true },
  create_fee: { required: false, valid: true }
}, {
  operation: "TRANSFER",
  authorizer: ISSUER,
  tokenId: TOKEN,
  amountAtomic: "50000000000",
  recipient: RECIPIENT
}), true);

assert.equal(strictOperation({
  ready: true,
  authorizer: ISSUER,
  operation: {
    operation: "CREATE",
    token_id: "11".repeat(32),
    name: "YALCUS",
    symbol: "YALC",
    decimals: 8,
    mintable: false,
    initial_atomic: "100000000000000000",
    maximum_atomic: "100000000000000000"
  },
  ledger: { valid: true },
  base_chain: { mempool_allowed: true },
  create_fee: { required: true, valid: true }
}, {
  operation: "CREATE",
  authorizer: ISSUER,
  name: "YALCUS",
  symbol: "YALC",
  decimals: 8,
  mintable: false,
  initialAtomic: "100000000000000000",
  maxAtomic: "100000000000000000"
}), true);

assert.throws(() => strictOperation({
  ready: true,
  authorizer: ISSUER,
  operation: {
    operation: "TRANSFER",
    token_id: TOKEN,
    amount_atomic: "49900000000",
    recipient: RECIPIENT
  },
  ledger: { valid: true },
  base_chain: { mempool_allowed: true }
}, {
  operation: "TRANSFER",
  authorizer: ISSUER,
  tokenId: TOKEN,
  amountAtomic: "50000000000",
  recipient: RECIPIENT
}), /amount mismatch/);

console.log("VargaMesh VMT-1 Desktop protocol tests: PASS");
