# eslint-plugin-pimsical-shopify-graphql

This is an ESLint plugin to help check Shopify GraphQL queries follow best practice. Built by [Pimsical](https://www.pimsical.app/), a Shopify Partner.

It is designed to work alongside [`@graphql-eslint/eslint-plugin`](https://the-guild.dev/graphql/eslint/docs)

## TLDR;

- [Installation](#Installation)
- [Usage](#Usage)
- [Usage with queries in code files](#queries-in-code)
- [Usage in graphql files](#queries-in-.graphql-files)
- [Combining with GraphQL Schema](#shopify-graphql-schema)
- [Rules](#Rules)

## Installation

```sh
npm i -D eslint-plugin-pimsical-shopify-graphql @graphql-eslint/eslint-plugin
```

## Usage

You need to be using [`eslint` flat config files](https://eslint.org/docs/latest/use/configure/migration-guide), then we will need to add some config to your `eslint.config.js`.

There are two ways to use this plugin, depending on where your GraphQL queries are located.

### Queries in code

If you have GraphQL queries inside TypeScript or JavaScript files, you can use the `graphql-eslint` processor to allow us to lint them. Here is an example for a TypeScript project like so (or change the file extensions to match your project):

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

The `graphql-eslint` processor will pick up any GraphQL queries inside your TypeScript or JavaScript files, and convert them to `.graphql` files _in memory only_ allowing us to lint them.
It will pick up any queries inside `gql` or `graphql` tagged template literals, or beginning with the comment `/* GraphQL */` before the query by default.
To make the tools work more seamlessly and improve linting we recommend integrating with [Shopify GraphQL Codegen below](#shopify-graphql-schema).

### Queries in `.graphql` files

If you have GraphQL queries are in `.graphql` files already, you don't need the processor so your config can work like so:

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

### Shopify GraphQL Schema

The linters work **best** combined with knowledge about Shopify GraphQL Schema, there are two ways to configure this:

If you are already using [Shopify GraphQL Codegen](https://www.npmjs.com/package/@shopify/api-codegen-preset), this does a lot of the work for us and is our recommended approach.
In your `.graphqlrc.ts` or equivalent JS file, ensure that `pluckConfig` is exposed in the default `extensions` object. This will allow the linters to pick up the GraphQL code from your codebase using the same prefix as the codegen tools, it also uses the schemas from here as well.

```ts
import { shopifyApiProject, ApiType } from '@shopify/api-codegen-preset';

const apiVersion = '2025-04';
const config = shopifyApiProject({
  apiType: ApiType.Admin,
  apiVersion: apiVersion,
  documents: ['./**/*.{js,ts,jsx,tsx}'],
  outputDir: './shopify/types',
})

export default {
  schema: `https://shopify.dev/admin-graphql-direct-proxy/${apiVersion}`,
  documents: ['./**/*.{js,ts,jsx,tsx}'],
  projects: {
    default: {
      ...config,
      extensions: {
        ...config.extensions,
        pluckConfig: config.extensions?.codegen?.pluckConfig,
      },
    },
  },
};
```

### Manually defined schema

If you are not using the codegen tools, you can manually define the schema in your `eslint.config.js` under `parserOptions` or add an equivalent [Graphql Config file](https://the-guild.dev/graphql/config/docs/user/usage) which will automatically get picked up.

```js
import js from '@eslint/js';
import graphqlPlugin from '@graphql-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.graphql'],
    languageOptions: {
      parser: graphqlPlugin.parser,
      parserOptions: {
        graphQLConfig: {
          schema: `https://shopify.dev/admin-graphql-direct-proxy/2025-04`,
          documents: [['./**/*.{js,ts,jsx,tsx,graphql}']],
        },
      },
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
