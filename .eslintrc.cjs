/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
  ],
  rules: {
    "semi": [
      "error",
      "always",
    ],
    "quotes": [
      "error",
      "double",
    ],
  },
};
