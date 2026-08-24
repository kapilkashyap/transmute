/**
 * The validation module's ModelPlugin: wraps the existing rule/type validation
 * implementation (./sync-rules, ./object-graph) behind the generic ModelPlugin
 * contract so it dispatches through the same seams as any custom plugin.
 */

import type { ModelConfig, ModelPlugin, SetterPluginContext } from '../types';
import { collectObjectGraphErrors, collectObjectGraphErrorsAsync, validateObjectGraph, validateObjectGraphAsync } from './object-graph';
import { validateRule } from './sync-rules';

export const BUILT_IN_VALIDATION_PLUGIN_NAME = 'transmute.validation';

// The default validation behavior (rules/asyncRules/validateInput/validateOnCreate),
// reimplemented behind the generic ModelPlugin contract.
export const createValidationPlugin = function (modelConfig: ModelConfig): ModelPlugin {
    return {
        name: BUILT_IN_VALIDATION_PLUGIN_NAME,
        onSet: (context: SetterPluginContext) => {
            validateRule(
                modelConfig,
                context.nameSpace,
                context.key,
                context.value,
                context.validatorOverride,
                context.parentObject,
                context.rootObject,
                context.index,
                context.isUpdate
            );
        },
        onValidate: (instance) => {
            validateObjectGraph(instance);
        },
        onValidateAsync: async (instance) => {
            await validateObjectGraphAsync(instance);
        },
        onCollectErrors: (instance) => collectObjectGraphErrors(instance),
        onCollectErrorsAsync: (instance) => collectObjectGraphErrorsAsync(instance)
    };
};
