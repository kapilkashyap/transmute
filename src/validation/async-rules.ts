/**
 * Async counterpart to sync-rules.ts, used only by validateAsync() so synchronous setters
 * stay untouched.
 */

import type { ModelConfig, ValidatorContext } from '../types';
import type { AsyncValidatorFn } from '../types';
import { isAsyncRuleMetadata, resolveConfiguredRule } from './rule-resolution';

export const validateAsyncRule = async function (
    modelConfig: ModelConfig,
    nameSpace: string | undefined,
    key: string,
    value: unknown,
    parentObject?: unknown,
    rootObject?: unknown,
    index?: number
): Promise<void> {
    if (modelConfig.asyncRules == null) {
        return;
    }

    const nsKey = nameSpace != null && nameSpace.trim().length > 0 ? `${nameSpace}.${key}` : undefined;

    // Resolve element and collection rules independently so both can apply to the same array.
    const elementResolution = resolveConfiguredRule(modelConfig.asyncRules, nameSpace, key);
    const collectionResolution = resolveConfiguredRule(modelConfig.asyncRules, nameSpace, key, '[]');
    const usedKey = elementResolution.usedKey;
    const configuredRule = elementResolution.rule;
    const collectionRule = collectionResolution.rule;
    const contextPath = nameSpace === 'root' ? key : (nsKey ?? key);

    const metadata = isAsyncRuleMetadata(configuredRule) ? configuredRule : undefined;
    const validator = typeof configuredRule === 'function' ? configuredRule : metadata?.validator;
    const collectionMetadata = isAsyncRuleMetadata(collectionRule) ? collectionRule : undefined;
    const collectionValidator = typeof collectionRule === 'function' ? collectionRule : collectionMetadata?.validator;

    if (metadata?.required === true && value == null) {
        throw new Error(`Validation error [${usedKey}]: Value is required`);
    }

    const validate = async (v: unknown, i?: number) => {
        const finalIndex = i ?? index ?? (parentObject as { getIndex?: () => number })?.getIndex?.();
        const context: ValidatorContext = {
            key,
            path: contextPath,
            value: v,
            parentObject,
            rootObject,
            index: finalIndex,
            getParent: () => parentObject,
            getRoot: () => rootObject
        };
        const validationResponse = await (validator as AsyncValidatorFn)(v, context);

        if (validationResponse !== true) {
            if (typeof validationResponse === 'string') {
                if (finalIndex != null) {
                    throw new Error(`Validation error at index ${finalIndex} [${usedKey}]: ${validationResponse}`);
                }
                throw new Error(`Validation error [${usedKey}]: ${validationResponse}`);
            }
            throw new Error(`Validation failed for property ${usedKey} with value ${v}`);
        }
    };

    const validateCollection = async (collectionValue: unknown) => {
        if (collectionMetadata?.required === true && collectionValue == null) {
            throw new Error(`Validation error [${collectionResolution.usedKey}]: Value is required`);
        }
        if (collectionValidator == null || collectionValue == null) {
            return;
        }
        const context: ValidatorContext = {
            key,
            path: contextPath,
            value: collectionValue,
            parentObject,
            rootObject,
            // Collection validators inspect the full array, so there is no element index.
            getParent: () => parentObject,
            getRoot: () => rootObject
        };
        const validationResponse = await collectionValidator(collectionValue, context);
        if (validationResponse !== true) {
            if (typeof validationResponse === 'string') {
                throw new Error(`Validation error [${collectionResolution.usedKey}]: ${validationResponse}`);
            }
            throw new Error(`Validation failed for property ${collectionResolution.usedKey} with value ${collectionValue}`);
        }
    };

    if (collectionRule != null) {
        await validateCollection(value);
    }

    // Collection-only async rules must run before returning when no element rule is configured.
    if (validator == null) {
        return;
    }

    if (Array.isArray(value)) {
        for (const [idx, v] of value.entries()) {
            await validate(v, idx);
        }
        return;
    }
    await validate(value);
};
