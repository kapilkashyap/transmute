/**
 * Generic, dependency-free helpers shared by the generator and validation modules.
 */

import type { Config, IStringIndex, ModelConfig, ObjectMetaInfo } from './types';

export const HASH: string = '#';
export const EMPTY_STRING: string = '';
export const UNDERSCORE: string = '_';

export enum ERRORS {
    JSON_EXPECTED = 'Expecting a JavaScript Object notation!',
    META_INFO_MISSING = 'Meta info is missing in the object!',
    TRANSMUTED_OBJECT_EXPECTED = 'Transmuted object or an array of transmuted object(s) expected!'
}

export const hasObjectMetaInfo = (v: unknown): v is ObjectMetaInfo => typeof v === 'object' && v != null && 'getMetaInfo' in v;
export const hasGetter = (v: unknown, getter: string): v is IStringIndex => typeof v === 'object' && v != null && getter in v;

export const randomNumber = function (fractionDigits = 9, startIndex = 2) {
    return Math.random().toFixed(fractionDigits).substring(startIndex);
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
    return s.toString().replace(/-/g, UNDERSCORE).replace(/\s|\./g, EMPTY_STRING);
};

export const capitalize = function (s: string) {
    return s[0].toUpperCase() + s.slice(1);
};

export const generateStringFromArray = function (s: string[], joiner = ',', separator = ',', placeholder = ' COMMA_PLACEHOLDER'): string {
    return s.join(joiner).replaceAll(separator, '').replaceAll(placeholder, ',');
};

export const normalizeConfig = function (cfg?: Config): ModelConfig {
    return {
        validateInput: cfg?.validateInput ?? false,
        validateOnCreate: cfg?.validateOnCreate ?? false,
        cloneable: cfg?.cloneable ?? true,
        rules: { ...(cfg?.rules ?? {}) },
        asyncRules: { ...(cfg?.asyncRules ?? {}) },
        plugins: [...(cfg?.plugins ?? [])]
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
