/**
 * Rule-key resolution: matching wildcard/collection rule keys to a namespaced property path.
 */

import type { AsyncRule, AsyncRuleMetadata, Rule, RuleMetadata } from '../types';

/* Match a dot-separated rule path against a pattern where '*' stands in for exactly one segment */
export const matchesWildcardPath = function (pattern: string, path: string): boolean {
    const patternSegments = pattern.split('.');
    const pathSegments = path.split('.');
    if (patternSegments.length !== pathSegments.length) {
        return false;
    }
    return patternSegments.every((segment, i) => segment === '*' || segment === pathSegments[i]);
};

/* Find the first configured rule key whose wildcard pattern matches the given namespaced path */
export const findWildcardRuleKey = function <T>(rules: Record<string, T>, nsKey: string): string | undefined {
    return Object.keys(rules).find((ruleKey) => ruleKey.includes('*') && matchesWildcardPath(ruleKey, nsKey));
};

export const resolveConfiguredRule = function <T>(rules: Record<string, T>, nameSpace: string | undefined, key: string, suffix = '') {
    // Resolve exact, wildcard, and optional [] collection keys while preserving the key used in errors.
    const namespacedKey = nameSpace != null && nameSpace.trim().length > 0 ? `${nameSpace}.${key}` : undefined;
    const fullKey = namespacedKey != null ? `${namespacedKey}${suffix}` : `${key}${suffix}`;
    const wildcardKey = namespacedKey != null ? findWildcardRuleKey(rules, `${namespacedKey}${suffix}`) : undefined;
    if (namespacedKey != null && rules[`${namespacedKey}${suffix}`] != null) {
        return { rule: rules[`${namespacedKey}${suffix}`], usedKey: `${namespacedKey}${suffix}` };
    }
    if (wildcardKey != null) {
        return { rule: rules[wildcardKey], usedKey: `${namespacedKey}${suffix}` };
    }
    if (rules[`${key}${suffix}`] != null) {
        return { rule: rules[`${key}${suffix}`], usedKey: `${key}${suffix}` };
    }
    return { rule: undefined, usedKey: fullKey };
};

export const isRuleMetadata = (rule: Rule | undefined): rule is RuleMetadata => typeof rule === 'object' && rule != null;
export const isAsyncRuleMetadata = (rule: AsyncRule | undefined): rule is AsyncRuleMetadata => typeof rule === 'object' && rule != null;
