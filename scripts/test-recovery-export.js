"use strict";

const assert = require("assert");
const fs = require("fs");

const main = fs.readFileSync("src/main.js", "utf8");
const preload = fs.readFileSync("src/preload.js", "utf8");
const app = fs.readFileSync("src/renderer/app.js", "utf8");
const html = fs.readFileSync("src/renderer/index.html", "utf8");

assert.ok(
  main.includes('register("wallet:saveRecoveryPhrase"'),
  "Recovery save IPC handler missing"
);

assert.ok(
  main.includes('register("clipboard:clearIfMatches"'),
  "Conditional clipboard clear handler missing"
);

assert.ok(
  preload.includes("saveRecoveryPhrase:"),
  "Recovery save preload API missing"
);

assert.ok(
  preload.includes("clearClipboardIfMatches:"),
  "Clipboard clear preload API missing"
);

assert.ok(
  html.includes('id="hdCopyMnemonicBtn"'),
  "Recovery copy button missing"
);

assert.ok(
  html.includes('id="hdSaveMnemonicBtn"'),
  "Recovery TXT button missing"
);

assert.ok(
  app.includes("async function copyHdRecoveryPhrase()"),
  "Recovery copy function missing"
);

assert.ok(
  app.includes("async function saveHdRecoveryPhrase()"),
  "Recovery save function missing"
);

/*
 * Never write the wallet encryption passphrase into the
 * recovery TXT contents.
 */
const start = main.indexOf('register("wallet:saveRecoveryPhrase"');
const end = main.indexOf('register("wallet:hdCreate"', start);
const handler = main.slice(start, end);

assert.ok(
  !/payload\.passphrase/.test(handler),
  "Recovery TXT handler must not access wallet passphrase"
);

console.log("VargaMesh recovery export tests: PASS");
