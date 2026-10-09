const globals = require("globals");

module.exports = [
  {
    files: [
      "src/main.js",
      "src/preload.js",
      "src/rpc.js",
      "src/core-manager.js",
      "src/settings.js",
      "src/market.js",
      "src/address-book.js",
      "src/vns.js",
      "src/wallet-notifications.js",
      "src/wallet-import.js",
      "src/fee-policy.js",
      "src/hd-wallet.js",
      "src/vmt.js",
      "src/i18n-native.js",
      "scripts/*.js"
    ],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: globals.node
    },

    rules: {
      "no-undef": "error"
    }
  },

  {
    files: [
      "src/renderer/app.js",
      "src/renderer/vmt.js",
      "src/renderer/i18n-ru.js",
      "src/renderer/i18n-zh.js",
      "src/renderer/i18n-extra.js",
      "src/renderer/professional-i18n.js"
    ],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: globals.browser
    },

    rules: {
      "no-undef": "error"
    }
  }
];
