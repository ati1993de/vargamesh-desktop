"use strict";

const assert = require("node:assert/strict");
const {
  NESTEX_TICKER_URL,
  normalizeTicker,
  getNestExQuote,
  resetMarketCacheForTests
} = require("../src/market");

class TestAbortController {
  constructor() { this.signal = {}; }
  abort() {}
}

const sample = {
  ticker_id: "VMESH_USDT",
  base_currency: "VMESH",
  target_currency: "USDT",
  last_price: 0.00125,
  base_volume: 12345.5,
  target_volume: 15.431875,
  bid: 0.0012,
  ask: 0.0013,
  high: 0.0014,
  low: 0.0011
};

assert.equal(NESTEX_TICKER_URL, "https://trade.nestex.one/api/cg/tickers/VMESH_USDT");
const normalized = normalizeTicker(sample, Date.UTC(2026, 9, 5, 12, 0, 0));
assert.equal(normalized.available, true);
assert.equal(normalized.source, "NestEx");
assert.equal(normalized.pair, "VMESH/USDT");
assert.equal(normalized.price, 0.00125);
assert.equal(normalized.bid, 0.0012);
assert.equal(normalized.ask, 0.0013);
assert.equal(normalized.fetchedAt, "2026-10-05T12:00:00.000Z");
assert.throws(() => normalizeTicker({ ...sample, ticker_id: "BTC_USDT" }), /identity/);
assert.throws(() => normalizeTicker({ ...sample, last_price: 0 }), /numeric/);

(async () => {
  resetMarketCacheForTests();
  let calls = 0;
  const goodFetch = async () => {
    calls += 1;
    return { ok: true, status: 200, text: async () => JSON.stringify(sample) };
  };

  const first = await getNestExQuote({ fetchImpl: goodFetch, abortControllerImpl: TestAbortController, now: 10_000 });
  assert.equal(first.available, true);
  assert.equal(first.cached, false);
  assert.equal(calls, 1);

  const cached = await getNestExQuote({ fetchImpl: goodFetch, abortControllerImpl: TestAbortController, now: 20_000 });
  assert.equal(cached.available, true);
  assert.equal(cached.cached, true);
  assert.equal(calls, 1);

  const stale = await getNestExQuote({
    force: true,
    fetchImpl: async () => { throw new Error("offline"); },
    abortControllerImpl: TestAbortController,
    now: 30_000
  });
  assert.equal(stale.available, true);
  assert.equal(stale.stale, true);
  assert.equal(stale.price, sample.last_price);

  resetMarketCacheForTests();
  const unavailable = await getNestExQuote({
    fetchImpl: async () => { throw new Error("offline"); },
    abortControllerImpl: TestAbortController,
    now: 40_000
  });
  assert.equal(unavailable.available, false);
  assert.equal(unavailable.source, "NestEx");

  console.log("NestEx market-data regression tests: PASS");
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
