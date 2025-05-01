import { RuleTester } from 'eslint';
import graphqlPlugin from '@graphql-eslint/eslint-plugin';
import { rule } from './require-query-page-info.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: graphqlPlugin.parser,
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2022
    }
  }
});

ruleTester.run('require-query-page-info', rule, {
  valid: [
    `query getVariants($cursor: String) {
      productVariants(first: 100, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
          }
        }
      }
    }`,
  ],
  invalid: [
    {
      code: `query getVariants($cursor: String) {
        productVariants(first: 100, after: $cursor) {
          edges {
            node {
              id
            }
          }
        }
      }`,
      errors: [{
        messageId: 'requiredPageInfo',
      }],
    }
  ],
});
