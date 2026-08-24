/**
 * Whole-model (recursive) validation built on top of the per-property rule checks.
 * These functions only rely on the generated instance's public shape (getMetaInfo, getters,
 * utility.validateRule/validateAsyncRule) so they have no direct dependency on the generator.
 */

import type { DynamicClassInstance, GetterFn, ValidateAsyncRuleFn, ValidateRuleFn, ValidationIssue, ValidationResult } from '../types';
import { capitalize, getTypeOfObject, hasObjectMetaInfo, normalize } from '../utils';

const getObjectGraphKeys = function (instance: DynamicClassInstance): string[] {
    const metaInfo = instance.getMetaInfo();
    return [
        ...(metaInfo.primitiveKeys != null && metaInfo.primitiveKeys.length > 0 ? metaInfo.primitiveKeys.split(',') : []),
        ...(metaInfo.objectKeys != null && metaInfo.objectKeys.length > 0 ? metaInfo.objectKeys.split(',') : []),
        ...(metaInfo.arrayKeys != null && metaInfo.arrayKeys.length > 0 ? metaInfo.arrayKeys.split(',') : [])
    ].filter(Boolean);
};

export const validateObjectGraph = function (instance: DynamicClassInstance): DynamicClassInstance {
    const keys = getObjectGraphKeys(instance);

    keys.forEach((key) => {
        const getter = `get${capitalize(normalize(key))}`;
        if (typeof instance[getter] !== 'function') {
            return;
        }

        const typedInstance = instance as DynamicClassInstance & {
            getNameSpace: () => string;
            getRoot: () => unknown;
            utility: {
                typeMap?: Record<string, string>;
                elementTypeMap?: Record<string, string[]>;
                getTypeOfObject: typeof getTypeOfObject;
                validateRule: ValidateRuleFn;
            };
        };

        const value = (instance[getter] as GetterFn)();
        const expectedType = typedInstance.utility.typeMap?.[key] ?? null;
        const actualType = typedInstance.utility.getTypeOfObject(value);

        if (expectedType != null && actualType !== expectedType) {
            throw new Error(`Type mismatch: argument of type ${expectedType} expected but got ${actualType} instead`);
        }

        typedInstance.utility.validateRule(typedInstance.getNameSpace(), key, value, undefined, typedInstance, typedInstance.getRoot());

        if (Array.isArray(value)) {
            const elementTypes = typedInstance.utility.elementTypeMap?.[key];
            value.forEach((item, itemIndex) => {
                const expectedElementType = elementTypes?.[itemIndex];
                const actualElementType = typedInstance.utility.getTypeOfObject(item);
                if (expectedElementType != null && actualElementType !== expectedElementType) {
                    throw new Error(
                        `Type mismatch at index ${itemIndex} [${key}]: argument of type ${expectedElementType} expected but got ${actualElementType} instead`
                    );
                }
                if (item != null && typeof item === 'object' && hasObjectMetaInfo(item)) {
                    (item as DynamicClassInstance).validate();
                }
            });
            return;
        }

        if (value != null && typeof value === 'object' && hasObjectMetaInfo(value)) {
            (value as DynamicClassInstance).validate();
        }
    });

    return instance;
};

/* Async counterpart to validateObjectGraph: runs the same sync checks first, then awaits any configured async rules */
export const validateObjectGraphAsync = async function (instance: DynamicClassInstance): Promise<DynamicClassInstance> {
    validateObjectGraph(instance);

    const keys = getObjectGraphKeys(instance);

    for (const key of keys) {
        const getter = `get${capitalize(normalize(key))}`;
        if (typeof instance[getter] !== 'function') {
            continue;
        }

        const typedInstance = instance as DynamicClassInstance & {
            getNameSpace: () => string;
            getRoot: () => unknown;
            utility: {
                validateAsyncRule: ValidateAsyncRuleFn;
            };
        };

        const value = (instance[getter] as GetterFn)();
        await typedInstance.utility.validateAsyncRule(typedInstance.getNameSpace(), key, value, typedInstance, typedInstance.getRoot());

        if (Array.isArray(value)) {
            for (const item of value) {
                if (
                    item != null &&
                    typeof item === 'object' &&
                    hasObjectMetaInfo(item) &&
                    typeof (item as DynamicClassInstance).validateAsync === 'function'
                ) {
                    await (item as DynamicClassInstance).validateAsync();
                }
            }
            continue;
        }

        if (
            value != null &&
            typeof value === 'object' &&
            hasObjectMetaInfo(value) &&
            typeof (value as DynamicClassInstance).validateAsync === 'function'
        ) {
            await (value as DynamicClassInstance).validateAsync();
        }
    }

    return instance;
};

/* Non-throwing counterpart to validateObjectGraph: collects every failure instead of stopping at the first one */
export const collectObjectGraphErrors = function (instance: DynamicClassInstance): ValidationIssue[] {
    const errors: ValidationIssue[] = [];
    const keys = getObjectGraphKeys(instance);

    keys.forEach((key) => {
        const getter = `get${capitalize(normalize(key))}`;
        if (typeof instance[getter] !== 'function') {
            return;
        }

        const typedInstance = instance as DynamicClassInstance & {
            getNameSpace: () => string;
            getRoot: () => unknown;
            utility: {
                typeMap?: Record<string, string>;
                elementTypeMap?: Record<string, string[]>;
                getTypeOfObject: typeof getTypeOfObject;
                validateRule: ValidateRuleFn;
            };
        };

        const nameSpace = typedInstance.getNameSpace();
        const path = nameSpace === 'root' || nameSpace == null ? key : `${nameSpace}.${key}`;
        const value = (instance[getter] as GetterFn)();
        const expectedType = typedInstance.utility.typeMap?.[key] ?? null;
        const actualType = typedInstance.utility.getTypeOfObject(value);

        if (expectedType != null && actualType !== expectedType) {
            errors.push({ path, key, message: `Type mismatch: argument of type ${expectedType} expected but got ${actualType} instead` });
        }

        try {
            typedInstance.utility.validateRule(nameSpace, key, value, undefined, typedInstance, typedInstance.getRoot());
        } catch (error) {
            errors.push({ path, key, message: error instanceof Error ? error.message : String(error) });
        }

        if (Array.isArray(value)) {
            const elementTypes = typedInstance.utility.elementTypeMap?.[key];
            value.forEach((item, itemIndex) => {
                const expectedElementType = elementTypes?.[itemIndex];
                const actualElementType = typedInstance.utility.getTypeOfObject(item);
                if (expectedElementType != null && actualElementType !== expectedElementType) {
                    errors.push({
                        path,
                        key,
                        index: itemIndex,
                        message: `Type mismatch at index ${itemIndex} [${key}]: argument of type ${expectedElementType} expected but got ${actualElementType} instead`
                    });
                }
                if (
                    item != null &&
                    typeof item === 'object' &&
                    hasObjectMetaInfo(item) &&
                    typeof (item as DynamicClassInstance).validate === 'function'
                ) {
                    errors.push(...((item as DynamicClassInstance).validate({ collectErrors: true }) as ValidationResult).errors);
                }
            });
            return;
        }

        if (
            value != null &&
            typeof value === 'object' &&
            hasObjectMetaInfo(value) &&
            typeof (value as DynamicClassInstance).validate === 'function'
        ) {
            errors.push(...((value as DynamicClassInstance).validate({ collectErrors: true }) as ValidationResult).errors);
        }
    });

    return errors;
};

/* Non-throwing counterpart to validateObjectGraphAsync: collects sync and async rule failures in a single recursive pass */
export const collectObjectGraphErrorsAsync = async function (instance: DynamicClassInstance): Promise<ValidationIssue[]> {
    const errors: ValidationIssue[] = [];
    const keys = getObjectGraphKeys(instance);

    for (const key of keys) {
        const getter = `get${capitalize(normalize(key))}`;
        if (typeof instance[getter] !== 'function') {
            continue;
        }

        const typedInstance = instance as DynamicClassInstance & {
            getNameSpace: () => string;
            getRoot: () => unknown;
            utility: {
                typeMap?: Record<string, string>;
                elementTypeMap?: Record<string, string[]>;
                getTypeOfObject: typeof getTypeOfObject;
                validateRule: ValidateRuleFn;
                validateAsyncRule: ValidateAsyncRuleFn;
            };
        };

        const nameSpace = typedInstance.getNameSpace();
        const path = nameSpace === 'root' || nameSpace == null ? key : `${nameSpace}.${key}`;
        const value = (instance[getter] as GetterFn)();
        const expectedType = typedInstance.utility.typeMap?.[key] ?? null;
        const actualType = typedInstance.utility.getTypeOfObject(value);

        if (expectedType != null && actualType !== expectedType) {
            errors.push({ path, key, message: `Type mismatch: argument of type ${expectedType} expected but got ${actualType} instead` });
        }

        try {
            typedInstance.utility.validateRule(nameSpace, key, value, undefined, typedInstance, typedInstance.getRoot());
        } catch (error) {
            errors.push({ path, key, message: error instanceof Error ? error.message : String(error) });
        }

        try {
            await typedInstance.utility.validateAsyncRule(nameSpace, key, value, typedInstance, typedInstance.getRoot());
        } catch (error) {
            errors.push({ path, key, message: error instanceof Error ? error.message : String(error) });
        }

        if (Array.isArray(value)) {
            const elementTypes = typedInstance.utility.elementTypeMap?.[key];
            for (const [itemIndex, item] of value.entries()) {
                const expectedElementType = elementTypes?.[itemIndex];
                const actualElementType = typedInstance.utility.getTypeOfObject(item);
                if (expectedElementType != null && actualElementType !== expectedElementType) {
                    errors.push({
                        path,
                        key,
                        index: itemIndex,
                        message: `Type mismatch at index ${itemIndex} [${key}]: argument of type ${expectedElementType} expected but got ${actualElementType} instead`
                    });
                }
                if (
                    item != null &&
                    typeof item === 'object' &&
                    hasObjectMetaInfo(item) &&
                    typeof (item as DynamicClassInstance).validateAsync === 'function'
                ) {
                    const nestedResult = (await (item as DynamicClassInstance).validateAsync({ collectErrors: true })) as ValidationResult;
                    errors.push(...nestedResult.errors);
                }
            }
            continue;
        }

        if (
            value != null &&
            typeof value === 'object' &&
            hasObjectMetaInfo(value) &&
            typeof (value as DynamicClassInstance).validateAsync === 'function'
        ) {
            const nestedResult = (await (value as DynamicClassInstance).validateAsync({ collectErrors: true })) as ValidationResult;
            errors.push(...nestedResult.errors);
        }
    }

    return errors;
};
