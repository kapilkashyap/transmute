import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

describe('Collection-level rules', () => {
    test('runs [] rules against the complete array and regular rules per element', () => {
        const elementValues = [];
        const collectionValues = [];
        const model = transmute(
            { contacts: ['111', '222'] },
            {
                validateInput: true,
                rules: {
                    contacts: (value, context) => {
                        elementValues.push({ value, index: context.index });
                        return /^\d{3}$/.test(value) || 'Contact must be three digits';
                    },
                    'contacts[]': (value, context) => {
                        collectionValues.push({ value, index: context.index });
                        return value.length >= 2 || 'At least two contacts are required';
                    }
                }
            }
        );

        expect(() => model.setContactsAt(0, '333')).not.toThrow();
        expect(elementValues.at(-1)).toEqual({ value: '333', index: 0 });
        expect(collectionValues.at(-1)).toEqual({ value: ['333', '222'] });
        expect(() => model.setContacts(['111'])).toThrowError('At least two contacts are required');
    });

    test('supports namespaced [] rules for nested arrays', () => {
        const model = transmute(
            { profile: { contacts: ['111', '222'] } },
            {
                validateInput: true,
                rules: {
                    'root.profile.contacts[]': (value) => value.length >= 2 || 'Profile needs two contacts'
                }
            }
        );

        expect(() => model.getProfile().setContacts(['111'])).toThrowError('Profile needs two contacts');
    });

    test('supports async [] rules during validateAsync()', async () => {
        const model = transmute(
            { contacts: ['111'] },
            {
                asyncRules: {
                    'contacts[]': async (value) => value.length >= 2 || 'At least two contacts are required'
                }
            }
        );

        await expect(model.validateAsync()).rejects.toThrowError('At least two contacts are required');
        model.setContacts(['111', '222']);
        await expect(model.validateAsync()).resolves.toBe(model);
    });
});
