import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

describe('Asynchronous validation via validateAsync()', () => {
    test('resolves when all async rules pass', async () => {
        const user = transmute(
            { email: 'alpha@techcorp.com' },
            {
                asyncRules: {
                    email: async (value) => /@/.test(value) || 'Email must contain @'
                }
            }
        );

        await expect(user.validateAsync()).resolves.toBe(user);
    });

    test('rejects with the async rule message when it fails', async () => {
        const user = transmute(
            { email: 'not-an-email' },
            {
                asyncRules: {
                    email: async (value) => /@/.test(value) || 'Email must contain @'
                }
            }
        );

        await expect(user.validateAsync()).rejects.toThrowError('Email must contain @');
    });

    test('still runs synchronous type and rule checks before awaiting async rules', async () => {
        const user = transmute(
            { age: 15 },
            {
                rules: {
                    age: (value) => value >= 18 || 'Must be an adult'
                },
                asyncRules: {
                    age: async () => true
                }
            }
        );

        await expect(user.validateAsync()).rejects.toThrowError('Must be an adult');
    });

    test('does not affect synchronous setters or validate()', () => {
        const user = transmute(
            { email: 'not-an-email' },
            {
                validateInput: true,
                asyncRules: {
                    email: async (value) => /@/.test(value) || 'Email must contain @'
                }
            }
        );

        expect(() => user.setEmail('still-not-an-email')).not.toThrow();
        expect(() => user.validate()).not.toThrow();
    });

    test('recurses into nested objects and array elements', async () => {
        const user = transmute({
            profile: { email: 'bad' },
            contacts: [{ email: 'bad' }]
        });

        user.getProfile().updateAsyncRules({ email: async (value) => /@/.test(value) || 'Nested email rule' });
        await expect(user.validateAsync()).rejects.toThrowError('Nested email rule');

        const user2 = transmute({
            profile: { email: 'ok@techcorp.com' },
            contacts: [{ email: 'bad' }]
        });
        user2.getContactsAt(0).updateAsyncRules({ email: async (value) => /@/.test(value) || 'Array element email rule' });
        await expect(user2.validateAsync()).rejects.toThrowError('Array element email rule');
    });

    test('updateAsyncRules and removeAsyncRules manage async rules independently of sync rules', async () => {
        const user = transmute({ email: 'not-an-email' });

        user.updateAsyncRules({ email: async (value) => /@/.test(value) || 'Email must contain @' });
        await expect(user.validateAsync()).rejects.toThrowError('Email must contain @');

        user.removeAsyncRules('email');
        await expect(user.validateAsync()).resolves.toBe(user);
    });

    test('supports wildcard async rule paths', async () => {
        const user = transmute({
            homeAddress: { zip: 'bad' },
            workAddress: { zip: 'bad' }
        });

        user.updateAsyncRules({ 'root.*.zip': async (value) => /^\d{5}$/.test(value) || 'Zip must be 5 digits' });

        await expect(user.validateAsync()).rejects.toThrowError('Zip must be 5 digits');
    });
});
