/**
 * Synchronous rule/type validation for a single property (used by generated setters and
 * full-model validation). This is the core logic behind the built-in validation plugin.
 */

import type { ModelConfig, ValidatorContext, ValidatorFn } from '../types';
import { capitalize, normalize } from '../utils';
import { isRuleMetadata, resolveConfiguredRule } from './rule-resolution';

/* Validate rule for a property */
export const validateRule = function (
    modelConfig: ModelConfig,
    nameSpace: string | undefined,
    key: string,
    value: unknown,
    validator?: ValidatorFn,
    parentObject?: unknown,
    rootObject?: unknown,
    index?: number,
    isUpdate = false
) {
    if (modelConfig.rules != null) {
        const nsKey = nameSpace != null && nameSpace.trim().length > 0 ? `${nameSpace}.${key}` : undefined;

        // Resolve element and collection rules independently so both can apply to the same array.
        const elementResolution = resolveConfiguredRule(modelConfig.rules, nameSpace, key);
        const collectionResolution = resolveConfiguredRule(modelConfig.rules, nameSpace, key, '[]');
        const usedKey = elementResolution.usedKey;
        const configuredRule = elementResolution.rule;
        const collectionRule = collectionResolution.rule;
        const contextPath = nameSpace === 'root' ? key : (nsKey ?? key);

        const metadata = isRuleMetadata(configuredRule) ? configuredRule : undefined;
        validator = validator ?? (typeof configuredRule === 'function' ? configuredRule : metadata?.validator);
        const collectionMetadata = isRuleMetadata(collectionRule) ? collectionRule : undefined;
        const collectionValidator = typeof collectionRule === 'function' ? collectionRule : collectionMetadata?.validator;

        const throwValidationError = (message: string, errorIndex?: number) => {
            if (errorIndex != null) {
                throw new Error(`Validation error at index ${errorIndex} [${usedKey}]: ${message}`);
            }
            throw new Error(`Validation error [${usedKey}]: ${message}`);
        };

        if (metadata?.required === true && value == null) {
            throwValidationError('Value is required', index);
        }

        // Immutable rules apply only to setter updates so unchanged values remain valid during model validation.
        if (metadata?.immutable === true && isUpdate) {
            const getter = `get${capitalize(normalize(key))}`;
            const currentValue =
                parentObject != null && typeof parentObject === 'object' && getter in parentObject
                    ? (parentObject as Record<string, unknown>)[getter]
                    : undefined;
            const previousValue = typeof currentValue === 'function' ? (currentValue as () => unknown).call(parentObject) : undefined;
            const valueToCompare = index != null && Array.isArray(previousValue) ? previousValue[index] : previousValue;
            if (!Object.is(valueToCompare, value)) {
                throwValidationError('Property is immutable', index);
            }
        }

        const validate = (v: unknown, i?: number) => {
            if (validator != null) {
                const finalIndex = i ?? index ?? (parentObject as { getIndex?: () => number })?.getIndex?.();
                // Pass the value together with its location and object-graph references
                // so validators can enforce rules involving sibling, parent, root, or array data.
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
                const validationResponse = validator(v, context);

                if (validationResponse !== true) {
                    if (typeof validationResponse === 'string') {
                        const errorIndex = i ?? index ?? (parentObject as { getIndex?: () => number })?.getIndex?.();
                        if (errorIndex != null) {
                            throw new Error(`Validation error at index ${errorIndex} [${usedKey}]: ${validationResponse}`);
                        }
                        throw new Error(`Validation error [${usedKey}]: ${validationResponse}`);
                    }
                    throw new Error(`Validation failed for property ${usedKey} with value ${v}`);
                }
            }
        };

        const validateCollection = (collectionValue: unknown) => {
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
            const validationResponse = collectionValidator(collectionValue, context);
            if (validationResponse !== true) {
                if (typeof validationResponse === 'string') {
                    throw new Error(`Validation error [${collectionResolution.usedKey}]: ${validationResponse}`);
                }
                throw new Error(`Validation failed for property ${collectionResolution.usedKey} with value ${collectionValue}`);
            }
        };

        if (collectionRule != null) {
            let collectionValue = value;
            if (index != null && parentObject != null && typeof parentObject === 'object') {
                // Validate the array state that would exist after an indexed update without mutating it first.
                const getter = `get${capitalize(normalize(key))}`;
                const currentValue = (parentObject as Record<string, unknown>)[getter];
                const currentArray = typeof currentValue === 'function' ? (currentValue as () => unknown[]).call(parentObject) : undefined;
                if (Array.isArray(currentArray)) {
                    collectionValue = currentArray.map((item, itemIndex) => (itemIndex === index ? value : item));
                }
            }
            validateCollection(collectionValue);
        }

        if (validator != null && typeof validator === 'function' && value != null) {
            if (Array.isArray(value)) {
                value.forEach((v, idx) => validate(v, idx));
                return;
            }
            validate(value);
        }
    }
};
