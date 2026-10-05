"use strict";

const NESTEX_TICKER_URLS = Object.freeze([
  "https://api.nestex.one/cg/tickers/VMESH_USDT",
  "https://trade.nestex.one/api/cg/tickers/VMESH_USDT"
]);
const CACHE_MS = 60_000;
const STALE_MS = 15 * 60_000;
const TIMEOUT_MS = 8_000;
const MAX_BODY_BYTES = 64 * 1024;
const ALLOWED_HOSTS = new Set(["api.nestex.one", "trade.nestex.one"]);

let cachedQuote = null;
let cachedAt = 0;
let lastAttemptAt = 0;
let lastResult = null;
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

function selectTicker(payload) {
  if (Array.isArray(payload)) {
    const match = payload.find(item => item?.ticker_id === "VMESH_USDT");
    if (!match) throw new Error("VMESH_USDT ticker missing.");
    return match;
  }
  if (payload?.data && (Array.isArray(payload.data) || typeof payload.data === "object")) {
    return selectTicker(payload.data);
  }
  if (!payload || typeof payload !== "object") {
    throw new Error("Unexpected NestEx ticker response.");
  }
  return payload;
}

function normalizeTicker(payload, now = Date.now(), endpoint = "") {
  const ticker = selectTicker(payload);
  if (ticker.ticker_id !== "VMESH_USDT" || ticker.base_currency !== "VMESH" || ticker.target_currency !== "USDT") {
    throw new Error("Unexpected NestEx ticker identity.");
  }

  return {
    available: true,
    source: "NestEx",
    pair: "VMESH/USDT",
    price: numberField(ticker.last_price, { required: true, positive: true }),
    bid: numberField(ticker.bid),
    ask: numberField(ticker.ask),
    high24h: numberField(ticker.high),
    low24h: numberField(ticker.low),
    baseVolume24h: numberField(ticker.base_volume),
    quoteVolume24h: numberField(ticker.target_volume),
    fetchedAt: new Date(now).toISOString(),
    endpoint,
    stale: false
  };
}

function validateResponseUrl(response, requestedUrl) {
  const finalUrl = response?.url || requestedUrl;
  const parsed = new URL(finalUrl);
  if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.has(parsed.hostname)) {
    throw new Error("Unexpected NestEx redirect target.");
  }
}

async function fetchOneTicker(url, fetchImpl, now, AbortControllerImpl) {
  const controller = new AbortControllerImpl();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetchImpl(url, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      redirect: "follow",
      signal: controller.signal
    });

    if (!response || response.ok !== true) {
      throw new Error(`NestEx ticker HTTP ${response?.status || "error"}.`);
    }

    validateResponseUrl(response, url);

    const body = await response.text();
    if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
      throw new Error("NestEx ticker response too large.");
    }

    return normalizeTicker(JSON.parse(body), now, new URL(url).hostname);
  } finally {
    clearTimeout(timer);
  }
}

async function fetchTicker(fetchImpl = globalThis.fetch, now = Date.now(), AbortControllerImpl = globalThis.AbortController) {
  if (typeof fetchImpl !== "function") throw new Error("Fetch API is unavailable.");
  if (typeof AbortControllerImpl !== "function") throw new Error("AbortController is unavailable.");

  let lastError = null;
  for (const url of NESTEX_TICKER_URLS) {
    try {
      return await fetchOneTicker(url, fetchImpl, now, AbortControllerImpl);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("NestEx ticker unavailable.");
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

async function getNestExQuote({ fetchImpl = globalThis.fetch, now = Date.now(), abortControllerImpl = globalThis.AbortController } = {}) {
  if (lastResult && now - lastAttemptAt < CACHE_MS) {
    return { ...lastResult, cached: true };
  }
  if (inFlight) return inFlight;

  lastAttemptAt = now;

  const request = (async () => {
    let result;
    try {
      const quote = await fetchTicker(fetchImpl, now, abortControllerImpl);
      cachedQuote = quote;
      cachedAt = now;
      result = { ...quote, cached: false };
    } catch (_) {
      if (cachedQuote && now - cachedAt <= STALE_MS) {
        result = {
          ...cachedQuote,
          stale: true,
          cached: true,
          cacheAgeSeconds: Math.max(0, Math.floor((now - cachedAt) / 1000))
        };
      } else {
        result = unavailable(now);
      }
    }
    lastResult = result;
    return result;
  })();

  inFlight = request;
  try {
    return await request;
  } finally {
    if (inFlight === request) inFlight = null;
  }
}

function resetMarketCacheForTests() {
  cachedQuote = null;
  cachedAt = 0;
  lastAttemptAt = 0;
  lastResult = null;
  inFlight = null;
}

module.exports = {
  NESTEX_TICKER_URLS,
  CACHE_MS,
  STALE_MS,
  selectTicker,
  normalizeTicker,
  getNestExQuote,
  resetMarketCacheForTests
};
