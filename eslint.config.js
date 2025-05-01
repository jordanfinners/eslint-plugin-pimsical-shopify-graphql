import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginRecommended from 'eslint-plugin-eslint-plugin/configs/recommended';

export default [
  { languageOptions: { globals: globals.node } },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  pluginRecommended,
  {
    rules: {
      'max-len': ['error', {
        ignoreTemplateLiterals: true,
        ignoreStrings: true
      }]
    }
  },
];
