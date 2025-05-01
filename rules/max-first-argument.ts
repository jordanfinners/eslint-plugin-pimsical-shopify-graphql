import { Rule } from 'eslint';

export const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Checks the argument `first` is less than Shopifys specified maximum.',
      recommended: true,
    },
    schema: [],
    messages: {
      maxFirstArgument: '`first` argument must be less than 250.',
    }
  },
  create: (context: Rule.RuleContext) => {
    return {
      Argument(node) {
        if (node.name.value !== 'first') {
          return;
        }

        if (
          node.value.kind === 'IntValue' &&
          Number.parseInt(node.value.value, 10) > 250
        ) {
          context.report({
            node,
            messageId: 'maxFirstArgument',
          });
        }
      },
    };
  }
};
