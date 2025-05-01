import { RuleTester } from 'eslint';
import graphqlPlugin from '@graphql-eslint/eslint-plugin';
import { rule } from './require-mutation-user-errors.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: graphqlPlugin.parser,
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2022
    }
  }
});

ruleTester.run('require-mutation-user-errors', rule, {
  valid: [
    `mutation inventoryAdjustQuantities($input: InventoryAdjustQuantitiesInput!) {
      inventoryAdjustQuantities(input: $input) {
        userErrors {
          field
          message
        }
        inventoryAdjustmentGroup {
          createdAt
          reason
        }
      }
    }`,
  ],
  invalid: [
    {
      code: `mutation inventoryAdjustQuantities($input: InventoryAdjustQuantitiesInput!) {
        inventoryAdjustQuantities(input: $input) {
          inventoryAdjustmentGroup {
            createdAt
            reason
          }
        }
      }`,
      errors: [{
        messageId: 'requiredMutationUserErrors',
      }],
    }
  ],
});
