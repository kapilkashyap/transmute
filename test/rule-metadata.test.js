import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

describe('Rule metadata', () => {
    test('required rejects null and undefined values', () => {
        const model = transmute(
            { name: 'Jane' },
            {
                rules: { name: { required: true } }
            }
        );

        expect(() => model.setName(null)).toThrowError('Value is required');
        expect(() => model.setName(undefined)).toThrowError('Value is required');
    });

    test('required does not reject valid values during construction or validation', () => {
        const model = transmute(
            { name: 'Jane' },
            {
                validateOnCreate: true,
                rules: { name: { required: true } }
            }
        );

        expect(() => model.validate()).not.toThrow();
        expect(model.getName()).toBe('Jane');
    });

    test('immutable allows the initial value but rejects later changes', () => {
        const model = transmute(
            { id: 'user-1' },
            {
                validateInput: true,
                validateOnCreate: true,
                rules: { id: { immutable: true } }
            }
        );

        expect(() => model.validate()).not.toThrow();
        expect(() => model.setId('user-2')).toThrowError('Property is immutable');
        expect(() => model.setId('user-1')).not.toThrow();
    });

    test('immutable protects an indexed array element from replacement', () => {
        const model = transmute(
            { ids: ['user-1', 'user-2'] },
            {
                validateInput: true,
                rules: { ids: { immutable: true } }
            }
        );

        expect(() => model.setIdsAt(0, 'user-3')).toThrowError('Property is immutable');
        expect(() => model.setIdsAt(0, 'user-1')).not.toThrow();
    });

    test('metadata can be combined with a custom validator', () => {
        const model = transmute(
            { code: 'A-1' },
            {
                validateInput: true,
                rules: {
                    code: {
                        required: true,
                        validator: (value) => String(value).startsWith('A-') || 'Code must start with A-'
                    }
                }
            }
        );

        expect(() => model.setCode('B-1')).toThrowError('Code must start with A-');
        expect(() => model.setCode('A-2')).not.toThrow();
    });
});
