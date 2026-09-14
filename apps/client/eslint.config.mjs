import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  { ignores: [".next/**", "node_modules/**"] },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-undef": "off",
      "prefer-const": "off",
      "turbo/no-undeclared-env-vars": "off"
    }
  }
];
