import { RuleTester } from 'eslint';
import graphqlPlugin from '@graphql-eslint/eslint-plugin';
import { rule } from './max-first-argument.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: graphqlPlugin.parser,
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2022
    }
  }
});

ruleTester.run('max-first-argument', rule, {
  valid: [
    `query getVariants($cursor: String) {
        productVariants(first: 10, after: $cursor) {
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
        productVariants(first: 300, after: $cursor) {
          edges {
            node {
              id
            }
          }
        }
      }`,
      errors: [{
        messageId: 'maxFirstArgument',
      }],
    }
  ],
});
