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

    test('Indexed setter validates against the type currently held at that index, even in heterogeneous arrays', () => {
        // `array` is `['value-2', 456, true]` - one string, one number, one boolean slot.
        expect(() => o.setArrayAt(0, 999)).toThrowError('Type mismatch: argument of type string expected but got number instead');
        expect(() => o.setArrayAt(1, 'not-a-number')).toThrowError(
            'Type mismatch: argument of type number expected but got string instead'
        );
        expect(() => o.setArrayAt(2, 'not-a-boolean')).toThrowError(
            'Type mismatch: argument of type boolean expected but got string instead'
        );

        expect(() => o.setArrayAt(0, 'value-2-updated')).not.toThrow();
        expect(() => o.setArrayAt(1, 654)).not.toThrow();
        expect(() => o.setArrayAt(2, false)).not.toThrow();
    });

    test('validateOnCreate runs the current model graph through validation before returning the model', () => {
        expect(() =>
            transmute(
                { number: 15 },
                {
                    validateOnCreate: true,
                    rules: {
                        number: (value) => value >= 18 || 'Must be an adult'
                    }
                }
            )
        ).toThrowError('Must be an adult');
    });

    test('validateInput still applies to future setter mutations, not initial construction', () => {
        const model = transmute({ number: 15 }, { validateInput: true });
        expect(() => model.setNumber('bad')).toThrowError('Type mismatch: argument of type number expected but got string instead');
    });

    test('validate() checks the full model state using the current data and rules', () => {
        const model = transmute(
            { number: 25, string: 'ok' },
            {
                validateInput: true,
                rules: {
                    number: (value) => value >= 18 || 'Must be an adult'
                }
            }
        );
        expect(() => model.validate()).not.toThrow();

        const invalid = transmute(
            { number: 15, string: 'ok' },
            {
                validateInput: true,
                rules: {
                    number: (value) => value >= 18 || 'Must be an adult'
                }
            }
        );
        expect(() => invalid.validate()).toThrowError('Must be an adult');
    });

    test('validate() checks each array element against its originally captured type, even for heterogeneous arrays', () => {
        const model = transmute({ array: ['value-2', 456, true] }, { validateInput: false });
        expect(() => model.validate()).not.toThrow();

        // Without validateInput, the setter allows the type drift so validate() must catch it later.
        model.setArrayAt(0, 999);
        expect(() => model.validate()).toThrowError(
            'Type mismatch at index 0 [array]: argument of type string expected but got number instead'
        );
    });

    test('Check invalid input passed to transmute', () => {
        expect(() => transmute()).toThrowError('Expecting a JavaScript Object notation!');
        expect(() => transmute(null)).toThrowError('Expecting a JavaScript Object notation!');
        expect(() => transmute(undefined)).toThrowError('Expecting a JavaScript Object notation!');
        expect(() => transmute([])).toThrowError('Expecting a JavaScript Object notation!');
    });
});
