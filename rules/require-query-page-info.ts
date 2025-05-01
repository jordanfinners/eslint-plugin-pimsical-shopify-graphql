import { Rule } from 'eslint';
import { ArgumentNode, SelectionNode } from 'graphql';

export const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Checks that any queries with `first` or `after` arguments also have `pageInfo` block so you know if there are more pages.',
      recommended: true,
    },
    schema: [],
    messages: {
      requiredPageInfo: 'Fields with "after" or "first" arguments must include "pageInfo" in the selection set.',
    }
  },
  create: (context: Rule.RuleContext) => {
    return {
      Field(node) {
        const hasAfterArgument = node.arguments.some(
          (arg: ArgumentNode) => arg.name.value === 'after'
        );
        const hasFirstArgument = node.arguments.some(
          (arg: ArgumentNode) => arg.name.value === 'first'
        );
        const hasPageInfo = node.selectionSet?.selections.some(
          (selection: SelectionNode) =>
            selection.kind === 'Field' && selection.name.value === 'pageInfo'
        );

        if ((hasAfterArgument || hasFirstArgument) && !hasPageInfo) {
          context.report({
            node,
            messageId: 'requiredPageInfo',
          });
        }
      },
    };
  }
};
