"use strict";

const assert = require("node:assert/strict");
const {
  DEFAULT_FALLBACK_FEE_RATE,
  MAX_AUTOMATIC_FALLBACK_FEE_RATE,
  hasUsableEstimate,
  fallbackRateFromNode,
  resolveFeePolicy
} = require("../src/fee-policy");

function rpcWith(map) {
  return {
    async call(method) {
      const value = map[method];
      if (value instanceof Error) throw value;
      if (typeof value === "function") return value();
      return value;
    }
  };
}

(async () => {
  assert.equal(hasUsableEstimate({ feerate: 0.00002 }), true);
  assert.equal(hasUsableEstimate({ errors: ["Insufficient data"] }), false);
  assert.equal(fallbackRateFromNode({}, {}), DEFAULT_FALLBACK_FEE_RATE);
  assert.equal(
    fallbackRateFromNode({ relayfee: 0.00002 }, { mempoolminfee: 0.00003 }),
    0.00003
  );
  assert.throws(
    () => fallbackRateFromNode({ relayfee: MAX_AUTOMATIC_FALLBACK_FEE_RATE * 2 }, {}),
    /unusually high/
  );

  const estimated = await resolveFeePolicy(rpcWith({
    estimatesmartfee: { feerate: 0.00002, blocks: 6 }
  }), 6);
  assert.equal(estimated.fallback, false);
  assert.equal(estimated.feerate, 0.00002);

  const sparse = await resolveFeePolicy(rpcWith({
    estimatesmartfee: { errors: ["Insufficient data or no feerate found"], blocks: 6 },
    getnetworkinfo: { relayfee: 0.00001, incrementalfee: 0.00001 },
    getmempoolinfo: { mempoolminfee: 0.00001, minrelaytxfee: 0.00001 }
  }), 6);
  assert.equal(sparse.fallback, true);
  assert.equal(sparse.feerate, 0.00001);
  assert.match(sparse.errors[0], /Insufficient data/);

  const rpcError = await resolveFeePolicy(rpcWith({
    estimatesmartfee: new Error("estimator unavailable"),
    getnetworkinfo: { relayfee: 0.00002 },
    getmempoolinfo: {}
  }), 12);
  assert.equal(rpcError.fallback, true);
  assert.equal(rpcError.feerate, 0.00002);
  assert.match(rpcError.errors[0], /estimator unavailable/);

  console.log("VargaMesh fee policy tests: PASS");
})().catch(err => {
  console.error(err);
  process.exit(1);
});
