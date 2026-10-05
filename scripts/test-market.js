"use strict";

const assert = require("node:assert/strict");
const {
  NESTEX_TICKER_URLS,
  selectTicker,
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

assert.deepEqual(NESTEX_TICKER_URLS, [
  "https://api.nestex.one/cg/tickers/VMESH_USDT",
  "https://trade.nestex.one/api/cg/tickers/VMESH_USDT"
]);
assert.equal(selectTicker([sample]), sample);
assert.equal(selectTicker({ data: sample }), sample);

const normalized = normalizeTicker(sample, Date.UTC(2026, 9, 5, 12, 0, 0), "api.nestex.one");
assert.equal(normalized.available, true);
assert.equal(normalized.source, "NestEx");
assert.equal(normalized.pair, "VMESH/USDT");
assert.equal(normalized.price, 0.00125);
assert.equal(normalized.bid, 0.0012);
assert.equal(normalized.ask, 0.0013);
assert.equal(normalized.endpoint, "api.nestex.one");
assert.equal(normalized.fetchedAt, "2026-10-05T12:00:00.000Z");
assert.throws(() => normalizeTicker({ ...sample, ticker_id: "BTC_USDT" }), /identity/);
assert.throws(() => normalizeTicker({ ...sample, last_price: 0 }), /numeric/);

(async () => {
  resetMarketCacheForTests();
  let calls = 0;
  const primarySuccess = async (url) => {
    calls += 1;
    assert.equal(url, NESTEX_TICKER_URLS[0]);
    return {
      ok: true,
      status: 200,
      url,
      text: async () => JSON.stringify(sample)
    };
  };

  const first = await getNestExQuote({
    fetchImpl: primarySuccess,
    abortControllerImpl: TestAbortController,
    now: 10_000
  });
  assert.equal(first.available, true);
  assert.equal(first.cached, false);
  assert.equal(first.endpoint, "api.nestex.one");
  assert.equal(calls, 1);

  const cached = await getNestExQuote({
    fetchImpl: primarySuccess,
    abortControllerImpl: TestAbortController,
    now: 20_000
  });
  assert.equal(cached.available, true);
  assert.equal(cached.cached, true);
  assert.equal(calls, 1);

  resetMarketCacheForTests();
  const requested = [];
  const fallbackFetch = async (url) => {
    requested.push(url);
    if (url === NESTEX_TICKER_URLS[0]) {
      return { ok: false, status: 503, url, text: async () => "" };
    }
    return {
      ok: true,
      status: 200,
      url,
      text: async () => JSON.stringify({ data: [sample] })
    };
  };
  const fallback = await getNestExQuote({
    fetchImpl: fallbackFetch,
    abortControllerImpl: TestAbortController,
    now: 100_000
  });
  assert.equal(fallback.available, true);
  assert.equal(fallback.endpoint, "trade.nestex.one");
  assert.deepEqual(requested, NESTEX_TICKER_URLS);

  const stale = await getNestExQuote({
    fetchImpl: async () => { throw new Error("offline"); },
    abortControllerImpl: TestAbortController,
    now: 170_000
  });
  assert.equal(stale.available, true);
  assert.equal(stale.stale, true);
  assert.equal(stale.price, sample.last_price);

  resetMarketCacheForTests();
  let failures = 0;
  const failingFetch = async () => { failures += 1; throw new Error("offline"); };
  const unavailable = await getNestExQuote({
    fetchImpl: failingFetch,
    abortControllerImpl: TestAbortController,
    now: 300_000
  });
  const throttledFailure = await getNestExQuote({
    fetchImpl: failingFetch,
    abortControllerImpl: TestAbortController,
    now: 310_000
  });
  assert.equal(unavailable.available, false);
  assert.equal(unavailable.source, "NestEx");
  assert.equal(throttledFailure.available, false);
  assert.equal(throttledFailure.cached, true);
  assert.equal(failures, 2);

  console.log("NestEx market-data regression tests: PASS");
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
