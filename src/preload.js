"use strict";
const { contextBridge, ipcRenderer } = require("electron");

const invoke = (channel, payload) => ipcRenderer.invoke(channel, payload);

contextBridge.exposeInMainWorld("vmesh", Object.freeze({
  app: Object.freeze({
    info: () => invoke("app:info"),
    settings: () => invoke("app:settings"),
    setLanguage: language => invoke("app:setLanguage", { language }),
    finishOnboarding: () => invoke("app:finishOnboarding"),
    openDataDir: () => invoke("app:openDataDir"),
    openConfig: () => invoke("app:openConfig"),
    openWebsite: page => invoke("app:openWebsite", { page }),
    copyText: text => invoke("app:copyText", { text })
  }),
  node: Object.freeze({
    start: () => invoke("node:start"),
    stop: () => invoke("node:stop"),
    status: () => invoke("node:status")
  }),
  wallet: Object.freeze({
    list: () => invoke("wallet:list"),
    select: name => invoke("wallet:select", { name }),
    load: name => invoke("wallet:load", { name }),
    unload: name => invoke("wallet:unload", { name }),
    create: (name, passphrase) => invoke("wallet:create", { name, passphrase }),
    info: () => invoke("wallet:info"),
    newAddress: label => invoke("wallet:newAddress", { label }),
    transactions: () => invoke("wallet:transactions"),
    validateAddress: address => invoke("wallet:validateAddress", { address }),
    estimateFee: () => invoke("wallet:estimateFee"),
    send: (address, amount, passphrase) => invoke("wallet:send", { address, amount, passphrase }),
    backup: () => invoke("wallet:backup"),
    restore: name => invoke("wallet:restore", { name }),
    migrate: (name, passphrase) => invoke("wallet:migrate", { name, passphrase })
  })
}));
