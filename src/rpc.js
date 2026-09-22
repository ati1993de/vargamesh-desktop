"use strict";
const fs = require("node:fs");
const http = require("node:http");

class RpcError extends Error {
  constructor(message, code = null, data = null) {
    super(message);
    this.name = "RpcError";
    this.code = code;
    this.data = data;
  }
}

class VargaRpc {
  constructor({ cookieFile, port = 29667 }) {
    this.cookieFile = cookieFile;
    this.port = port;
    this.counter = 0;
  }

  authHeader() {
    const cookie = fs.readFileSync(this.cookieFile, "utf8").trim();
    if (!cookie.includes(":")) throw new RpcError("RPC cookie is invalid");
    return `Basic ${Buffer.from(cookie, "utf8").toString("base64")}`;
  }

  call(method, params = [], wallet = "", timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      let auth;
      try { auth = this.authHeader(); } catch (e) { reject(e); return; }
      const body = JSON.stringify({ jsonrpc: "2.0", id: ++this.counter, method, params });
      const rpcPath = wallet ? `/wallet/${encodeURIComponent(wallet)}` : "/";
      const req = http.request({
        hostname: "127.0.0.1",
        port: this.port,
        path: rpcPath,
        method: "POST",
        headers: {
          "Authorization": auth,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body)
        },
        timeout: timeoutMs
      }, res => {
        let raw = "";
        res.setEncoding("utf8");
        res.on("data", chunk => { raw += chunk; if (raw.length > 10_000_000) req.destroy(new Error("RPC response too large")); });
        res.on("end", () => {
          try {
            const parsed = JSON.parse(raw || "{}");
            if (parsed.error) reject(new RpcError(parsed.error.message || "RPC error", parsed.error.code, parsed.error.data));
            else resolve(parsed.result);
          } catch (e) {
            reject(new RpcError(`Invalid RPC response (${res.statusCode || 0})`));
          }
        });
      });
      req.on("timeout", () => req.destroy(new RpcError("RPC request timed out")));
      req.on("error", reject);
      req.write(body);
      req.end();
    });
  }
}

module.exports = { VargaRpc, RpcError };
