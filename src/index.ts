/**
 * Dynamically transforms JSON objects into runtime models with private properties,
 * accessor methods, context-aware validation, and per-model configuration.
 * @author: Kapil Kashyap
 */

/*** CONSTANTS ***/
const HASH: string = '#';
const CLASSNAME: string = 'Transmute';
const EMPTY_STRING: string = '';
const UNDERSCORE: string = '_';
enum ERRORS {
    JSON_EXPECTED = 'Expecting a JavaScript Object notation!',
    META_INFO_MISSING = 'Meta info is missing in the object!',
    TRANSMUTED_OBJECT_EXPECTED = 'Transmuted object or an array of transmuted object(s) expected!'
}

/*** TYPES & INTERFACES ***/
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

export type Config = {
    validateInput?: boolean;
    validateOnCreate?: boolean;
    cloneable?: boolean;
    rules?: Record<string, ValidatorFn>;
};

export type UpdateRulesOptions = {
    mergeRules?: boolean;
};

type ModelConfig = Required<Config>;

type ValidateRuleFn = (
    nameSpace: string | undefined,
    key: string,
    value: unknown,
    validator?: ValidatorFn,
    parentObject?: unknown,
    rootObject?: unknown,
    index?: number
) => void;

type DynamicClassInstance = IStringIndex & {
    setInternalReferences: (root: unknown, parent: unknown, index?: number) => unknown;
    updateRules: (rules: Record<string, ValidatorFn>, options?: UpdateRulesOptions) => DynamicClassInstance;
    validate: () => DynamicClassInstance;
    toJson: () => IStringIndex;
    clone: () => IStringIndex;
    getMetaInfo: () => MetaInfo;
    utility: {
        getTypeOfObject: typeof getTypeOfObject;
        validateRule: ValidateRuleFn;
    };
};

type DynamicClassConstructor = {
    new (modelConfig: ModelConfig): DynamicClassInstance;
    prototype: IStringIndex;
};

/*** UTILITY ***/
const hasObjectMetaInfo = (v: unknown): v is ObjectMetaInfo => typeof v === 'object' && v != null && 'getMetaInfo' in v;
const hasGetter = (v: unknown, getter: string): v is IStringIndex => typeof v === 'object' && v != null && getter in v;
const randomNumber = function (fractionDigits = 9, startIndex = 2) {
    return Math.random().toFixed(fractionDigits).substring(startIndex);
};

const getTypeOfObject = function (o: unknown) {
    const response = Object.prototype.toString.call(o);
    return response
        .substring(1, response.length - 1)
        .split(/\s/)[1]
        .toLowerCase();
};

/* Validate rule for a property */
const validateRule = function (
    modelConfig: ModelConfig,
    nameSpace: string | undefined,
    key: string,
    value: unknown,
    validator?: ValidatorFn,
    parentObject?: unknown,
    rootObject?: unknown,
    index?: number
) {
    if (modelConfig.rules != null) {
        const nsKey = nameSpace != null && nameSpace.trim().length > 0 ? `${nameSpace}.${key}` : undefined;

        let usedKey = key;
        const contextPath = nameSpace === 'root' ? key : (nsKey ?? key);
        if (nsKey != null && modelConfig.rules[nsKey] != null) {
            validator = validator ?? modelConfig.rules[nsKey];
            usedKey = nsKey;
        } else if (modelConfig.rules[key] != null) {
            validator = validator ?? modelConfig.rules[key];
            usedKey = key;
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

        if (validator != null && getTypeOfObject(validator) === 'function' && value != null) {
            if (Array.isArray(value)) {
                value.forEach((v, idx) => validate(v, idx));
                return;
            }
            validate(value);
        }
    }
};

const normalize = function (s: string) {
    if (!isNaN(Number(s[0]))) {
        s = '_' + s;
    }
    return s.toString().replace(/-/g, UNDERSCORE).replace(/\s|\./g, EMPTY_STRING);
};

const capitalize = function (s: string) {
    return s[0].toUpperCase() + s.slice(1);
};

const generateStringFromArray = function (s: string[], joiner = ',', separator = ',', placeholder = ' COMMA_PLACEHOLDER'): string {
    return s.join(joiner).replaceAll(separator, '').replaceAll(placeholder, ',');
};

const normalizeConfig = function (cfg?: Config): ModelConfig {
    return {
        validateInput: cfg?.validateInput ?? false,
        validateOnCreate: cfg?.validateOnCreate ?? false,
        cloneable: cfg?.cloneable ?? true,
        rules: { ...(cfg?.rules ?? {}) }
    };
};

const validateObjectGraph = function (instance: DynamicClassInstance): DynamicClassInstance {
    const metaInfo = instance.getMetaInfo();
    const keys = [
        ...(metaInfo.primitiveKeys != null && metaInfo.primitiveKeys.length > 0 ? metaInfo.primitiveKeys.split(',') : []),
        ...(metaInfo.objectKeys != null && metaInfo.objectKeys.length > 0 ? metaInfo.objectKeys.split(',') : []),
        ...(metaInfo.arrayKeys != null && metaInfo.arrayKeys.length > 0 ? metaInfo.arrayKeys.split(',') : [])
    ].filter(Boolean);

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

export const memorySizeOf = function (obj: IStringIndex) {
    const formatByteSize = function (bytes: number) {
        const kiloByte = 1024;
        if (bytes < kiloByte) return bytes + ' bytes';
        else if (bytes < Math.pow(kiloByte, 2)) return (bytes / kiloByte).toFixed(6) + ' KiB';
        else if (bytes < Math.pow(kiloByte, 3)) return (bytes / Math.pow(kiloByte, 2)).toFixed(6) + ' MiB';
        else return (bytes / Math.pow(kiloByte, 3)).toFixed(6) + ' GiB';
    };
    const response: string = JSON.stringify(obj);
    return formatByteSize(encodeURI(response).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length - 1);
};

/*** TRANSMUTE ***/
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
                  this.getRoot()
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
                      this.getRoot()
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
                          i
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
                          i
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

          updateRules(rules, options = {}) {
            const nextRules = options.mergeRules ? { ...this.#modelConfig.rules, ...rules } : { ...rules };
            this.#modelConfig.rules = nextRules;
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
            if (hasObjectMetaInfo(this)) {
                return convertToJSON(this, this.getMetaInfo());
            }
            return {};
        };

        // Config driven
        if (configForModel.cloneable) {
            // Create a clone of the transmuted object
            dynamicClass.prototype.clone = function (this: DynamicClassInstance) {
                return transmute(this.toJson(), configForModel);
            };
        }

        dynamicClass.prototype.validate = function (this: DynamicClassInstance) {
            return validateObjectGraph(this);
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
                validator?: ValidatorFn,
                parentObject?: unknown,
                rootObject?: unknown,
                index?: number
            ) => validateRule(configForModel, nameSpace, key, value, validator, parentObject, rootObject, index)
        };
    }

    const instance = new dynamicClass(configForModel);

    // Store navigation metadata on every generated instance. The root reference
    // enables access to the full object graph, the parent reference enables
    // sibling/parent lookups, and the index identifies array elements in validator context.
    const rootObj = root || instance;
    const parentObj = parent || instance;
    instance.setInternalReferences(rootObj, parentObj, index);

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

    return instance;
};

export function transmute(o: IStringIndex, config?: Config, className?: string): IStringIndex {
    if (getTypeOfObject(o) !== 'object') {
        throw ERRORS.JSON_EXPECTED;
    }
    const modelConfig = normalizeConfig(config);
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

/*** UNTRANSMUTE ***/
const convertToJSON = function (o: unknown, metaInfo: MetaInfo) {
    let jsonObject = {};
    if (metaInfo.primitiveKeys != null && metaInfo.primitiveKeys.length > 0) {
        metaInfo.primitiveKeys.split(',').forEach((key) => {
            const getter = `get${capitalize(normalize(key))}`;
            if (hasGetter(o, getter)) {
                jsonObject = {
                    ...jsonObject,
                    [key]: (o[getter] as GetterFn)()
                };
            }
        });
    }
    if (metaInfo.objectKeys != null && metaInfo.objectKeys.length > 0) {
        metaInfo.objectKeys.split(',').forEach((key) => {
            const getter = `get${capitalize(normalize(key))}`;
            if (hasGetter(o, getter)) {
                const getterValue = (o[getter] as GetterFn)();
                if (hasObjectMetaInfo(getterValue)) {
                    jsonObject = {
                        ...jsonObject,
                        [key]: convertToJSON(getterValue, getterValue.getMetaInfo())
                    };
                }
            }
        });
    }
    if (metaInfo.arrayKeys != null && metaInfo.arrayKeys.length > 0) {
        metaInfo.arrayKeys.split(',').forEach((key) => {
            const getter = `get${capitalize(normalize(key))}`;
            if (hasGetter(o, getter)) {
                // this is array of values, like getContacts
                const getterValues = (o[getter] as GetterFnArray)();
                const mapped = getterValues.map((value: unknown) => {
                    const typeOfValue = getTypeOfObject(value);
                    if (typeOfValue === 'array') {
                        return [];
                    }
                    if (typeOfValue === 'object' && hasObjectMetaInfo(value)) {
                        return convertToJSON(value, value.getMetaInfo());
                    }
                    return value;
                });
                jsonObject = {
                    ...jsonObject,
                    [key]: mapped
                };
            }
        });
    }
    return jsonObject;
};

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
