import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

describe('Structured validation diagnostics via validate({ collectErrors: true })', () => {
    test('returns a valid result with no errors when the model is valid', () => {
        const user = transmute(
            { age: 25, name: 'ok' },
            {
                validateInput: true,
                rules: { age: (value) => value >= 18 || 'Must be an adult' }
            }
        );

        expect(user.validate({ collectErrors: true })).toEqual({ valid: true, errors: [] });
    });

    test('collects a type mismatch and a rule failure instead of throwing on the first one', () => {
        // Without validateInput, the setter allows the type to drift; the rule is added afterwards so
        // updateRules() doesn't revalidate immediately, letting validate() surface both issues together.
        const user = transmute({ age: 30, name: 'Jane' }, { validateInput: false });
        user.setAge('not-a-number');
        user.updateRules({ age: (value) => value >= 18 || 'Must be an adult' });

        const result = user.validate({ collectErrors: true });

        expect(result.valid).toBe(false);
        expect(result.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ key: 'age', message: expect.stringContaining('Type mismatch') }),
                expect.objectContaining({ key: 'age', message: 'Validation error [age]: Must be an adult' })
            ])
        );
    });

    test('default validate() call still throws on the first failure (unchanged behavior)', () => {
        const user = transmute(
            { age: 15 },
            {
                validateInput: true,
                rules: { age: (value) => value >= 18 || 'Must be an adult' }
            }
        );

        expect(() => user.validate()).toThrowError('Must be an adult');
    });

    test('collects errors from nested objects and array elements with their own paths', () => {
        const user = transmute(
            {
                profile: { age: 15 },
                contacts: [{ email: 'bad' }, { email: 'ok@techcorp.com' }]
            },
            {
                rules: {
                    'root.profile.age': (value) => value >= 18 || 'Nested age rule',
                    email: (value) => /@/.test(value) || 'Email rule'
                }
            }
        );

        const result = user.validate({ collectErrors: true });

        expect(result.valid).toBe(false);
        expect(result.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ path: 'root.profile.age', message: expect.stringContaining('Nested age rule') }),
                expect.objectContaining({ key: 'email', message: expect.stringContaining('Email rule') })
            ])
        );
        // Only the first contact fails; the second should not contribute an error.
        expect(result.errors.filter((e) => e.key === 'email')).toHaveLength(1);
    });

    test('validateAsync({ collectErrors: true }) collects both sync and async rule failures', async () => {
        const user = transmute(
            { age: 15, email: 'bad' },
            {
                rules: { age: (value) => value >= 18 || 'Must be an adult' },
                asyncRules: { email: async (value) => /@/.test(value) || 'Email must contain @' }
            }
        );

        const result = await user.validateAsync({ collectErrors: true });

        expect(result.valid).toBe(false);
        expect(result.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ key: 'age', message: expect.stringContaining('Must be an adult') }),
                expect.objectContaining({ key: 'email', message: expect.stringContaining('Email must contain @') })
            ])
        );
    });

    test('validateAsync({ collectErrors: true }) resolves with valid: true when everything passes', async () => {
        const user = transmute(
            { email: 'ok@techcorp.com' },
            { asyncRules: { email: async (value) => /@/.test(value) || 'Email must contain @' } }
        );

        await expect(user.validateAsync({ collectErrors: true })).resolves.toEqual({ valid: true, errors: [] });
    });
});
