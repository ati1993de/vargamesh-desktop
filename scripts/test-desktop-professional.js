"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { AddressBook, normalizeTarget } = require("../src/address-book");
const { normalizeResponse } = require("../src/vns");
const { WalletNotifier } = require("../src/wallet-notifications");
const base = fs.mkdtempSync(path.join(os.tmpdir(), "vmesh-addressbook-"));
try {
  const file = path.join(base, "addresses.json");
  const book = new AddressBook(file);
  assert.equal(normalizeTarget(" Alice.VMESH "), "alice.vmesh");
  assert.throws(() => normalizeTarget("../bad.vmesh"));
  const c = book.save({ label: "Alice", target: "alice.vmesh" });
  assert.equal(book.list()[0].id, c.id);
  assert.equal(new AddressBook(file).list().length, 1);
  book.save({ id: c.id, label: "Alice 2", target: "vm1q7w4sewykzmq3x5jyazqhefz7jptmnzylx3cjv2" });
  assert.equal(book.list().length, 1);
  assert.throws(() => book.remove("missing"));
  assert.equal(book.remove(c.id).removed, true);
  const address = "vm1q7w4sewykzmq3x5jyazqhefz7jptmnzylx3cjv2";
  assert.equal(normalizeResponse("alice.vmesh", { name: "alice.vmesh", active: true, address }).address, address);
  assert.throws(() => normalizeResponse("alice.vmesh", { name: "mallory.vmesh", address }));
  assert.throws(() => normalizeResponse("alice.vmesh", { active: false, address }));
  const notifications = [];
  let txs = [{ txid:"abc", vout:0, category:"receive", amount:1, confirmations:0 }];
  const rpc = { call: async (method) => {
    if (method === "listwallets") return ["main"];
    if (method === "listtransactions") return txs;
    if (method === "getblockchaininfo") return { verificationprogress: 1, initialblockdownload: false, blocks: 1, headers: 1 };
    throw Error(method);
  }};
  const notifier = new WalletNotifier({ rpc, getSettings:()=>({
    notificationsEnabled:true, notifyReceived:true,notifyConfirmed:true,
    notifySync:true,notificationShowAmounts:false
  }), notify: (title, body) => notifications.push(body) });
  (async () => {
    await notifier.tick(); assert.equal(notifications.length, 0);
    txs = [...txs, { txid:"def", vout:0, category:"receive", amount:2, confirmations:0 }];
    await notifier.tick(); assert.equal(notifications.length, 1);
    await notifier.tick(); assert.equal(notifications.length, 1);
    txs[1] = { ...txs[1], confirmations: 1 };
    await notifier.tick(); assert.equal(notifications.length, 2);
    console.log("Desktop professional feature tests: PASS");
  })().catch(e => { console.error(e); process.exitCode = 1; });
} finally {
  // Cleanup is intentionally deferred until after asynchronous notification tests.
}
