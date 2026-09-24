"use strict";

const BASE58_WIF = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50,55}$/;
const ADDRESS_TYPES = Object.freeze({
  bech32: wif => `wpkh(${wif})`,
  legacy: wif => `pkh(${wif})`,
  "p2sh-segwit": wif => `sh(wpkh(${wif}))`
});

function requireWif(value) {
  if (typeof value !== "string") throw new Error("Invalid WIF private key.");
  const wif = value.trim();
  if (!BASE58_WIF.test(wif)) throw new Error("Invalid WIF private key format.");
  return wif;
}

function requireAddressType(value) {
  const type = typeof value === "string" ? value : "bech32";
  if (!Object.hasOwn(ADDRESS_TYPES, type)) throw new Error("Unsupported address type.");
  return type;
}

function privateDescriptorForWif(wif, type = "bech32") {
  return ADDRESS_TYPES[requireAddressType(type)](requireWif(wif));
}

function addDescriptorChecksum(rawDescriptor, checksum) {
  if (typeof rawDescriptor !== "string" || !rawDescriptor) throw new Error("Descriptor is required.");
  if (typeof checksum !== "string" || !/^[0-9a-z]{8}$/.test(checksum)) throw new Error("Invalid descriptor checksum.");
  return `${rawDescriptor}#${checksum}`;
}

module.exports = { requireWif, requireAddressType, privateDescriptorForWif, addDescriptorChecksum };
