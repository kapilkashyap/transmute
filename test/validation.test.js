import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

const data = {
    string: 'value-1',
    number: 123,
    boolean: true,
    array: ['value-2', 456, true],
    object: {
        string: 'value-3',
        number: 789,
        boolean: false
    }
};

describe('Validation and error checks', () => {
    const o = transmute(data, { validateInput: true });

    test('Check setter validation errors for string input', () => {
        expect(() => o.setString()).toThrowError('Type mismatch: argument of type string expected but got undefined instead');
        expect(() => o.setString(123)).toThrowError('Type mismatch: argument of type string expected but got number instead');
        expect(() => o.setString(true)).toThrowError('Type mismatch: argument of type string expected but got boolean instead');
        expect(() => o.setString([])).toThrowError('Type mismatch: argument of type string expected but got array instead');
        expect(() => o.setString({})).toThrowError('Type mismatch: argument of type string expected but got object instead');
        expect(() => o.setString(null)).toThrowError('Type mismatch: argument of type string expected but got null instead');
    });

    test('Check setter validation errors for number input', () => {
        expect(() => o.setNumber()).toThrowError('Type mismatch: argument of type number expected but got undefined instead');
        expect(() => o.setNumber('')).toThrowError('Type mismatch: argument of type number expected but got string instead');
        expect(() => o.setNumber(true)).toThrowError('Type mismatch: argument of type number expected but got boolean instead');
        expect(() => o.setNumber([])).toThrowError('Type mismatch: argument of type number expected but got array instead');
        expect(() => o.setNumber({})).toThrowError('Type mismatch: argument of type number expected but got object instead');
        expect(() => o.setNumber(null)).toThrowError('Type mismatch: argument of type number expected but got null instead');
    });

    test('Check setter validation errors for boolean input', () => {
        expect(() => o.setBoolean()).toThrowError('Type mismatch: argument of type boolean expected but got undefined instead');
        expect(() => o.setBoolean('')).toThrowError('Type mismatch: argument of type boolean expected but got string instead');
        expect(() => o.setBoolean(123)).toThrowError('Type mismatch: argument of type boolean expected but got number instead');
        expect(() => o.setBoolean([])).toThrowError('Type mismatch: argument of type boolean expected but got array instead');
        expect(() => o.setBoolean({})).toThrowError('Type mismatch: argument of type boolean expected but got object instead');
        expect(() => o.setBoolean(null)).toThrowError('Type mismatch: argument of type boolean expected but got null instead');
    });

    test('Check setter validation errors for array input', () => {
        expect(() => o.setArray()).toThrowError('Type mismatch: argument of type array expected but got undefined instead');
        expect(() => o.setArray('')).toThrowError('Type mismatch: argument of type array expected but got string instead');
        expect(() => o.setArray(123)).toThrowError('Type mismatch: argument of type array expected but got number instead');
        expect(() => o.setArray(false)).toThrowError('Type mismatch: argument of type array expected but got boolean instead');
        expect(() => o.setArray({})).toThrowError('Type mismatch: argument of type array expected but got object instead');
        expect(() => o.setArray(null)).toThrowError('Type mismatch: argument of type array expected but got null instead');
    });

    test('Check setter validation errors for object input', () => {
        expect(() => o.setObject()).toThrowError('Type mismatch: argument of type object expected but got undefined instead');
        expect(() => o.setObject('')).toThrowError('Type mismatch: argument of type object expected but got string instead');
        expect(() => o.setObject(123)).toThrowError('Type mismatch: argument of type object expected but got number instead');
        expect(() => o.setObject(false)).toThrowError('Type mismatch: argument of type object expected but got boolean instead');
        expect(() => o.setObject([])).toThrowError('Type mismatch: argument of type object expected but got array instead');
        expect(() => o.setObject(null)).toThrowError('Type mismatch: argument of type object expected but got null instead');
    });

    test('Check indexed setter validation errors for array input', () => {
        expect(() => o.setArrayAt()).toThrowError('Index should be of type number');
        expect(() => o.setArrayAt(-1)).toThrowError('Index out of bound!');
        expect(() => o.setArrayAt(3)).toThrowError('Index out of bound!');
    });

    test('Check invalid input passed to transmute', () => {
        expect(() => transmute()).toThrowError('Expecting a JavaScript Object notation!');
        expect(() => transmute(null)).toThrowError('Expecting a JavaScript Object notation!');
        expect(() => transmute(undefined)).toThrowError('Expecting a JavaScript Object notation!');
        expect(() => transmute([])).toThrowError('Expecting a JavaScript Object notation!');
    });
});
