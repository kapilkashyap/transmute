/**
 * Dynamically transforms JSON objects into runtime models with private properties,
 * accessor methods, context-aware validation, and per-model configuration.
 * @author: Kapil Kashyap
 *
 * This file is the public entry point only. Generation and plugin-dispatch internals
 * live under ./core, rule/graph validation lives under ./validation, and shared
 * types/helpers live in ./types, ./utils, and ./validators.
 */

/*** IMPLEMENTATION (see ./types, ./utils, ./validators, ./validation, ./core) ***/
import { CLASSNAME, generateDynamicClassInstance } from './core/generator';
import { assertUniquePluginNames } from './core/plugin-dispatch';
import { convertToJSON } from './core/serialization';
import { ERRORS, capitalize, getTypeOfObject, hasObjectMetaInfo, normalize, normalizeConfig, randomNumber } from './utils';
import type { Config, IStringIndex } from './types';

export function transmute(o: IStringIndex, config?: Config, className?: string): IStringIndex {
    if (getTypeOfObject(o) !== 'object') {
        throw ERRORS.JSON_EXPECTED;
    }
    const modelConfig = normalizeConfig(config);
    assertUniquePluginNames(modelConfig.plugins);
    // return the transmuted JSON with private properties and accessor methods
    const instance = generateDynamicClassInstance(
        capitalize(normalize(className ?? `${CLASSNAME}${randomNumber()}`)),
        o,
        'root',
        undefined,
        undefined,
        undefined,
        modelConfig
    );
    // Keep the root instance as its own root reference so every nested model can
    // access the complete transmuted object graph through ValidatorContext.getRoot().
    instance.setInternalReferences(instance, instance, undefined);
    if (modelConfig.validateOnCreate) {
        instance.validate();
    }
    return instance;
}

export function unTransmute(o: unknown | unknown[]): IStringIndex | IStringIndex[] {
    if (Array.isArray(o)) {
        if (o.length > 0) {
            return o.map((entry) => {
                if (hasObjectMetaInfo(entry)) {
                    return convertToJSON(entry, entry.getMetaInfo());
                }
                throw ERRORS.META_INFO_MISSING;
            });
        }
    }
    if (getTypeOfObject(o) === 'object') {
        if (hasObjectMetaInfo(o)) {
            return convertToJSON(o, o.getMetaInfo());
        }
        throw ERRORS.META_INFO_MISSING;
    }
    throw ERRORS.TRANSMUTED_OBJECT_EXPECTED;
}

/*** Public re-exports: validator combinators, memory utility, and shared types ***/
export { allOf, anyOf } from './validators';
export { memorySizeOf } from './utils';
export type {
    AsyncRule,
    AsyncRuleMetadata,
    AsyncValidatorFn,
    Config,
    DynamicClassConstructor,
    DynamicClassInstance,
    GetterFn,
    GetterFnArray,
    IStringIndex,
    MetaInfo,
    ModelConfig,
    ModelPlugin,
    ObjectMetaInfo,
    Rule,
    RuleMetadata,
    SetterPluginContext,
    UpdateRulesOptions,
    ValidateAsyncRuleFn,
    ValidateOptions,
    ValidateRuleFn,
    ValidationIssue,
    ValidationResult,
    ValidatorContext,
    ValidatorFn
} from './types';
