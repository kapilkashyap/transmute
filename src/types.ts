/**
 * Public and internal type/interface declarations shared across the modularized source tree.
 */

import type { getTypeOfObject } from './utils';

export type IStringIndex = Record<string, unknown>;

export interface MetaInfo {
    primitiveKeys: string;
    objectKeys: string;
    arrayKeys: string;
}

export type ObjectMetaInfo = {
    getMetaInfo: () => MetaInfo;
};

export type GetterFn = () => unknown;

export type GetterFnArray = () => unknown[];

export type ValidatorContext = {
    key: string; // Property name (e.g., "password")
    path: string; // Full namespaced path (e.g., "root.account.password")
    value: unknown; // The value being validated
    parentObject?: unknown; // The immediate parent object
    rootObject?: unknown; // The root transmuted object
    index?: number; // Array index if validating array element
    getParent: () => unknown; // Function to safely access parent
    getRoot: () => unknown; // Function to safely access root
};

export type ValidatorFn = (value: unknown, context: ValidatorContext) => boolean | string;

export type RuleMetadata = {
    // Rejects null and undefined values.
    required?: boolean;

    // Allows the initial value but prevents later setter changes.
    immutable?: boolean;

    // Applies custom validation alongside the metadata constraints.
    validator?: ValidatorFn;
};

export type Rule = ValidatorFn | RuleMetadata;

export type AsyncValidatorFn = (value: unknown, context: ValidatorContext) => boolean | string | Promise<boolean | string>;

export type AsyncRuleMetadata = {
    // Rejects null and undefined values during asynchronous validation.
    required?: boolean;

    // Applies custom synchronous or asynchronous validation.
    validator?: AsyncValidatorFn;
};

export type AsyncRule = AsyncValidatorFn | AsyncRuleMetadata;

export type ValidationIssue = {
    path: string; // Namespaced path of the offending property (e.g. "root.account.password")
    key: string; // Property name
    message: string; // Human-readable failure reason
    index?: number; // Array index, when the failure is on a specific array element
};

export type ValidationResult = {
    valid: boolean;
    errors: ValidationIssue[];
};

export type ValidateOptions = {
    collectErrors?: boolean;
};

// Extra plugin-only fields layered onto ValidatorContext so setter-time dispatch keeps the
// public ValidatorContext shape (used inside user-supplied validators) untouched.
export type SetterPluginContext = ValidatorContext & {
    nameSpace?: string;
    isUpdate?: boolean;
    validatorOverride?: ValidatorFn;
};

// Generic extension contract: the built-in validation behavior and any user-supplied
// plugin both implement this interface and are dispatched from the same seams.
export type ModelPlugin<TConfig = unknown> = {
    name: string;
    onSet?: (context: SetterPluginContext, config: TConfig) => void;
    onValidate?: (instance: DynamicClassInstance, config: TConfig) => void;
    onValidateAsync?: (instance: DynamicClassInstance, config: TConfig) => Promise<void>;
    onCollectErrors?: (instance: DynamicClassInstance, config: TConfig) => ValidationIssue[];
    onCollectErrorsAsync?: (instance: DynamicClassInstance, config: TConfig) => Promise<ValidationIssue[]>;
    getConfig?: () => TConfig;
    updateConfig?: (next: TConfig) => void;
};

export type Config = {
    validateInput?: boolean;
    validateOnCreate?: boolean;
    cloneable?: boolean;
    rules?: Record<string, Rule>;
    asyncRules?: Record<string, AsyncRule>;
    plugins?: ModelPlugin[];
};

export type UpdateRulesOptions = {
    mergeRules?: boolean;
    remove?: string[];
};

export type ModelConfig = Required<Config>;

export type ValidateRuleFn = (
    nameSpace: string | undefined,
    key: string,
    value: unknown,
    validator?: ValidatorFn,
    parentObject?: unknown,
    rootObject?: unknown,
    index?: number,
    isUpdate?: boolean
) => void;

export type ValidateAsyncRuleFn = (
    nameSpace: string | undefined,
    key: string,
    value: unknown,
    parentObject?: unknown,
    rootObject?: unknown,
    index?: number
) => Promise<void>;

export type DynamicClassInstance = IStringIndex & {
    setInternalReferences: (root: unknown, parent: unknown, index?: number) => unknown;
    getRules: () => Record<string, Rule>;
    getAsyncRules: () => Record<string, AsyncRule>;
    updateRules: (rules: Record<string, Rule>, options?: UpdateRulesOptions) => DynamicClassInstance;
    removeRules: (...keys: string[]) => DynamicClassInstance;
    updateAsyncRules: (rules: Record<string, AsyncRule>, options?: UpdateRulesOptions) => DynamicClassInstance;
    removeAsyncRules: (...keys: string[]) => DynamicClassInstance;
    validate: {
        (options?: { collectErrors?: false }): DynamicClassInstance;
        (options: { collectErrors: true }): ValidationResult;
    };
    validateAsync: {
        (options?: { collectErrors?: false }): Promise<DynamicClassInstance>;
        (options: { collectErrors: true }): Promise<ValidationResult>;
    };
    toJson: () => IStringIndex;
    clone: () => IStringIndex;
    getMetaInfo: () => MetaInfo;
    utility: {
        getTypeOfObject: typeof getTypeOfObject;
        validateRule: ValidateRuleFn;
        validateAsyncRule: ValidateAsyncRuleFn;
    };
};

export type DynamicClassConstructor = {
    new (modelConfig: ModelConfig): DynamicClassInstance;
    prototype: IStringIndex;
};
