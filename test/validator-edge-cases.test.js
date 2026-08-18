import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

describe('Validator edge cases', () => {
    test('passes context to validators with default parameters', () => {
        let receivedContext;

        const user = transmute(
            { age: 30 },
            {
                validateInput: true,
                rules: {
                    age: (value, context = {}) => {
                        receivedContext = context;
                        return true;
                    }
                }
            }
        );

        user.setAge(31);

        expect(receivedContext.key).toBe('age');
        expect(receivedContext.value).toBe(31);
    });

    test('passes the final array index to indexed validators', () => {
        let receivedIndex;

        const user = transmute(
            { contacts: ['a', 'b', 'c'] },
            {
                validateInput: true,
                rules: {
                    contacts: (value, context) => {
                        receivedIndex = context.index;
                        return true;
                    }
                }
            }
        );

        user.setContactsAt(2, 'updated');

        expect(receivedIndex).toBe(2);
    });

    test('supports empty arrays without invoking a validator', () => {
        let validationCalls = 0;

        const user = transmute(
            { contacts: [] },
            {
                validateInput: true,
                rules: {
                    contacts: () => {
                        validationCalls += 1;
                        return true;
                    }
                }
            }
        );

        expect(user.getContacts()).toEqual([]);
        expect(validationCalls).toBe(0);
    });

    test('propagates exceptions thrown by validators', () => {
        const user = transmute(
            { age: 30 },
            {
                validateInput: true,
                rules: {
                    age: () => {
                        throw new Error('validator crashed');
                    }
                }
            }
        );

        expect(() => user.setAge(31)).toThrowError('validator crashed');
        expect(user.getAge()).toBe(30);
    });
});
