/**
 * Builds the runtime-generated class for a JSON object: private storage, accessor methods,
 * per-model configuration, and the object-graph wiring (root/parent/index references).
 */

import type { Config, DynamicClassConstructor, DynamicClassInstance, IStringIndex, ModelConfig, UpdateRulesOptions } from '../types';
import { HASH, capitalize, generateStringFromArray, getTypeOfObject, normalize, normalizeConfig, randomNumber } from '../utils';
import {
    assertUniquePluginNames,
    dispatchSetterPlugins,
    runCollectErrors,
    runCollectErrorsAsync,
    runValidate,
    runValidateAsync
} from './plugin-dispatch';
import { validateAsyncRule } from '../validation/async-rules';
import { convertToJSON } from './serialization';

const CLASSNAME: string = 'Transmute';

const generateDynamicClassInstance = function (
    className: string,
    o: IStringIndex,
    nameSpace = 'root',
    root?: unknown,
    parent?: unknown,
    index?: number,
    modelConfig?: ModelConfig
) {
    const configForModel = modelConfig ?? normalizeConfig();
    const keys = Object.keys(o);
    const propertyTypes = keys.reduce((acc, key) => ({ ...acc, [key]: getTypeOfObject(o[key]) }), {} as Record<string, string>);
    const primitiveKeys = keys.filter((key) => getTypeOfObject(o[key]) !== 'object' && getTypeOfObject(o[key]) !== 'array');
    const objectKeys = keys.filter((key) => getTypeOfObject(o[key]) === 'object');
    const arrayKeys = keys.filter((key) => getTypeOfObject(o[key]) === 'array');
    // Capture each array's original per-index types so validate() can enforce the same contract as indexed setters, even for heterogeneous arrays.
    const arrayElementTypes = arrayKeys.reduce(
        (acc, key) => ({ ...acc, [key]: (o[key] as unknown[]).map((v) => getTypeOfObject(v)) }),
        {} as Record<string, string[]>
    );
    const privateProperties = generateStringFromArray(keys.map((key) => `${HASH}${normalize(key)};`));
    const initializationMethods = generateStringFromArray(
        keys.map((key) => {
            return `
                            initialize${capitalize(normalize(key))}(v) {
                                this.${HASH}${normalize(key)} = v;
                                return this;
                            }
                        `;
        })
    );

    const accessorMethods = generateStringFromArray(
        keys.map((key) => {
            return `
              get${capitalize(normalize(key))}() {
                return this.${HASH}${normalize(key)};
              }
              set${capitalize(normalize(key))}(v COMMA_PLACEHOLDER validator) {
                this.utility.validateRule(
                  this.getNameSpace() COMMA_PLACEHOLDER 
                  '${key}' COMMA_PLACEHOLDER 
                  v COMMA_PLACEHOLDER 
                  validator COMMA_PLACEHOLDER
                  this COMMA_PLACEHOLDER
                  this.getRoot() COMMA_PLACEHOLDER
                  undefined COMMA_PLACEHOLDER
                  true
                );
                this.${HASH}${normalize(key)} = v;
                return this;
              }
            `;
        })
    );

    const accessorMethodsWithValidation = generateStringFromArray(
        keys.map((key) => {
            const valueType = getTypeOfObject(o[key]);
            return `
              get${capitalize(normalize(key))}() {
                return this.${HASH}${normalize(key)};
              }
              set${capitalize(normalize(key))}(v COMMA_PLACEHOLDER validator) {
                const typeOfValue = this.utility.getTypeOfObject(v);
                if (typeOfValue === '${valueType}') {
                    this.utility.validateRule(
                      this.getNameSpace() COMMA_PLACEHOLDER 
                      '${key}' COMMA_PLACEHOLDER 
                      v COMMA_PLACEHOLDER 
                      validator COMMA_PLACEHOLDER
                      this COMMA_PLACEHOLDER
                      this.getRoot() COMMA_PLACEHOLDER
                      undefined COMMA_PLACEHOLDER
                      true
                    );
                    this.${HASH}${normalize(key)} = v;
                    return this;
                }
                throw 'Type mismatch: argument of type ${valueType} expected but got ' + typeOfValue + ' instead';
              }
            `;
        })
    );

    const indexedAccessorMethods = generateStringFromArray(
        arrayKeys.map((key) => {
            return `
              get${capitalize(normalize(key))}At(i) {
                if (i != null) {
                    if (i >= 0 && i < this.${HASH}${normalize(key)}.length) {
                        return this.${HASH}${normalize(key)}[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${capitalize(normalize(key))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                if (Array.isArray(this.${HASH}${normalize(key)}) && i != null) {
                    if (i >= 0 && i < this.${HASH}${normalize(key)}.length) {
                        this.utility.validateRule(
                          this.getNameSpace() COMMA_PLACEHOLDER 
                          '${key}' COMMA_PLACEHOLDER 
                          v COMMA_PLACEHOLDER 
                          validator COMMA_PLACEHOLDER
                          this COMMA_PLACEHOLDER
                          this.getRoot() COMMA_PLACEHOLDER
                          i COMMA_PLACEHOLDER
                          true
                        );
                        this.${HASH}${normalize(key)}[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `;
        })
    );

    const indexedAccessorMethodsWithValidation = generateStringFromArray(
        arrayKeys.map((key) => {
            return `
              get${capitalize(normalize(key))}At(i) {
                const value = this.${HASH}${normalize(key)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        return value[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
              set${capitalize(normalize(key))}At(i COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator) {
                const value = this.${HASH}${normalize(key)};
                if (this.utility.getTypeOfObject(i) === 'number') {
                    if (i >= 0 && i < value.length) {
                        // Compare against the type currently held at this index so heterogeneous arrays keep each slot's own contract.
                        const expectedType = this.utility.getTypeOfObject(value[i]);
                        const typeOfValue = this.utility.getTypeOfObject(v);
                        if (typeOfValue !== expectedType) {
                            throw 'Type mismatch: argument of type ' + expectedType + ' expected but got ' + typeOfValue + ' instead';
                        }
                        this.utility.validateRule(
                          this.getNameSpace() COMMA_PLACEHOLDER 
                          '${key}' COMMA_PLACEHOLDER 
                          v COMMA_PLACEHOLDER 
                          validator COMMA_PLACEHOLDER
                          this COMMA_PLACEHOLDER
                          this.getRoot() COMMA_PLACEHOLDER
                          i COMMA_PLACEHOLDER
                          true
                        );
                        value[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                }
                throw 'Index should be of type number';
              }
            `;
        })
    );

    const dynamicClassDefinition = `
        return class ${capitalize(normalize(className))} {
          ${privateProperties}
          #modelConfig;
          #nameSpace = ${nameSpace.trim().length > 0 ? `'${nameSpace.trim()}'` : 'undefined'};
          #root = undefined;
          #parent = undefined;
          #index = undefined;

          constructor(modelConfig) {
                this.#modelConfig = modelConfig;
        }

          getNameSpace() {
            if (this.#nameSpace != null) {
                return this.#nameSpace.replace(/_/g, '.').trim();
            }
            return this.#nameSpace;
          }

          setInternalReferences(root, parent, index) {
            this.#root = root;
            this.#parent = parent;
            this.#index = index;
            return this;
          }

          getParent() {
            return this.#parent;
          }

          getRoot() {
            return this.#root;
          }

          getIndex() {
            return this.#index;
          }

                    getRules() {
                        const rules = {};
                        Object.keys(this.#modelConfig.rules).forEach((key) => {
                                const rule = this.#modelConfig.rules[key];
                                rules[key] = rule != null && typeof rule === 'object' ? { ...rule } : rule;
                        });
                        return rules;
                    }

                    getAsyncRules() {
                        return { ...this.#modelConfig.asyncRules };
                    }

          updateRules(rules, options = {}) {
            const nextRules = options.mergeRules ? { ...this.#modelConfig.rules, ...rules } : { ...rules };
            if (Array.isArray(options.remove)) {
                options.remove.forEach((key) => delete nextRules[key]);
            }
            this.#modelConfig.rules = nextRules;
            return this.getRoot();
         }

          removeRules(...keys) {
            const nextRules = { ...this.#modelConfig.rules };
            keys.forEach((key) => delete nextRules[key]);
            this.#modelConfig.rules = nextRules;
            return this.getRoot();
          }

          updateAsyncRules(rules, options = {}) {
            const nextRules = options.mergeRules ? { ...this.#modelConfig.asyncRules, ...rules } : { ...rules };
            if (Array.isArray(options.remove)) {
                options.remove.forEach((key) => delete nextRules[key]);
            }
            this.#modelConfig.asyncRules = nextRules;
            return this.getRoot();
          }

          removeAsyncRules(...keys) {
            const nextRules = { ...this.#modelConfig.asyncRules };
            keys.forEach((key) => delete nextRules[key]);
            this.#modelConfig.asyncRules = nextRules;
            return this.getRoot();
          }

          ${initializationMethods}

          ${configForModel.validateInput ? accessorMethodsWithValidation : accessorMethods}
          ${configForModel.validateInput ? indexedAccessorMethodsWithValidation : indexedAccessorMethods}
        }
      `;

    // This will generate an anonymous iife that returns a Class
    const dynamicClassFactory = new Function('', dynamicClassDefinition) as unknown as () => DynamicClassConstructor;
    const dynamicClass = dynamicClassFactory();

    // Attach utility methods to the prototype of the Class
    if (dynamicClass.prototype != null) {
        // Convert the instance into a valid JSON
        dynamicClass.prototype.toJson = function () {
            if (typeof (this as IStringIndex).getMetaInfo === 'function') {
                return convertToJSON(this, (this as unknown as DynamicClassInstance).getMetaInfo());
            }
            return {};
        };

        // Config driven
        if (configForModel.cloneable) {
            // Create a clone of the transmuted object
            dynamicClass.prototype.clone = function (this: DynamicClassInstance) {
                return transmuteWithConfig(this.toJson(), configForModel);
            };
        }

        dynamicClass.prototype.validate = function (this: DynamicClassInstance, options?: { collectErrors?: boolean }) {
            if (options?.collectErrors) {
                const errors = runCollectErrors(this, configForModel);
                return { valid: errors.length === 0, errors };
            }
            return runValidate(this, configForModel);
        };

        dynamicClass.prototype.validateAsync = async function (this: DynamicClassInstance, options?: { collectErrors?: boolean }) {
            if (options?.collectErrors) {
                const errors = await runCollectErrorsAsync(this, configForModel);
                return { valid: errors.length === 0, errors };
            }
            return runValidateAsync(this, configForModel);
        };

        // Construct a meta-info of the instance
        dynamicClass.prototype.getMetaInfo = function () {
            let o = {};
            if (primitiveKeys.length > 0) {
                o = { ...o, primitiveKeys: primitiveKeys.toString() };
            }
            if (objectKeys.length > 0) {
                o = { ...o, objectKeys: objectKeys.toString() };
            }
            if (arrayKeys.length > 0) {
                o = { ...o, arrayKeys: arrayKeys.toString() };
            }
            return o;
        };
        // Utility to check the type
        dynamicClass.prototype.utility = {
            typeMap: propertyTypes,
            elementTypeMap: arrayElementTypes,
            getTypeOfObject,
            validateRule: (
                nameSpace: string | undefined,
                key: string,
                value: unknown,
                validator?: unknown,
                parentObject?: unknown,
                rootObject?: unknown,
                index?: number,
                isUpdate?: boolean
            ) =>
                dispatchSetterPlugins(
                    configForModel,
                    nameSpace,
                    key,
                    value,
                    validator as Parameters<typeof dispatchSetterPlugins>[4],
                    parentObject,
                    rootObject,
                    index,
                    isUpdate ?? false
                ),
            validateAsyncRule: (
                nameSpace: string | undefined,
                key: string,
                value: unknown,
                parentObject?: unknown,
                rootObject?: unknown,
                index?: number
            ) => validateAsyncRule(configForModel, nameSpace, key, value, parentObject, rootObject, index)
        };
    }

    const instance = new dynamicClass(configForModel);

    // Store navigation metadata on every generated instance. The root reference
    // enables access to the full object graph, the parent reference enables
    // sibling/parent lookups, and the index identifies array elements in validator context.
    const rootObj = root || instance;
    const parentObj = parent || instance;
    (instance as unknown as DynamicClassInstance).setInternalReferences(rootObj, parentObj, index);

    /** --- Initialize private properties without invoking public validation setters --- **/
    // Initialize primitive values directly through the generated internal method.
    // This construction path bypasses public setters so validation is reserved for updates.
    primitiveKeys.forEach((key: string): void => {
        const initializeAccessorMethod = `initialize${capitalize(normalize(key))}`;
        if (initializeAccessorMethod in instance && typeof instance[initializeAccessorMethod] === 'function') {
            instance[initializeAccessorMethod](o[key]);
        }
    });

    // Recursively generate nested objects with their root, parent, and index metadata,
    // then assign each child through its internal initializer without triggering validation.
    objectKeys.forEach((key: string): void => {
        const initializeAccessorMethod = `initialize${capitalize(normalize(key))}`;
        if (initializeAccessorMethod in instance && typeof instance[initializeAccessorMethod] === 'function') {
            const nestedInstance = generateDynamicClassInstance(
                capitalize(normalize(key)),
                o[key] as IStringIndex,
                nameSpace.trim().length > 0 ? `${nameSpace}_${key}` : key,
                rootObj,
                instance,
                undefined,
                configForModel
            );
            instance[initializeAccessorMethod](nestedInstance);
        }
    });

    // Build arrays by recursively generating object elements while preserving primitive values,
    // then assign the completed array through the internal initializer.
    arrayKeys.forEach((key: string): void => {
        const initializeAccessorMethod = `initialize${capitalize(normalize(key))}`;
        if (initializeAccessorMethod in instance && typeof instance[initializeAccessorMethod] === 'function') {
            const values = o[key];
            if (Array.isArray(values)) {
                if (values.some((value) => getTypeOfObject(value) === 'object')) {
                    instance[initializeAccessorMethod]([]);
                }
                const valueInstances = values.map((value, idx) => {
                    if (getTypeOfObject(value) === 'object') {
                        const nestedInstance = generateDynamicClassInstance(
                            capitalize(normalize(`${key}${idx}`)),
                            value as IStringIndex,
                            nameSpace.trim().length > 0 ? `${nameSpace}_${key}` : key,
                            rootObj,
                            instance,
                            idx,
                            configForModel
                        );
                        return nestedInstance;
                    }
                    if (getTypeOfObject(value) === 'array') {
                        throw 'Multidimensional array not supported. Yet!';
                    }
                    return value;
                });
                instance[initializeAccessorMethod](valueInstances);
            }
        }
    });

    return instance as unknown as DynamicClassInstance;
};

// Thin wrapper so `clone()` can re-enter generation with an already-normalized config
// without re-importing transmute() from index.ts (which would create a module cycle).
const transmuteWithConfig = function (o: IStringIndex, modelConfig: ModelConfig): IStringIndex {
    const instance = generateDynamicClassInstance(
        capitalize(normalize(`${CLASSNAME}${randomNumber()}`)),
        o,
        'root',
        undefined,
        undefined,
        undefined,
        normalizeConfig(modelConfig)
    );
    instance.setInternalReferences(instance, instance, undefined);
    if (modelConfig.validateOnCreate) {
        instance.validate();
    }
    return instance;
};

export { CLASSNAME, generateDynamicClassInstance, assertUniquePluginNames, normalizeConfig };
export type { Config, UpdateRulesOptions };
