import type { Rule, ESLint } from 'eslint';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { configFactory as configRecommended } from './configs/recommended.js';
import { rule as maxFirstArgumentRule } from './rules/max-first-argument.js';
import { rule as requireMutationUserErrorsRule } from './rules/require-mutation-user-errors.js';
import { rule as requireQueryPageInfoRule } from './rules/require-query-page-info.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { name, version } = JSON.parse(
  readFileSync(path.resolve(__dirname, '../package.json'), 'utf8')
);

export const rules: Record<string, Rule.RuleModule> = {
  'max-first-argument': maxFirstArgumentRule,
  'require-mutation-user-errors': requireMutationUserErrorsRule,
  'require-query-page-info': requireQueryPageInfoRule,
};

const plugin: ESLint.Plugin = {
  meta: { name, version },
  rules
};

export const configs = {
  'flat/recommended': configRecommended(plugin)
};

plugin.configs = configs;

export default plugin;
