"use strict";

const https = require("node:https");
const crypto = require("node:crypto");
const { resolveFeePolicy } = require("./fee-policy");

const API_ORIGIN = "https://vargamesh.com";
const API_PREFIX = "/api/v1";
const MAX_ATOMIC = (1n << 63n) - 1n;
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
const CANDIDATE_TTL_MS = 5 * 60 * 1000;
const MAX_PENDING = 12;

const pendingCandidates = new Map();

function requireWalletName(name) {
  if (typeof name !== "string") throw new Error("Invalid wallet name.");
  const value = name.trim();
  if (!value || value.length > 96 || !/^[A-Za-z0-9._ -]+$/.test(value) || value.includes("..")) {
    throw new Error("Invalid wallet name.");
  }
  return value;
}

function requireTokenId(value) {
  if (typeof value !== "string" || !/^[0-9a-fA-F]{64}$/.test(value)) {
    throw new Error("Invalid VMT-1 token ID.");
  }
  return value.toLowerCase();
}

function requireVmAddress(value) {
  if (typeof value !== "string") throw new Error("Invalid VargaMesh address.");
  const address = value.trim();
  if (!/^vm1[0-9a-z]{20,100}$/.test(address)) throw new Error("VMT-1 requires a VargaMesh Mainnet vm1 address.");
  return address;
}

function requireAtomic(value, field = "amount") {
  let amount;
  try { amount = BigInt(String(value)); }
  catch (_) { throw new Error(`Invalid ${field}.`); }
  if (amount <= 0n || amount > MAX_ATOMIC) throw new Error(`Invalid ${field}.`);
  return amount;
}

function decimalToAtomic(value, decimals) {
  const d = Number(decimals);
  if (!Number.isInteger(d) || d < 0 || d > 8) throw new Error("Token decimals must be 0..8.");
  const text = String(value ?? "").trim().replace(/,/g, "");
  if (!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(text)) throw new Error("Invalid token amount.");
  let [whole, fraction = ""] = text.split(".");
  if (fraction.length > d) throw new Error(`Maximum ${d} decimal places.`);
  fraction = fraction.padEnd(d, "0");
  const atomic = BigInt(whole) * (10n ** BigInt(d)) + BigInt(fraction || "0");
  if (atomic < 0n || atomic > MAX_ATOMIC) throw new Error("Token amount exceeds VMT-1 range.");
  return atomic;
}

function displayAtomic(value, decimals) {
  const n = BigInt(value);
  const d = Number(decimals);
  if (!d) return String(n);
  const base = 10n ** BigInt(d);
  return `${n / base}.${String(n % base).padStart(d, "0")}`;
}

function u64be(value) {
  let n = BigInt(value);
  if (n < 0n || n > MAX_ATOMIC) throw new Error("VMT-1 integer outside allowed range.");
  const out = Buffer.alloc(8);
  for (let i = 7; i >= 0; i--) {
    out[i] = Number(n & 0xffn);
    n >>= 8n;
  }
  return out;
}

function tokenBytes(tokenId) {
  return Buffer.from(requireTokenId(tokenId), "hex");
}

function buildCreatePayload({ name, symbol, decimals, initialAtomic, maxAtomic, mintable }) {
  const tokenName = String(name || "").trim();
  const tokenSymbol = String(symbol || "").trim().toUpperCase();
  const d = Number(decimals);
  const initial = BigInt(initialAtomic);
  const maximum = BigInt(maxAtomic);
  if (!/^[A-Za-z0-9][A-Za-z0-9 ._\-]{0,31}$/.test(tokenName)) {
    throw new Error("Token name must be 1-32 ASCII letters, digits, spaces or . _ -.");
  }
  if (!/^[A-Z0-9]{2,10}$/.test(tokenSymbol)) {
    throw new Error("Token symbol must be 2-10 uppercase ASCII letters/digits.");
  }
  if (!Number.isInteger(d) || d < 0 || d > 8) throw new Error("Token decimals must be 0..8.");
  if (maximum <= 0n || initial < 0n || initial > maximum || maximum > MAX_ATOMIC) {
    throw new Error("Invalid initial/maximum token supply.");
  }
  if (!mintable && initial !== maximum) throw new Error("Fixed-supply token requires initial supply = maximum supply.");
  const nameBytes = Buffer.from(tokenName, "ascii");
  const symbolBytes = Buffer.from(tokenSymbol, "ascii");
  const payload = Buffer.concat([
    Buffer.from("VMT", "ascii"),
    Buffer.from([1, 1, mintable ? 1 : 0, d]),
    u64be(initial),
    u64be(maximum),
    Buffer.from([nameBytes.length]),
    nameBytes,
    Buffer.from([symbolBytes.length]),
    symbolBytes
  ]);
  if (payload.length > 80) throw new Error("CREATE payload exceeds 80 bytes.");
  return payload;
}

function buildTokenPayload(operation, tokenId, amountAtomic, recipientProgramHex = "") {
  const op = String(operation || "").toUpperCase();
  const code = { MINT: 2, TRANSFER: 3, BURN: 4 }[op];
  if (!code) throw new Error("Unsupported VMT-1 operation.");
  const amount = requireAtomic(amountAtomic);
  const head = Buffer.concat([
    Buffer.from("VMT", "ascii"),
    Buffer.from([1, code]),
    tokenBytes(tokenId),
    u64be(amount)
  ]);
  if (op !== "TRANSFER") return head;
  if (!/^[0-9a-fA-F]{40}$/.test(recipientProgramHex)) throw new Error("Recipient must be native P2WPKH.");
  return Buffer.concat([head, Buffer.from(recipientProgramHex, "hex")]);
}

function strictOperation(preflight, expected) {
  if (!preflight?.ready) throw new Error(preflight?.reason || "VMT preflight failed.");
  if (preflight.authorizer !== expected.authorizer) throw new Error("VMT preflight authorizer mismatch.");
  const op = preflight.operation || {};
  if (op.operation !== expected.operation) throw new Error("VMT preflight operation mismatch.");
  if (expected.tokenId && op.token_id !== expected.tokenId) throw new Error("VMT preflight token ID mismatch.");
  if (expected.amountAtomic && String(op.amount_atomic) !== String(expected.amountAtomic)) {
    throw new Error("VMT preflight amount mismatch.");
  }
  if (expected.recipient && op.recipient !== expected.recipient) throw new Error("VMT preflight recipient mismatch.");
  if (expected.name && op.name !== expected.name) throw new Error("VMT preflight token name mismatch.");
  if (expected.symbol && op.symbol !== expected.symbol) throw new Error("VMT preflight token symbol mismatch.");
  if (expected.decimals != null && Number(op.decimals) !== Number(expected.decimals)) throw new Error("VMT preflight decimals mismatch.");
  if (expected.mintable != null && Boolean(op.mintable) !== Boolean(expected.mintable)) throw new Error("VMT preflight mintability mismatch.");
  if (expected.initialAtomic != null && String(op.initial_atomic) !== String(expected.initialAtomic)) throw new Error("VMT preflight initial supply mismatch.");
  if (expected.maxAtomic != null && String(op.maximum_atomic) !== String(expected.maxAtomic)) throw new Error("VMT preflight maximum supply mismatch.");
  if (!preflight.ledger?.valid) throw new Error(preflight.ledger?.reason || "VMT ledger validation failed.");
  if (!preflight.base_chain?.mempool_allowed) {
    throw new Error(preflight.base_chain?.reject_reason || "VargaMesh mempool validation failed.");
  }
  if (expected.operation === "CREATE" && preflight.create_fee?.required && !preflight.create_fee?.valid) {
    throw new Error("VMT CREATE fee validation failed.");
  }
  return true;
}

function requestJson(pathname, options = {}) {
  return new Promise((resolve, reject) => {
    const method = options.method || "GET";
    const body = options.body == null ? null : JSON.stringify(options.body);
    const req = https.request({
      protocol: "https:",
      hostname: "vargamesh.com",
      port: 443,
      method,
      path: API_PREFIX + pathname,
      timeout: 15_000,
      headers: {
        "Accept": "application/json",
        ...(body ? {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body)
        } : {})
      }
    }, res => {
      if ((res.statusCode || 0) >= 300 && (res.statusCode || 0) < 400) {
        res.resume();
        return reject(new Error("VMT API redirects are not accepted."));
      }
      let raw = "";
      res.setEncoding("utf8");
      res.on("data", chunk => {
        raw += chunk;
        if (raw.length > MAX_RESPONSE_BYTES) req.destroy(new Error("VMT API response exceeded safety limit."));
      });
      res.on("end", () => {
        let parsed = {};
        try { parsed = raw ? JSON.parse(raw) : {}; }
        catch (_) { return reject(new Error("Invalid VMT API response.")); }
        if ((res.statusCode || 500) < 200 || (res.statusCode || 500) >= 300) {
          const detail = typeof parsed.detail === "string"
            ? parsed.detail
            : (parsed.detail?.error || parsed.error || `HTTP ${res.statusCode}`);
          return reject(new Error(`VMT API: ${detail}`));
        }
        resolve(parsed);
      });
    });
    req.on("timeout", () => req.destroy(new Error("VMT API request timed out.")));
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

function requestBinary(pathname) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      protocol: "https:",
      hostname: "vargamesh.com",
      port: 443,
      method: "GET",
      path: API_PREFIX + pathname,
      timeout: 15_000,
      headers: { "Accept": "image/png" }
    }, res => {
      const chunks = [];
      let total = 0;
      res.on("data", chunk => {
        total += chunk.length;
        if (total > 300 * 1024) return req.destroy(new Error("Token logo exceeded safety limit."));
        chunks.push(chunk);
      });
      res.on("end", () => {
        if (res.statusCode !== 200) return reject(new Error("Token logo unavailable."));
        const type = String(res.headers["content-type"] || "").split(";")[0].trim();
        if (type !== "image/png") return reject(new Error("Unexpected token logo content type."));
        resolve(Buffer.concat(chunks));
      });
    });
    req.on("timeout", () => req.destroy(new Error("Token logo request timed out.")));
    req.on("error", reject);
    req.end();
  });
}

async function nativeAddressInfo(rpc, wallet, address) {
  const value = requireVmAddress(address);
  const [networkInfo, walletInfo] = await Promise.all([
    rpc.call("validateaddress", [value]),
    rpc.call("getaddressinfo", [value], wallet)
  ]);
  const witnessProgram = String(networkInfo?.witness_program || walletInfo?.witness_program || "").toLowerCase();
  const native = networkInfo?.isvalid === true
    && (networkInfo?.iswitness === true || walletInfo?.iswitness === true)
    && Number(networkInfo?.witness_version ?? walletInfo?.witness_version) === 0
    && /^[0-9a-f]{40}$/.test(witnessProgram);
  return {
    address: value,
    native,
    witnessProgram,
    isMine: walletInfo?.ismine === true,
    watchOnly: walletInfo?.iswatchonly === true,
    solvable: walletInfo?.solvable !== false
  };
}

async function walletAddressInventory(rpc, wallet) {
  const name = requireWalletName(wallet);
  const candidates = new Set();
  const utxos = await rpc.call("listunspent", [0, 9999999, [], true], name, 30_000).catch(() => []);
  for (const row of utxos || []) if (row?.address) candidates.add(row.address);

  const received = await rpc.call("listreceivedbyaddress", [0, true, true], name, 30_000).catch(() => []);
  for (const row of received || []) if (row?.address) candidates.add(row.address);

  const listedLabels = await rpc.call("listlabels", [], name, 30_000).catch(() => []);
  const labels = new Set(["", ...(listedLabels || [])]);
  for (const label of labels) {
    const rows = await rpc.call("getaddressesbylabel", [label], name, 30_000).catch(() => ({}));
    for (const address of Object.keys(rows || {})) candidates.add(address);
  }

  const byAddress = new Map();
  for (const row of utxos || []) {
    if (!row?.address) continue;
    const current = byAddress.get(row.address) || { confirmedAtomic: 0n, spendableAtomic: 0n, utxos: [] };
    const atomic = BigInt(Math.round(Number(row.amount || 0) * 1e8));
    if (Number(row.confirmations || 0) >= 1) current.confirmedAtomic += atomic;
    if (row.spendable && row.solvable && Number(row.confirmations || 0) >= 1) {
      current.spendableAtomic += atomic;
      current.utxos.push(row);
    }
    byAddress.set(row.address, current);
  }

  const addresses = [];
  for (const address of [...candidates].slice(0, 500)) {
    if (!String(address).startsWith("vm1")) continue;
    try {
      const info = await nativeAddressInfo(rpc, name, address);
      if (!info.native || (!info.isMine && !info.watchOnly)) continue;
      const funds = byAddress.get(address) || { confirmedAtomic: 0n, spendableAtomic: 0n, utxos: [] };
      addresses.push({
        address,
        is_mine: info.isMine,
        watch_only: info.watchOnly,
        confirmed_vmesh_atomic: String(funds.confirmedAtomic),
        confirmed_vmesh: displayAtomic(funds.confirmedAtomic, 8),
        spendable_vmesh_atomic: String(funds.spendableAtomic),
        spendable_vmesh: displayAtomic(funds.spendableAtomic, 8),
        spendable_utxos: funds.utxos.length
      });
    } catch (_) {}
  }
  addresses.sort((a, b) => {
    const mine = Number(b.is_mine) - Number(a.is_mine);
    if (mine) return mine;
    const bal = BigInt(b.spendable_vmesh_atomic) - BigInt(a.spendable_vmesh_atomic);
    return bal > 0n ? 1 : bal < 0n ? -1 : a.address.localeCompare(b.address);
  });
  return addresses;
}

async function portfolio(rpc, wallet) {
  const name = requireWalletName(wallet);
  const status = await requestJson("/vmt/status");
  const addresses = await walletAddressInventory(rpc, name);
  const holdings = [];
  const activity = [];

  let cursor = 0;
  const workers = Math.min(8, Math.max(1, addresses.length));
  async function work() {
    while (cursor < addresses.length) {
      const item = addresses[cursor++];
      try {
        const tokenState = await requestJson(`/addresses/${encodeURIComponent(item.address)}/tokens`);
        for (const token of tokenState.tokens || []) {
          holdings.push({ ...token, owner_address: item.address, spendable: item.is_mine, source_vmesh: item.spendable_vmesh });
        }
        try {
          const events = await requestJson(`/addresses/${encodeURIComponent(item.address)}/events?limit=20&offset=0`);
          for (const event of events.items || []) activity.push({ ...event, wallet_address: item.address });
        } catch (_) {
          // Token balances remain usable if the optional activity endpoint is temporarily unavailable.
        }
      } catch (_) {}
    }
  }
  await Promise.all(Array.from({ length: workers }, () => work()));

  holdings.sort((a, b) => {
    const aa = BigInt(a.balance_atomic || "0");
    const bb = BigInt(b.balance_atomic || "0");
    if (aa !== bb) return aa > bb ? -1 : 1;
    return String(a.symbol || "").localeCompare(String(b.symbol || ""));
  });
  activity.sort((a, b) => Number(b.height || 0) - Number(a.height || 0));

  return {
    api_origin: API_ORIGIN,
    status,
    addresses,
    holdings,
    activity: activity.slice(0, 100)
  };
}

async function tokenDirectory(query = "") {
  const q = String(query || "").trim().slice(0, 128);
  return requestJson(`/tokens?q=${encodeURIComponent(q)}&limit=100&offset=0`);
}

async function tokenDetail(tokenId) {
  return requestJson(`/tokens/${encodeURIComponent(requireTokenId(tokenId))}`);
}

async function tokenLogoData(tokenId) {
  const raw = await requestBinary(`/tokens/${encodeURIComponent(requireTokenId(tokenId))}/logo`);
  if (raw.length < 8 || raw.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error("Token logo is not a valid PNG.");
  }
  return `data:image/png;base64,${raw.toString("base64")}`;
}

function cleanupCandidates() {
  const now = Date.now();
  for (const [id, candidate] of pendingCandidates) {
    if (candidate.expiresAt <= now) pendingCandidates.delete(id);
  }
  while (pendingCandidates.size > MAX_PENDING) {
    pendingCandidates.delete(pendingCandidates.keys().next().value);
  }
}

async function chooseAuthorizerUtxo(rpc, wallet, authorizer) {
  const rows = await rpc.call("listunspent", [1, 9999999, [authorizer], true], wallet, 30_000);
  const spendable = (rows || []).filter(row => row.spendable === true && row.solvable === true);
  if (!spendable.length) {
    throw new Error("The selected VMT address needs at least one confirmed spendable VMESH UTXO for vin[0] authorization.");
  }
  spendable.sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0));
  return spendable[0];
}

function createFeeRequired(status) {
  const fee = status?.policy?.create_fee;
  if (!fee?.enabled) return false;
  const nextHeight = Number(status.indexed_height ?? -1) + 1;
  const activation = Number(fee.activation_height);
  return Number.isFinite(nextHeight) && Number.isFinite(activation) && nextHeight >= activation;
}

async function prepareTransaction(rpc, wallet, request) {
  cleanupCandidates();
  const name = requireWalletName(wallet);
  const operation = String(request?.operation || "").toUpperCase();
  if (!["CREATE", "TRANSFER", "BURN", "MINT"].includes(operation)) throw new Error("Unsupported VMT-1 operation.");

  const authorizer = requireVmAddress(request.authorizer);
  const authorizerInfo = await nativeAddressInfo(rpc, name, authorizer);
  if (!authorizerInfo.native || !authorizerInfo.isMine) throw new Error("Selected VMT authorizer is not a spendable native P2WPKH address in this wallet.");

  const status = await requestJson("/vmt/status");
  const feePolicy = await resolveFeePolicy({ call: (...args) => rpc.call(...args) }, request.feeTarget || 6);
  const authorizerUtxo = await chooseAuthorizerUtxo(rpc, name, authorizer);
  let payload;
  let expected;
  const outputs = [];

  if (operation === "CREATE") {
    const decimals = Number(request.decimals);
    const initialAtomic = decimalToAtomic(request.initialSupply, decimals);
    const maxAtomic = decimalToAtomic(request.maxSupply, decimals);
    payload = buildCreatePayload({
      name: request.name,
      symbol: request.symbol,
      decimals,
      initialAtomic,
      maxAtomic,
      mintable: request.mintable === true
    });
    expected = {
      operation,
      authorizer,
      name: String(request.name || "").trim(),
      symbol: String(request.symbol || "").trim().toUpperCase(),
      decimals,
      mintable: request.mintable === true,
      initialAtomic: String(initialAtomic),
      maxAtomic: String(maxAtomic)
    };
    if (createFeeRequired(status)) {
      const policy = status.policy?.create_fee;
      if (!policy?.address || !policy?.minimum_vmesh) throw new Error("Active CREATE fee policy is incomplete.");
      outputs.push({ [policy.address]: String(policy.minimum_vmesh) });
    }
  } else {
    const tokenId = requireTokenId(request.tokenId);
    const token = await tokenDetail(tokenId);
    const addressState = await requestJson(`/addresses/${encodeURIComponent(authorizer)}/tokens`);
    const holding = (addressState.tokens || []).find(row => row.token_id === tokenId);
    const balance = BigInt(holding?.balance_atomic || "0");
    const amountAtomic = decimalToAtomic(request.amount, token.decimals);
    if (amountAtomic <= 0n) throw new Error("Token amount must be greater than zero.");

    if (operation === "TRANSFER" || operation === "BURN") {
      if (amountAtomic > balance) throw new Error("Insufficient token balance on the selected VMT address.");
    }
    if (operation === "MINT") {
      if (token?.issuer?.address !== authorizer || token?.mintable !== true) {
        throw new Error("Selected address is not authorized to mint this token.");
      }
      const minted = BigInt(token.supply?.minted_atomic || "0");
      const maximum = BigInt(token.supply?.maximum_atomic || "0");
      if (minted + amountAtomic > maximum) {
        throw new Error("Mint would exceed the token lifetime maximum supply. Burns do not reopen mint capacity.");
      }
    }

    let recipient = "";
    let program = "";
    if (operation === "TRANSFER") {
      recipient = requireVmAddress(request.recipient);
      const recipientInfo = await nativeAddressInfo(rpc, name, recipient).catch(async () => {
        const network = await rpc.call("validateaddress", [recipient], "", 30_000);
        return {
          native: network?.isvalid === true && network?.iswitness === true && Number(network?.witness_version) === 0 && /^[0-9a-fA-F]{40}$/.test(String(network?.witness_program || "")),
          witnessProgram: String(network?.witness_program || "").toLowerCase()
        };
      });
      if (!recipientInfo.native) throw new Error("VMT-1 recipient must be a native vm1 P2WPKH address.");
      program = recipientInfo.witnessProgram;
    }
    payload = buildTokenPayload(operation, tokenId, amountAtomic, program);
    expected = {
      operation,
      authorizer,
      tokenId,
      amountAtomic: String(amountAtomic),
      ...(recipient ? { recipient } : {})
    };
  }

  outputs.unshift({ data: payload.toString("hex") });

  const inputs = [{ txid: authorizerUtxo.txid, vout: Number(authorizerUtxo.vout) }];
  const raw = await rpc.call("createrawtransaction", [inputs, outputs], "", 30_000);
  const funded = await rpc.call("fundrawtransaction", [raw, {
    add_inputs: true,
    changeAddress: authorizer,
    feeRate: Number(feePolicy.feerate),
    minconf: 1
  }], name, 60_000);

  const fundedDecoded = await rpc.call("decoderawtransaction", [funded.hex], "", 30_000);
  const first = fundedDecoded?.vin?.[0];
  if (first?.txid !== authorizerUtxo.txid || Number(first?.vout) !== Number(authorizerUtxo.vout)) {
    throw new Error("Core changed VMT vin[0] authorizer ordering; transaction refused.");
  }

  const signed = await rpc.call("signrawtransactionwithwallet", [funded.hex], name, 60_000);
  if (signed?.complete !== true || !signed?.hex) throw new Error("VargaMesh Core could not completely sign the VMT transaction.");

  const signedDecoded = await rpc.call("decoderawtransaction", [signed.hex], "", 30_000);
  const signedFirst = signedDecoded?.vin?.[0];
  if (signedFirst?.txid !== authorizerUtxo.txid || Number(signedFirst?.vout) !== Number(authorizerUtxo.vout)) {
    throw new Error("Signed transaction changed VMT vin[0] authorizer ordering; transaction refused.");
  }

  const preflight = await requestJson("/vmt/preflight", { method: "POST", body: { raw_hex: signed.hex } });
  strictOperation(preflight, expected);

  const id = crypto.randomUUID();
  pendingCandidates.set(id, {
    id,
    wallet: name,
    rawHex: signed.hex,
    expected,
    txid: preflight.txid,
    expiresAt: Date.now() + CANDIDATE_TTL_MS
  });
  cleanupCandidates();

  return {
    candidate_id: id,
    expires_in_seconds: Math.floor(CANDIDATE_TTL_MS / 1000),
    preflight,
    fee_policy: feePolicy,
    authorizer,
    source_utxo: {
      txid: authorizerUtxo.txid,
      vout: authorizerUtxo.vout,
      amount: authorizerUtxo.amount,
      confirmations: authorizerUtxo.confirmations
    }
  };
}

async function broadcastPrepared(rpc, candidateId) {
  cleanupCandidates();
  const id = String(candidateId || "");
  const candidate = pendingCandidates.get(id);
  if (!candidate) throw new Error("VMT transaction candidate expired or does not exist. Build it again.");
  const preflight = await requestJson("/vmt/preflight", { method: "POST", body: { raw_hex: candidate.rawHex } });
  strictOperation(preflight, candidate.expected);
  if (preflight.txid !== candidate.txid) throw new Error("VMT transaction ID changed between preflight checks.");
  const txid = await rpc.call("sendrawtransaction", [candidate.rawHex], "", 60_000);
  if (txid !== candidate.txid) throw new Error("Unexpected transaction ID returned by VargaMesh Core.");
  pendingCandidates.delete(id);
  return { txid, preflight };
}

module.exports = {
  API_ORIGIN,
  MAX_ATOMIC,
  decimalToAtomic,
  displayAtomic,
  buildCreatePayload,
  buildTokenPayload,
  strictOperation,
  walletAddressInventory,
  portfolio,
  tokenDirectory,
  tokenDetail,
  tokenLogoData,
  prepareTransaction,
  broadcastPrepared
};
