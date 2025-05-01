import type {ESLint, Linter} from 'eslint';

export const configFactory = (plugin: ESLint.Plugin): Linter.Config => ({
  plugins: {
    'pimsical-shopify-graphql': plugin
  },

  rules: {
    'pimsical-shopify-graphql/max-first-argument': 'error',
    'pimsical-shopify-graphql/require-mutation-user-errors': 'error',
    'pimsical-shopify-graphql/require-query-page-info': 'warn',
  }
});
