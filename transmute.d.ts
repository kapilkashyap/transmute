/**
 * Dynamically transform a JSON into a Class with private properties and accessor methods at runtime.
 * @author: Kapil Kashyap
 */
export declare const HASH: string;
export declare const CLASSNAME: string;
export declare const EMPTY_STRING: string;
export declare enum ERRORS {
    'INDEX_TYPE' = "index should be of numeric type",
    'NON_NULL_VALUE' = "value cannot be undefined",
    'OUT_OF_BOUND' = "index out of bound exception",
    'JSON_EXPECTED' = "Expecting a JavaScript Object notation!"
}
export interface IStringIndex extends Record<string, object> {
}
export type FunctionType = new () => IStringIndex;
export declare const generateFunction: (name: string) => FunctionType;
export declare const getTypeOfObject: (o: unknown) => string;
export declare const normalize: (s: string) => string;
export declare const capitalize: (s: string) => string;
export declare const randomNumber: (fractionDigits?: number, startIndex?: number) => string;
export declare const jsonStringifyReplacer: (value: unknown) => string | unknown;
export declare const jsonParseReviver: (value: unknown) => unknown;
export declare const memorySizeOf: (obj: IStringIndex) => string;
export interface Configuration {
    readOnly: boolean;
    deep: boolean;
}
export declare function transmute(o: IStringIndex, cfg?: Configuration, className?: string): IStringIndex;
