"use strict";
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const asar = path.join(root, "dist", "win-unpacked", "resources", "app.asar");
if (!fs.existsSync(asar)) throw new Error(`Packaged app.asar missing: ${asar}`);

const data = fs.readFileSync(asar);
const text = data.toString("latin1");
const forbidden = [
  '"-server=1"',
  '"-listen=1"',
  '"-bind=0.0.0.0:29666"',
  '"-rpcbind=127.0.0.1"',
  '"-rpcallowip=127.0.0.1"',
  '"-rpcport=29667"',
  'getPath("localAppData")'
];
for (const needle of forbidden) {
  if (text.includes(needle)) throw new Error(`Forbidden stale runtime code found in packaged app.asar: ${needle}`);
}
for (const needle of ['"-printtoconsole=0"', 'process.env.LOCALAPPDATA']) {
  if (!text.includes(needle)) throw new Error(`Expected fixed runtime code missing from packaged app.asar: ${needle}`);
}
console.log("Packaged app.asar verification: PASS");
