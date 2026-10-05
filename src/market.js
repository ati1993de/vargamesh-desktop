"use strict";

const NESTEX_TICKER_URL = "https://trade.nestex.one/api/cg/tickers/VMESH_USDT";
const CACHE_MS = 60_000;
const STALE_MS = 15 * 60_000;
const TIMEOUT_MS = 8_000;
const MAX_BODY_BYTES = 64 * 1024;

let cachedQuote = null;
let cachedAt = 0;
let inFlight = null;

function numberField(value, { required = false, positive = false } = {}) {
  if (value == null || value === "") {
    if (required) throw new Error("Missing numeric market field.");
    return null;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || (positive ? parsed <= 0 : parsed < 0)) {
    if (required) throw new Error("Invalid numeric market field.");
    return null;
  }
  return parsed;
}

function normalizeTicker(payload, now = Date.now()) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Unexpected NestEx ticker response.");
  }
  if (payload.ticker_id !== "VMESH_USDT" || payload.base_currency !== "VMESH" || payload.target_currency !== "USDT") {
    throw new Error("Unexpected NestEx ticker identity.");
  }

  return {
    available: true,
    source: "NestEx",
    pair: "VMESH/USDT",
    price: numberField(payload.last_price, { required: true, positive: true }),
    bid: numberField(payload.bid),
    ask: numberField(payload.ask),
    high24h: numberField(payload.high),
    low24h: numberField(payload.low),
    baseVolume24h: numberField(payload.base_volume),
    quoteVolume24h: numberField(payload.target_volume),
    fetchedAt: new Date(now).toISOString(),
    stale: false
  };
}

async function fetchTicker(fetchImpl = globalThis.fetch, now = Date.now(), AbortControllerImpl = globalThis.AbortController) {
  if (typeof fetchImpl !== "function") throw new Error("Fetch API is unavailable.");
  if (typeof AbortControllerImpl !== "function") throw new Error("AbortController is unavailable.");

  const controller = new AbortControllerImpl();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetchImpl(NESTEX_TICKER_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
      redirect: "error",
      signal: controller.signal
    });

    if (!response || response.ok !== true) {
      throw new Error(`NestEx ticker HTTP ${response?.status || "error"}.`);
    }

    const body = await response.text();
    if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
      throw new Error("NestEx ticker response too large.");
    }

    return normalizeTicker(JSON.parse(body), now);
  } finally {
    clearTimeout(timer);
  }
}

function unavailable(now) {
  return {
    available: false,
    source: "NestEx",
    pair: "VMESH/USDT",
    fetchedAt: new Date(now).toISOString(),
    stale: false
  };
}

async function getNestExQuote({ force = false, fetchImpl = globalThis.fetch, now = Date.now(), abortControllerImpl = globalThis.AbortController } = {}) {
  if (!force && cachedQuote && now - cachedAt < CACHE_MS) {
    return { ...cachedQuote, cached: true };
  }
  if (!force && inFlight) return inFlight;

  const request = (async () => {
    try {
      const quote = await fetchTicker(fetchImpl, now, abortControllerImpl);
      cachedQuote = quote;
      cachedAt = now;
      return { ...quote, cached: false };
    } catch (_) {
      if (cachedQuote && now - cachedAt <= STALE_MS) {
        return {
          ...cachedQuote,
          stale: true,
          cached: true,
          cacheAgeSeconds: Math.max(0, Math.floor((now - cachedAt) / 1000))
        };
      }
      return unavailable(now);
    }
  })();

  if (!force) inFlight = request;
  try {
    return await request;
  } finally {
    if (inFlight === request) inFlight = null;
  }
}

function resetMarketCacheForTests() {
  cachedQuote = null;
  cachedAt = 0;
  inFlight = null;
}

module.exports = {
  NESTEX_TICKER_URL,
  CACHE_MS,
  STALE_MS,
  normalizeTicker,
  getNestExQuote,
  resetMarketCacheForTests
};
