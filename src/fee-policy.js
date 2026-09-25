"use strict";

// 1 sat/vB = 0.00001000 VMESH/kvB for an 8-decimal coin.
const DEFAULT_FALLBACK_FEE_RATE = 0.00001000;
const MAX_AUTOMATIC_FALLBACK_FEE_RATE = 0.00100000; // 100 sat/vB safety ceiling.

function positiveRate(value) {
  const rate = Number(value);
  return Number.isFinite(rate) && rate > 0 ? rate : null;
}

function hasUsableEstimate(result) {
  return !!positiveRate(result?.feerate);
}

function fallbackRateFromNode(networkInfo = {}, mempoolInfo = {}) {
  const candidates = [
    DEFAULT_FALLBACK_FEE_RATE,
    networkInfo.relayfee,
    networkInfo.incrementalfee,
    mempoolInfo.mempoolminfee,
    mempoolInfo.minrelaytxfee
  ].map(positiveRate).filter(Boolean);

  const rate = Math.max(...candidates);
  if (rate > MAX_AUTOMATIC_FALLBACK_FEE_RATE) {
    throw new Error(
      `Automatic fallback fee would be unusually high (${rate} VMESH/kvB). ` +
      "Refusing to send automatically; check the local node fee policy."
    );
  }
  return Number(rate.toFixed(8));
}

async function resolveFeePolicy(rpc, target = 6) {
  const confTarget = Math.min(1008, Math.max(1, Number(target) || 6));
  let estimate = null;
  let estimateError = null;

  try {
    estimate = await rpc.call("estimatesmartfee", [confTarget, "conservative"]);
  } catch (err) {
    estimateError = String(err?.message || err || "Fee estimation failed");
  }

  if (hasUsableEstimate(estimate)) {
    return {
      source: "estimate",
      fallback: false,
      feerate: Number(Number(estimate.feerate).toFixed(8)),
      blocks: Number(estimate.blocks) || confTarget,
      errors: Array.isArray(estimate.errors) ? estimate.errors : []
    };
  }

  const [networkResult, mempoolResult] = await Promise.allSettled([
    rpc.call("getnetworkinfo"),
    rpc.call("getmempoolinfo")
  ]);
  const networkInfo = networkResult.status === "fulfilled" ? networkResult.value : {};
  const mempoolInfo = mempoolResult.status === "fulfilled" ? mempoolResult.value : {};
  const errors = Array.isArray(estimate?.errors) ? [...estimate.errors] : [];
  if (estimateError) errors.push(estimateError);

  return {
    source: "fallback",
    fallback: true,
    feerate: fallbackRateFromNode(networkInfo, mempoolInfo),
    blocks: confTarget,
    errors
  };
}

module.exports = {
  DEFAULT_FALLBACK_FEE_RATE,
  MAX_AUTOMATIC_FALLBACK_FEE_RATE,
  hasUsableEstimate,
  fallbackRateFromNode,
  resolveFeePolicy
};
