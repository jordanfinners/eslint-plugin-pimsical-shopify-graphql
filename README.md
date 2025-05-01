# eslint-plugin-pimsical-shopify-graphql

This is an ESLint plugin to help check Shopify GraphQL queries follow best practice. Built by a Shopify Partner.

It is designed to work alongside [`@graphql-eslint/eslint-plugin`](https://the-guild.dev/graphql/eslint/docs)

## Install

```sh
npm i -D eslint-plugin-pimsical-shopify-graphql @graphql-eslint/eslint-plugin
```

## Usage

If you're using the new flat config files, add to your `eslint.config.js`.

If you have GraphQL queries inside TypeScript files, you can use the `graphql-eslint` processor to lint them, like so:

```ts
import graphqlPlugin from '@graphql-eslint/eslint-plugin'
import shopifyGraphqlPlugin from 'eslint-plugin-pimsical-shopify-graphql';

export default [
  {
    files: ['**/*.ts'],
    processor: graphqlPlugin.processor
  },
  {
    files: ['**/*.graphql'],
    languageOptions: {
      parser: graphqlPlugin.parser
    },
    plugins: {
      '@graphql-eslint': graphqlPlugin,
      shopifyGraphql: shopifyGraphqlPlugin,
    },
    rules: {
      ...graphqlPlugin.configs['flat/operations-all'].rules,
      ...shopifyGraphql.configs['flat/recommended'].rules,
    },
  },
];
```

If you have GraphQL queries are in `.graphql` files:

```ts
import graphqlPlugin from '@graphql-eslint/eslint-plugin'
import shopifyGraphqlPlugin from 'eslint-plugin-pimsical-shopify-graphql';

export default [
  {
    files: ['**/*.graphql'],
    languageOptions: {
      parser: graphqlPlugin.parser
    },
    plugins: {
      '@graphql-eslint': graphqlPlugin,
      shopifyGraphql: shopifyGraphqlPlugin,
    },
    rules: {
      ...graphqlPlugin.configs['flat/operations-all'].rules,
      ...shopifyGraphql.configs['flat/recommended'].rules,
    }
  },
];
```

## Rules

### `pimsical-shopify-graphql/max-first-argument`

This rule checks that the first argument of a query is not greater than 250. This is to ensure that queries adhere to Shopify's maximum page size.

#### Examples

##### Correct

```graphql
query getVariants($cursor: String) {
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
}
```

##### Incorrect

```graphql
query getVariants($cursor: String) {
  productVariants(first: 300, after: $cursor) {
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
}
```

### `pimsical-shopify-graphql/require-mutation-user-errors`

This rule checks that any mutations contain userErrors, this is how Shopify returns errors from your mutation input.

#### Examples

##### Correct

```graphql
mutation inventoryAdjustQuantities($input: InventoryAdjustQuantitiesInput!) {
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
}
```

##### Incorrect

```graphql
mutation inventoryAdjustQuantities($input: InventoryAdjustQuantitiesInput!) {
  inventoryAdjustQuantities(input: $input) {
    inventoryAdjustmentGroup {
      createdAt
      reason
    }
  }
}
```

### `pimsical-shopify-graphql/require-query-page-info`

This rule checks that if first or after arguments are used in a query, it also has a `pageInfo` block so you can check if there are more pages or paginate through the results.

#### Examples

##### Correct

```graphql
query getVariants($cursor: String) {
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
}
```

##### Incorrect

```graphql
query getVariants($cursor: String) {
  productVariants(first: 300, after: $cursor) {
    edges {
      node {
        id
      }
    }
  }
}
```

## License

MIT
