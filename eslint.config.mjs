import { defineConfig, globalIgnores } from "eslint/config";
import react from "@eslint-react/eslint-plugin";
import next from "@next/eslint-plugin-next";
import importX from "eslint-plugin-import-x";
import jsxA11y from "eslint-plugin-jsx-a11y-x";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const codeFiles = ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"];
const tsFiles = ["**/*.{ts,tsx,mts,cts}"];

export default defineConfig([
  {
    files: codeFiles,
    extends: [
      react.configs.recommended,
      reactHooks.configs.flat.recommended,
      next.configs["core-web-vitals"],
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      "import-x": importX,
      "jsx-a11y-x": jsxA11y,
    },
    rules: {
      "import-x/no-anonymous-default-export": "warn",
      "jsx-a11y-x/alt-text": ["warn", { elements: ["img"], img: ["Image"] }],
      "jsx-a11y-x/aria-props": "warn",
      "jsx-a11y-x/aria-proptypes": "warn",
      "jsx-a11y-x/aria-unsupported-elements": "warn",
      "jsx-a11y-x/role-has-required-aria-props": "warn",
      "jsx-a11y-x/role-supports-aria-props": "warn",
    },
  },
  ...tseslint.configs.recommended.map((config) => ({ ...config, files: tsFiles })),
  {
    files: tsFiles,
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
