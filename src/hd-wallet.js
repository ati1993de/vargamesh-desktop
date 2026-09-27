"use strict";

const bip39 = require("bip39");
const ecc = require("tiny-secp256k1");
const { BIP32Factory } = require("bip32");

const bip32 = BIP32Factory(ecc);

const COIN_TYPE = 22093;
const ACCOUNT = 0;

/*
 * VargaMesh Mainnet BIP32 extended-key version bytes.
 *
 * Core:
 * EXT_PUBLIC_KEY = 02 4D 77 1C
 * EXT_SECRET_KEY = 02 4D 77 07
 *
 * Using Bitcoin's default xpub/xprv versions would cause
 * VargaMesh Core to reject the descriptor as an invalid key.
 */
const VMESH_BIP32_NETWORK = Object.freeze({
  wif: 190,
  bip32: Object.freeze({
    public: 0x024D771C,
    private: 0x024D7707
  })
});

const PATHS = Object.freeze({
  bip44Account: `m/44'/${COIN_TYPE}'/${ACCOUNT}'`,
  bip84Account: `m/84'/${COIN_TYPE}'/${ACCOUNT}'`,
  bip44Receive: `m/44'/${COIN_TYPE}'/${ACCOUNT}'/0/*`,
  bip44Change: `m/44'/${COIN_TYPE}'/${ACCOUNT}'/1/*`,
  bip84Receive: `m/84'/${COIN_TYPE}'/${ACCOUNT}'/0/*`,
  bip84Change: `m/84'/${COIN_TYPE}'/${ACCOUNT}'/1/*`
});

function normalizeMnemonic(value) {
  if (typeof value !== "string") throw new Error("Recovery phrase is required.");

  return value
    .normalize("NFKD")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function requireMnemonic(value) {
  const mnemonic = normalizeMnemonic(value);
  const count = mnemonic ? mnemonic.split(" ").length : 0;

  if (![12, 24].includes(count)) {
    throw new Error("Recovery phrase must contain 12 or 24 words.");
  }

  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Invalid BIP39 recovery phrase.");
  }

  return mnemonic;
}

function createMnemonic(words = 24) {
  return bip39.generateMnemonic(Number(words) === 12 ? 128 : 256);
}

function fingerprintHex(root) {
  return Buffer.from(root.fingerprint).toString("hex");
}

function deriveWalletDescriptors(value) {
  const mnemonic = requireMnemonic(value);
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed, VMESH_BIP32_NETWORK);
  const fingerprint = fingerprintHex(root);

  const account44 = root.derivePath(PATHS.bip44Account);
  const account84 = root.derivePath(PATHS.bip84Account);

  const xprv44 = account44.toBase58();
  const xprv84 = account84.toBase58();

  return {
    coinType: COIN_TYPE,
    account: ACCOUNT,
    fingerprint,
    paths: { ...PATHS },
    descriptors: {
      legacyExternal:
        `pkh([${fingerprint}/44h/${COIN_TYPE}h/${ACCOUNT}h]${xprv44}/0/*)`,
      legacyInternal:
        `pkh([${fingerprint}/44h/${COIN_TYPE}h/${ACCOUNT}h]${xprv44}/1/*)`,
      segwitExternal:
        `wpkh([${fingerprint}/84h/${COIN_TYPE}h/${ACCOUNT}h]${xprv84}/0/*)`,
      segwitInternal:
        `wpkh([${fingerprint}/84h/${COIN_TYPE}h/${ACCOUNT}h]${xprv84}/1/*)`
    }
  };
}

module.exports = {
  COIN_TYPE,
  ACCOUNT,
  PATHS,
  VMESH_BIP32_NETWORK,
  createMnemonic,
  normalizeMnemonic,
  requireMnemonic,
  deriveWalletDescriptors
};
