"use strict";

const fs = require("node:fs");
const http = require("node:http");

class RpcError extends Error {
  constructor(message, code = null, method = "") {
    super(message);
    this.name = "RpcError";
    this.code = code;
    this.method = method;
  }
}

class VargaRpc {
  constructor({ cookieFile, host = "127.0.0.1", port = 29667 }) {
    this.cookieFile = cookieFile;
    this.host = host;
    this.port = port;
    this.counter = 0;
  }

  authHeader() {
    const cookie = fs.readFileSync(this.cookieFile, "utf8").trim();
    if (!cookie || !cookie.includes(":")) throw new RpcError("VargaMesh RPC cookie is not ready yet.");
    return `Basic ${Buffer.from(cookie, "utf8").toString("base64")}`;
  }

  call(method, params = [], wallet = "", timeout = 15_000) {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({ jsonrpc: "1.0", id: `desktop-${++this.counter}`, method, params });
      const walletPath = wallet ? `/wallet/${encodeURIComponent(wallet)}` : "/";
      let req;
      try {
        req = http.request({
          host: this.host,
          port: this.port,
          path: walletPath,
          method: "POST",
          timeout,
          headers: {
            Authorization: this.authHeader(),
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body)
          }
        }, res => {
          let raw = "";
          res.setEncoding("utf8");
          res.on("data", chunk => {
            raw += chunk;
            if (raw.length > 10 * 1024 * 1024) req.destroy(new Error("RPC response exceeded safety limit."));
          });
          res.on("end", () => {
            let parsed;
            try { parsed = JSON.parse(raw); }
            catch (_) { return reject(new RpcError(`Invalid RPC response for ${method}.`, null, method)); }
            if (parsed && parsed.error) {
              return reject(new RpcError(parsed.error.message || `RPC ${method} failed.`, parsed.error.code, method));
            }
            resolve(parsed ? parsed.result : null);
          });
        });
      } catch (err) {
        reject(new RpcError(err.message, null, method));
        return;
      }
      req.on("timeout", () => req.destroy(new Error(`RPC timeout: ${method}`)));
      req.on("error", err => reject(new RpcError(err.message, null, method)));
      req.end(body);
    });
  }
}

module.exports = { VargaRpc, RpcError };
