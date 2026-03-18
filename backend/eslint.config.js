const js = require("@eslint/js");
const globals = require("globals");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const node = require("eslint-plugin-node");

module.exports = [
  { ignores: ["dist"] },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.node,
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      node,
      "@typescript-eslint": tseslint,
    },
    rules: {
      "node/no-missing-import": "off",
      "node/no-unsupported-features/es-syntax": "off",
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
];
