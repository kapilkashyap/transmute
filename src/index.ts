/**
 * Dynamically transform a JSON into a Class with private properties and accessor methods at runtime.
 * @author: Kapil Kashyap
 */

// CONSTANTS
const HASH: string = '#';
const CLASSNAME: string = 'Klass';
const EMPTY_STRING: string = '';
enum ERRORS {
    'JSON_EXPECTED' = 'Expecting a JavaScript Object notation!'
}

// UTILITY
export interface IStringIndex extends Record<string, object> {}

export const getTypeOfObject = function (o: unknown) {
    const response = Object.prototype.toString.call(o);
    return response
        .substring(1, response.length - 1)
        .split(/\s/)[1]
        .toLowerCase();
};

export const normalize = function (s: string) {
    if (!isNaN(Number(s[0]))) {
        s = '_' + s;
    }
    return s.toString().replace(/\s|\./g, EMPTY_STRING);
};

export const capitalize = function (s: string) {
    return s[0].toUpperCase() + s.slice(1);
};

export const randomNumber = function (fractionDigits = 9, startIndex = 2) {
    return Math.random().toFixed(fractionDigits).substring(startIndex);
};

export const jsonStringifyReplacer = function (value: unknown): string | unknown {
    if (typeof value === 'function') {
        return String(value);
    }
    return value;
};

export const jsonParseReviver = function (value: unknown): unknown {
    if (typeof value === 'string' && (value.indexOf('function') !== -1 || value.indexOf('=>') !== -1)) {
        return new Function('return ' + value)();
    }
    return value;
};

export const memorySizeOf = function (obj: IStringIndex) {
    const formatByteSize = function (bytes: number) {
        const kiloByte = 1024;
        if (bytes < kiloByte) return bytes + ' bytes';
        else if (bytes < Math.pow(kiloByte, 2)) return (bytes / kiloByte).toFixed(6) + ' KiB';
        else if (bytes < Math.pow(kiloByte, 3)) return (bytes / Math.pow(kiloByte, 2)).toFixed(6) + ' MiB';
        else return (bytes / Math.pow(kiloByte, 3)).toFixed(6) + ' GiB';
    };
    const response: string = JSON.stringify(obj, jsonStringifyReplacer);
    return formatByteSize(encodeURI(response).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length - 1);
};

// TRANSMUTE
const generateDynamicClassInstance = function (className: string, o: IStringIndex) {
    const keys = Object.keys(o);
    const nonArrayKeys = keys.filter((key) => getTypeOfObject(o[key]) !== 'array');
    const arrayKeys = keys.filter((key) => getTypeOfObject(o[key]) === 'array');
    const privateProperties = keys
        .map((key) => `${HASH}${normalize(key)};`)
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
              set${capitalize(normalize(key))}At(v parameter_separator i) {
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
    const dynamicClassDefinition = `
        return class ${capitalize(normalize(className))} {
          ${privateProperties}
          constructor() {}
          ${accessorMethods}
          ${indexedAccessorMethods}
        }
      `;

    // This will generate an anonymous iife that returns a Class
    const dynamicClassWrapper = new Function('', dynamicClassDefinition);
    // TODO: Figure out a way to get rid of this error
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const instance = new new dynamicClassWrapper()();
    // iterate over the non-array keys
    // if we find an object then we generate a dynamic class and assign its value
    // else, we directly set the value the property returns
    nonArrayKeys.forEach((key: string): void => {
        const setAccessorMethod = `set${capitalize(normalize(key))}`;
        if (setAccessorMethod in instance && typeof instance[setAccessorMethod] === 'function') {
            if (getTypeOfObject(o[key]) === 'object') {
                instance[setAccessorMethod](generateDynamicClassInstance(capitalize(normalize(key)), o[key] as IStringIndex));
            } else {
                instance[setAccessorMethod](o[key]);
            }
        }
    });
    // iterate over the array keys
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
                    return value;
                });
                instance[setAccessorMethod](valueInstances);
            }
        }
    });
    return instance;
};

export function transmute(o: IStringIndex, className?: string): IStringIndex {
    if (getTypeOfObject(o) !== 'object') {
        throw ERRORS.JSON_EXPECTED;
    }
    // return the transmuted JSON with private properties and accessor methods
    return generateDynamicClassInstance(capitalize(normalize(className ?? `${CLASSNAME}${randomNumber()}`)), o);
}