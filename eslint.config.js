import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPlugin  from 'eslint-plugin-eslint-plugin';

export default [
  { languageOptions: { globals: globals.node } },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  eslintPlugin .configs.recommended,
  {
    rules: {
      'max-len': ['error', {
        ignoreTemplateLiterals: true,
        ignoreStrings: true
      }]
    }
  },
];
