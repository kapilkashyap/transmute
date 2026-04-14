/**
 * Dynamically transform a JSON into a Class with private properties and accessor methods at runtime.
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

export type ValidatorFn = (value: unknown) => boolean | string;

export type Config = {
    validateInput?: boolean;
    cloneable?: boolean;
    rules?: {
        [key: string]: ValidatorFn;
    };
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
const validateRule = function (nameSpace: string | undefined, key: string, value: unknown, validator?: ValidatorFn) {
    if (config.rules != null) {
        const nsKey = nameSpace != null && nameSpace.trim().length > 0 ? `${nameSpace}.${key}` : undefined;
        validator = validator ?? (nsKey != null && config.rules[nsKey] != null ? config.rules[nsKey] : config.rules[key]);

        const validate = (v: unknown, i?: number) => {
            if (validator != null) {
                const validationResponse = validator(v);
                if (validationResponse !== true) {
                    if (typeof validationResponse === 'string') {
                        if (i != null) {
                            throw new Error(`Validation error at index ${i} [${nsKey}]: ${validationResponse}`);
                        }
                        throw new Error(`Validation error [${nsKey}]: ${validationResponse}`);
                    }
                    throw new Error(`Validation failed for property ${nsKey} with value ${v}`);
                }
            }
        };

        if (validator != null && getTypeOfObject(validator) === 'function' && value != null) {
            if (Array.isArray(value)) {
                value.forEach(validate);
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

// default configuration
let config: Config = {
    validateInput: false,
    cloneable: true,
    rules: {}
};

const setConfig = function (cfg: Config) {
    config = {
        ...config,
        ...cfg
    };
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
const generateDynamicClassInstance = function (className: string, o: IStringIndex, nameSpace = '') {
    const keys = Object.keys(o);
    const primitiveKeys = keys.filter((key) => getTypeOfObject(o[key]) !== 'object' && getTypeOfObject(o[key]) !== 'array');
    const objectKeys = keys.filter((key) => getTypeOfObject(o[key]) === 'object');
    const arrayKeys = keys.filter((key) => getTypeOfObject(o[key]) === 'array');
    const privateProperties = generateStringFromArray(keys.map((key) => `${HASH}${normalize(key)};`));

    const accessorMethods = generateStringFromArray(
        keys.map((key) => {
            return `
              get${capitalize(normalize(key))}() {
                return this.${HASH}${normalize(key)};
              }
              set${capitalize(normalize(key))}(v COMMA_PLACEHOLDER validator) {
                this.utility.validateRule(this.getNameSpace() COMMA_PLACEHOLDER '${key}' COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator);
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
                    this.utility.validateRule(this.getNameSpace() COMMA_PLACEHOLDER '${key}' COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator);
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
                        this.utility.validateRule(this.getNameSpace() COMMA_PLACEHOLDER '${key}' COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator);
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
                        this.utility.validateRule(this.getNameSpace() COMMA_PLACEHOLDER '${key}' COMMA_PLACEHOLDER v COMMA_PLACEHOLDER validator);
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
          #nameSpace = ${nameSpace.trim().length > 0 ? `'${nameSpace.trim()}'` : 'undefined'};

          constructor() {}

          getNameSpace() {
            if (this.#nameSpace != null) {
                return this.#nameSpace.replace(/_/g, '.').trim();
            }
            return this.#nameSpace;
          }
          ${config.validateInput ? accessorMethodsWithValidation : accessorMethods}
          ${config.validateInput ? indexedAccessorMethodsWithValidation : indexedAccessorMethods}
        }
      `;

    // This will generate an anonymous iife that returns a Class
    const dynamicClassWrapper = new Function('', dynamicClassDefinition);

    // TODO: Figure out a way to get rid of this error
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const dynamicClass = new dynamicClassWrapper();

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
        if (config.cloneable) {
            // Create a clone of the transmuted object
            dynamicClass.prototype.clone = function () {
                return transmute(this.toJson());
            };
        }

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
            getTypeOfObject,
            validateRule
        };
    }

    const instance = new dynamicClass();

    /** --- Calling set accessor methods on the instance to initialize the private properties --- **/
    // iterate over the primitive keys
    // if we find an object then we generate a dynamic class and assign its value
    // else, we directly set the value the property returns
    primitiveKeys.forEach((key: string): void => {
        const setAccessorMethod = `set${capitalize(normalize(key))}`;
        if (setAccessorMethod in instance && typeof instance[setAccessorMethod] === 'function') {
            instance[setAccessorMethod](o[key]);
        }
    });

    // iterate over the object type keys
    // if we find an object then we generate a dynamic class and assign its value
    // else, we directly set the value the property returns
    objectKeys.forEach((key: string): void => {
        const setAccessorMethod = `set${capitalize(normalize(key))}`;
        if (setAccessorMethod in instance && typeof instance[setAccessorMethod] === 'function') {
            instance[setAccessorMethod](
                generateDynamicClassInstance(
                    capitalize(normalize(key)),
                    o[key] as IStringIndex,
                    nameSpace.trim().length > 0 ? `${nameSpace}_${key}` : key
                )
            );
        }
    });

    // iterate over the array type keys
    // we map through our array and if we find an object then we generate a dynamic class and assign its value
    // else, we simply return the value
    arrayKeys.forEach((key: string): void => {
        const setAccessorMethod = `set${capitalize(normalize(key))}`;
        if (setAccessorMethod in instance && typeof instance[setAccessorMethod] === 'function') {
            const values = o[key];
            if (Array.isArray(values)) {
                const valueInstances = values.map((value, index) => {
                    if (getTypeOfObject(value) === 'object') {
                        return generateDynamicClassInstance(
                            capitalize(normalize(`${key}${index}`)),
                            value as IStringIndex,
                            nameSpace.trim().length > 0 ? `${nameSpace}_${key}` : key
                        );
                    }
                    if (getTypeOfObject(value) === 'array') {
                        throw 'Multidimensional array not supported. Yet!';
                    }
                    return value;
                });
                instance[setAccessorMethod](valueInstances);
            }
        }
    });

    return instance;
};

export function transmute(o: IStringIndex, config?: Config, className?: string): IStringIndex {
    if (getTypeOfObject(o) !== 'object') {
        throw ERRORS.JSON_EXPECTED;
    }
    if (config != null) {
        setConfig(config);
    }
    // return the transmuted JSON with private properties and accessor methods
    return generateDynamicClassInstance(capitalize(normalize(className ?? `${CLASSNAME}${randomNumber()}`)), o);
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
