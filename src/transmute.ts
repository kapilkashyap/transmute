/**
 * A library to transform JSON into a class with private properties and accessor methods.
 * @author: Kapil Kashyap
 */

// CONSTANTS
export const HASH: string = '#';
export const CLASSNAME: string = 'Klass';
export const EMPTY_STRING: string = '';
export enum ERRORS {
    'INDEX_TYPE' = 'index should be of numeric type',
    'NON_NULL_VALUE' = 'value cannot be undefined',
    'OUT_OF_BOUND' = 'index out of bound exception',
    'JSON_EXPECTED' = 'Expecting a JavaScript Object notation!'
}

// UTILITY
export interface IStringIndex extends Record<string, object> {}

export type FunctionType = new () => IStringIndex;

export const generateFunction = function (name: string): FunctionType {
    // @ts-expect-error we are trying to create a function at runtime
    return new new Function('return function ' + name + '(){}')();
};

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
export interface Configuration {
    readOnly: boolean;
    deep: boolean;
}

export function transmute(o: IStringIndex, cfg?: Configuration, className?: string): IStringIndex {
    const config: Configuration = {
        readOnly: false,
        deep: true,
        ...cfg
    };

    // use the passed in class name or generate a random class name
    className = className ?? `${CLASSNAME}${randomNumber()}`;

    // generate a 'set' accessor method
    const generateSetter = function (fn: FunctionType, prop: string): void {
        fn.prototype['set' + capitalize(normalize(prop))] = function (value: unknown): unknown {
            if (value !== undefined) {
                this[`${HASH}${prop}`] = value;
            }
            return this;
        };
    };

    // generate a 'get' accessor method
    const generateGetter = function (fn: FunctionType, prop: string): void {
        fn.prototype['get' + capitalize(normalize(prop))] = function (): unknown {
            return this[`${HASH}${prop}`];
        };
    };

    // generate an indexed 'set' accessor method
    const generateIndexedSetter = function (fn: FunctionType, prop: string): void {
        fn.prototype['set' + capitalize(normalize(prop))] = function (value: unknown, index: number) {
            if (value !== undefined) {
                if (getTypeOfObject(this[`${HASH}${prop}`]) === 'array' && index !== undefined) {
                    if (getTypeOfObject(index) !== 'number') {
                        throw ERRORS.INDEX_TYPE;
                    }
                    if (index >= 0 && index < this[`${HASH}${prop}`].length) {
                        this[`${HASH}${prop}`][index] = value;
                    }
                } else {
                    if (getTypeOfObject(value) !== 'array') {
                        value = [value];
                    }
                    this[`${HASH}${prop}`] = value;
                }
            } else {
                throw ERRORS.NON_NULL_VALUE;
            }
            return this;
        };
    };

    // generate an indexed 'get' accessor method
    const generateIndexedGetter = function (fn: FunctionType, prop: string): void {
        fn.prototype['get' + capitalize(normalize(prop))] = function (index: number): unknown {
            if (index !== undefined) {
                if (getTypeOfObject(index) !== 'number') {
                    throw ERRORS.INDEX_TYPE;
                }
                if (index < 0 || index > this[`${HASH}${prop}`].length - 1) {
                    throw ERRORS.OUT_OF_BOUND;
                }
                return this[`${HASH}${prop}`][index];
            }
            return [...this[`${HASH}${prop}`]];
        };
    };

    // generate 'setter' and 'getter' access methods
    const generateAccessorMethods = function (fn: FunctionType, props: string | string[]): void {
        if (typeof props === 'string') {
            props = [props];
        }
        props.forEach((prop) => {
            !config.readOnly && generateSetter(fn, normalize(prop));
            generateGetter(fn, normalize(prop));
        });
    };

    // generate indexed 'setter' and 'getter' access methods
    const generateIndexedAccessorMethods = function (fn: FunctionType, props: string | string[]): void {
        if (typeof props === 'string') {
            props = [props];
        }
        props.forEach((prop) => {
            !config.readOnly && generateIndexedSetter(fn, normalize(prop));
            generateIndexedGetter(fn, normalize(prop));
        });
    };

    // attach utility methods to the function prototype
    const generateUtilityMethods = function (fn: FunctionType): void {
        fn.prototype['toJSON'] = function () {
            const jsonObject: IStringIndex = {};
            Object.keys(this).forEach((entry: string): void => {
                if (entry[0] === HASH && typeof this[entry] !== 'function') {
                    const prop: string = entry.substring(1);
                    jsonObject[prop] = this[`get${capitalize(prop)}`]();
                }
            });
            return jsonObject;
        };
    };

    // check if the input is a JSON object
    if (getTypeOfObject(o) === 'object') {
        const entries: string[] = Object.keys(o);
        const nonArrayKeys = entries.filter((entry) => getTypeOfObject(o[entry]) !== 'array');
        const arrayKeys = entries.filter((entry) => getTypeOfObject(o[entry]) === 'array');

        // use the class name to create a generator function
        const generatorFn = generateFunction(capitalize(normalize(className)));
        // const instance = new generatorFn();
        const instance: IStringIndex = new generatorFn();
        generateAccessorMethods(generatorFn, nonArrayKeys);
        generateIndexedAccessorMethods(generatorFn, arrayKeys);
        generateUtilityMethods(generatorFn);

        // convert object properties into private properties, so they cannot be accessed directly
        Object.keys(o).forEach((prop) => (instance[`${HASH}${normalize(prop)}`] = o[prop]));

        nonArrayKeys.forEach((key: string): void => {
            if (getTypeOfObject(o[key]) === 'object') {
                instance[`${HASH}${normalize(key)}`] = transmute(o[key] as IStringIndex, cfg, capitalize(normalize(key)));
            }
        });

        // this will recursively transmute if array of object is encountered
        if (config.deep) {
            arrayKeys.forEach((key: string): void => {
                const value = o[key];
                if (Array.isArray(value) && value.length > 0 && getTypeOfObject(value[0]) === 'object') {
                    value.forEach((entry: IStringIndex, index: number): void => {
                        (instance[`${HASH}${normalize(key)}`] as IStringIndex)[index] = transmute(entry, cfg, capitalize(normalize(key)));
                    });
                }
            });
        }

        return instance;
    } else {
        throw ERRORS.JSON_EXPECTED;
    }
}
