import jsx from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,js}"], plugins: { jsx }, extends: ["js/recommended"] },
  { files: ["**/*.{jsx,mjs,cjs,js}"], languageOptions: { globals: globals.browser } },
  pluginReact.configs.flat.recommended,
]);
