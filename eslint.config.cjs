const globals = require("globals");

module.exports = [
  {
    files: [
      "src/main.js",
      "src/preload.js",
      "src/rpc.js",
      "src/core-manager.js",
      "src/settings.js",
      "src/wallet-import.js",
      "src/fee-policy.js",
      "src/hd-wallet.js",
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
      "src/renderer/app.js"
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
