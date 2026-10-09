"use strict";
const https = require("node:https");
const { normalizeTarget } = require("./address-book");
const HOST = "vargamesh.com";
const MAX_RESPONSE = 64 * 1024;
function normalizeResponse(name, response) {
  if (!response || typeof response !== "object" || Array.isArray(response)) throw new Error("Invalid VNS response.");
  const record = response.result && typeof response.result === "object" ? response.result :
    response.data && typeof response.data === "object" ? response.data : response;
  const returnedName = record.name || record.full_name || record.fqdn;
  if (returnedName && String(returnedName).toLowerCase().replace(/\.vmesh$/, "") !== name.replace(/\.vmesh$/, "")) {
    throw new Error("VNS returned a different name.");
  }
  if (record.active === false || record.expired === true || record.available === true ||
      record.found === false || record.resolved === false ||
      ["expired", "inactive", "available", "not_found"].includes(String(record.status || "").toLowerCase())) {
    throw new Error("VNS name is not active.");
  }
  const address = record.address || record.target_address || record.target ||
    record.resolved_address || record.resolve_to || record.record?.address;
  if (typeof address !== "string" || !/^vm1[a-z0-9]{11,110}$/.test(address)) throw new Error("VNS did not return a valid-looking VMESH address.");
  return { name, address, source: "VargaMesh VNS", verifiedAt: new Date().toISOString() };
}
function resolveVns(name, request = https.request) {
  const target = normalizeTarget(name);
  if (!target.endsWith(".vmesh")) throw new Error("Recipient is not a VNS name.");
  return new Promise((resolve, reject) => {
    let finished = false;
    const done = (err, value) => { if (finished) return; finished = true; if (err) reject(err); else resolve(value); };
    const req = request({
      protocol: "https:", hostname: HOST, port: 443, method: "GET",
      path: "/api/vns/v1/resolve/" + encodeURIComponent(target),
      timeout: 8000, headers: { Accept: "application/json" }
    }, res => {
      if (res.statusCode !== 200) { res.resume(); return done(new Error("VNS resolver unavailable or name not found.")); }
      let body = "";
      res.setEncoding("utf8");
      res.on("data", chunk => {
        body += chunk;
        if (Buffer.byteLength(body, "utf8") > MAX_RESPONSE) req.destroy(new Error("VNS response too large."));
      });
      res.on("end", () => {
        try { done(null, normalizeResponse(target, JSON.parse(body))); }
        catch (err) { done(err); }
      });
    });
    req.on("timeout", () => req.destroy(new Error("VNS resolver timed out.")));
    req.on("error", err => done(err));
    req.end();
  });
}
module.exports = { resolveVns, normalizeResponse };
