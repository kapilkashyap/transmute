/**
 * Dynamically transform a JSON into a Class with private properties and accessor methods at runtime.
 * @author: Kapil Kashyap
 */

/*** CONSTANTS ***/
const HASH: string = '#';
const CLASSNAME: string = 'Klass';
const EMPTY_STRING: string = '';
enum ERRORS {
    JSON_EXPECTED = 'Expecting a JavaScript Object notation!',
    META_INFO_MISSING = 'Meta info is missing in the object!',
    TRANSMUTED_OBJECT_EXPECTED = 'Transmuted object or an array of transmuted object(s) expected!'
}

/*** TYPES & INTERFACES ***/
export interface IStringIndex extends Record<string, unknown> {}

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

const normalize = function (s: string) {
    if (!isNaN(Number(s[0]))) {
        s = '_' + s;
    }
    return s.toString().replace(/\s|\./g, EMPTY_STRING);
};

const capitalize = function (s: string) {
    return s[0].toUpperCase() + s.slice(1);
};

// const jsonStringifyReplacer = function (value: unknown): string | unknown {
//     if (typeof value === 'function') {
//         return String(value);
//     }
//     return value;
// };
//
// const jsonParseReviver = function (value: unknown): unknown {
//     if (typeof value === 'string' && (value.indexOf('function') !== -1 || value.indexOf('=>') !== -1)) {
//         return new Function('return ' + value)();
//     }
//     return value;
// };

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
const generateDynamicClassInstance = function (className: string, o: IStringIndex) {
    const keys = Object.keys(o);
    const primitiveKeys = keys.filter((key) => getTypeOfObject(o[key]) !== 'object' && getTypeOfObject(o[key]) !== 'array');
    const objectKeys = keys.filter((key) => getTypeOfObject(o[key]) === 'object');
    const arrayKeys = keys.filter((key) => getTypeOfObject(o[key]) === 'array');
    const privateProperties = keys
        .map((key) => `${HASH}${normalize(key)};`)
        .join(',')
        .replaceAll(',', '');

    const accessorMethods = keys
        .map((key) => {
            return `
              get${capitalize(normalize(key))}() {
                return this.${HASH}${normalize(key)};
              }
              set${capitalize(normalize(key))}(v) {
                this.${HASH}${normalize(key)} = v;
                return this;
              }
            `;
        })
        .join(',')
        .replaceAll(',', '');

    const indexedAccessorMethods = arrayKeys
        .map((key) => {
            return `
              get${capitalize(normalize(key))}At(i) {
                if (i != null) {
                    if (i >= 0 && i < this.${HASH}${normalize(key)}.length) {
                        return this.${HASH}${normalize(key)}[i];
                    }
                    throw 'Index out of bound!';
                }
                throw 'Please pass a numeric index!';
              }
              set${capitalize(normalize(key))}At(i parameter_separator v) {
                if (Array.isArray(this.${HASH}${normalize(key)}) && i != null) {
                    if (i >= 0 && i < this.${HASH}${normalize(key)}.length) {
                        this.${HASH}${normalize(key)}[i] = v;
                        return this;
                    }
                    throw 'Index out of bound!';
                } else {
                    throw 'Please pass a numeric index!';
                }
              }
            `;
        })
        .join(',')
        .replaceAll(',', '')
        .replaceAll('parameter_separator', ',');

    const utilityMethods = function () {
        return `
            getMetaInfo() {
                return {
                    ${primitiveKeys.length > 0 ? `primitiveKeys: "${primitiveKeys.toString()}",` : ''}
                    ${objectKeys.length > 0 ? `objectKeys: "${objectKeys.toString()}",` : ''}
                    ${arrayKeys.length > 0 ? `arrayKeys: "${arrayKeys.toString()}"` : ''}
                }
            }
        `;
    };

    const dynamicClassDefinition = `
        return class ${capitalize(normalize(className))} {
          ${privateProperties}
          constructor() {}
          ${accessorMethods}
          ${indexedAccessorMethods}
          ${utilityMethods()}
        }
      `;

    // This will generate an anonymous iife that returns a Class
    const dynamicClassWrapper = new Function('', dynamicClassDefinition);

    // TODO: Figure out a way to get rid of this error
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const dynamicClass = new dynamicClassWrapper();
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
            instance[setAccessorMethod](generateDynamicClassInstance(capitalize(normalize(key)), o[key] as IStringIndex));
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
                        return generateDynamicClassInstance(capitalize(normalize(`${key}${index}`)), value as IStringIndex);
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

    // You can directly convert the instance into a JSON
    instance.toJson = function () {
        if (hasObjectMetaInfo(this)) {
            return convertToJSON(this, this.getMetaInfo());
        }
        return {};
    };

    // You can create a clone of the transmuted object
    instance.clone = function () {
        return transmute(this.toJson());
    };

    return instance;
};

export function transmute(o: IStringIndex, className?: string): IStringIndex {
    if (getTypeOfObject(o) !== 'object') {
        throw ERRORS.JSON_EXPECTED;
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
        if (o.length === 0) {
            throw 'Passed an empty array!';
        }
        return o.map((entry) => {
            if (hasObjectMetaInfo(entry)) {
                return convertToJSON(entry, entry.getMetaInfo());
            }
            return {};
        });
    }
    if (getTypeOfObject(o) === 'object') {
        if (hasObjectMetaInfo(o)) {
            return convertToJSON(o, o.getMetaInfo());
        }
        throw ERRORS.META_INFO_MISSING;
    }
    throw ERRORS.TRANSMUTED_OBJECT_EXPECTED;
}
