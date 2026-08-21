import { allOf, anyOf, transmute } from '../dist/index.js';
import { describe, expect, test } from '@jest/globals';

const context = {
    key: 'value',
    path: 'root.value',
    value: 'candidate',
    getParent: () => undefined,
    getRoot: () => undefined
};

describe('Validator composition helpers', () => {
    test('allOf returns the first failure and stops evaluating', () => {
        const calls = [];
        const composed = allOf(
            () => {
                calls.push('first');
                return true;
            },
            () => {
                calls.push('second');
                return 'Second rule failed';
            },
            () => {
                calls.push('third');
                return true;
            }
        );

        expect(composed('candidate', context)).toBe('Second rule failed');
        expect(calls).toEqual(['first', 'second']);
        expect(allOf(() => false)('candidate', context)).toBe(false);
    });

    test('anyOf stops at the first success and returns the last failure otherwise', () => {
        const calls = [];
        const composed = anyOf(
            () => {
                calls.push('first');
                return 'First rule failed';
            },
            () => {
                calls.push('second');
                return true;
            },
            () => {
                calls.push('third');
                return 'Third rule failed';
            }
        );

        expect(composed('candidate', context)).toBe(true);
        expect(calls).toEqual(['first', 'second']);
        expect(
            anyOf(
                () => 'First failure',
                () => 'Last failure'
            )('candidate', context)
        ).toBe('Last failure');
    });

    test('empty compositions use boolean identity results', () => {
        expect(allOf()('candidate', context)).toBe(true);
        expect(anyOf()('candidate', context)).toBe(false);
    });

    test('forwards the validator context unchanged through transmute rules', () => {
        const receivedContexts = [];
        const model = transmute(
            { value: 'candidate' },
            {
                validateInput: true,
                rules: {
                    value: allOf((value, receivedContext) => {
                        receivedContexts.push(receivedContext);
                        return value === 'candidate' || 'Unexpected value';
                    })
                }
            }
        );

        model.setValue('candidate');
        expect(receivedContexts).toHaveLength(1);
        expect(receivedContexts[0].path).toBe('value');
        expect(receivedContexts[0].value).toBe('candidate');
    });
});
