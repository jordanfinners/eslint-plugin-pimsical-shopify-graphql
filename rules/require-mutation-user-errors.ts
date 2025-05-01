import { Rule } from 'eslint';
import { SelectionSetNode } from 'graphql';
import { GraphQLESTreeNode } from '@graphql-eslint/eslint-plugin';

const hasUserErrors = (selectionSet: GraphQLESTreeNode<SelectionSetNode>) => {
  if (!selectionSet || !selectionSet.selections) {
    return false;
  }

  for (const selection of selectionSet.selections) {
    if ('name' in selection && selection.name?.value === 'userErrors') {
      return true;
    }
    if ('selectionSet' in selection
      && selection.selectionSet
      && hasUserErrors(selection.selectionSet)) {
      return true;
    }
  }

  return false;
}

export const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Checks that mutation operations include userErrors to ensure any potential mutation errors are captured.',
      recommended: true,
    },
    schema: [],
    messages: {
      requiredMutationUserErrors: 'Mutation must include userErrors.',
    }
  },
  create: (context: Rule.RuleContext) => {
    return {
      OperationDefinition(node) {
        if (node.operation === 'mutation' && !hasUserErrors(node.selectionSet)) {
          context.report({
            node,
            messageId: 'requiredMutationUserErrors',
          });
        }
      },
    };
  }
};
