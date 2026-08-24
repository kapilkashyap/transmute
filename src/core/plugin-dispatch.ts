/**
 * Generic plugin dispatch: the seam the core generator uses to reach every registered
 * ModelPlugin (the built-in validation plugin and any user-supplied plugins) without
 * knowing anything about rule/wildcard/error-formatting details.
 */

import type { DynamicClassInstance, ModelConfig, ModelPlugin, SetterPluginContext, ValidationIssue, ValidatorFn } from '../types';
import { BUILT_IN_VALIDATION_PLUGIN_NAME, createValidationPlugin } from '../validation/plugin';

// Fails fast on duplicate/reserved plugin names so dispatch order stays unambiguous.
export const assertUniquePluginNames = function (plugins: ModelPlugin[]): void {
    const seen = new Set<string>();
    plugins.forEach((plugin) => {
        if (plugin.name === BUILT_IN_VALIDATION_PLUGIN_NAME || seen.has(plugin.name)) {
            throw new Error(`Duplicate or reserved plugin name detected: ${plugin.name}`);
        }
        seen.add(plugin.name);
    });
};

// Setter-time dispatch: the built-in validation plugin runs first and is authoritative for
// rejecting the value, then any custom plugins observe/transform via their own onSet.
export const dispatchSetterPlugins = function (
    modelConfig: ModelConfig,
    nameSpace: string | undefined,
    key: string,
    value: unknown,
    validatorOverride: ValidatorFn | undefined,
    parentObject: unknown,
    rootObject: unknown,
    index: number | undefined,
    isUpdate: boolean
): void {
    const nsKey = nameSpace != null && nameSpace.trim().length > 0 ? `${nameSpace}.${key}` : undefined;
    const path = nameSpace === 'root' ? key : (nsKey ?? key);
    const context: SetterPluginContext = {
        key,
        path,
        value,
        parentObject,
        rootObject,
        index,
        nameSpace,
        isUpdate,
        validatorOverride,
        getParent: () => parentObject,
        getRoot: () => rootObject
    };

    createValidationPlugin(modelConfig).onSet?.(context, undefined);

    modelConfig.plugins.forEach((plugin) => {
        plugin.onSet?.(context, plugin.getConfig?.());
    });
};

export const runValidate = function (instance: DynamicClassInstance, modelConfig: ModelConfig): DynamicClassInstance {
    createValidationPlugin(modelConfig).onValidate?.(instance, undefined);
    modelConfig.plugins.forEach((plugin) => plugin.onValidate?.(instance, plugin.getConfig?.()));
    return instance;
};

export const runValidateAsync = async function (instance: DynamicClassInstance, modelConfig: ModelConfig): Promise<DynamicClassInstance> {
    await createValidationPlugin(modelConfig).onValidateAsync?.(instance, undefined);
    for (const plugin of modelConfig.plugins) {
        await plugin.onValidateAsync?.(instance, plugin.getConfig?.());
    }
    return instance;
};

export const runCollectErrors = function (instance: DynamicClassInstance, modelConfig: ModelConfig): ValidationIssue[] {
    const errors = createValidationPlugin(modelConfig).onCollectErrors?.(instance, undefined) ?? [];
    modelConfig.plugins.forEach((plugin) => {
        if (plugin.onCollectErrors) {
            errors.push(...plugin.onCollectErrors(instance, plugin.getConfig?.()));
        }
    });
    return errors;
};

export const runCollectErrorsAsync = async function (instance: DynamicClassInstance, modelConfig: ModelConfig): Promise<ValidationIssue[]> {
    const errors = (await createValidationPlugin(modelConfig).onCollectErrorsAsync?.(instance, undefined)) ?? [];
    for (const plugin of modelConfig.plugins) {
        if (plugin.onCollectErrorsAsync) {
            errors.push(...(await plugin.onCollectErrorsAsync(instance, plugin.getConfig?.())));
        }
    }
    return errors;
};
