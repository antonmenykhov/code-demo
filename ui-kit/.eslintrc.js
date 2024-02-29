/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "linebreak-style": "off",
    "object-curly-newline": "off",
    "no-plusplus": "off",
    "implicit-arrow-linebreak": "off",
    "function-paren-newline": "off",
    "comma-dangle": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "operator-linebreak": "off",
    "import/no-cycle": "off",
    "no-spaced-func": "off",
    "func-call-spacing": "off",
  },
};
