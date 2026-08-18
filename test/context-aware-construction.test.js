import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

describe('Context-aware construction and updates', () => {
    test('does not invoke validators while constructing the object graph', () => {
        let validationCalls = 0;

        const user = transmute(
            { profile: { age: 30 } },
            {
                validateInput: true,
                rules: {
                    'root.profile.age': () => {
                        validationCalls += 1;
                        return true;
                    }
                }
            }
        );

        expect(validationCalls).toBe(0);

        user.getProfile().setAge(31);

        expect(validationCalls).toBe(1);
    });

    test('failed validation does not mutate the previous value', () => {
        const user = transmute(
            { age: 30 },
            {
                validateInput: true,
                rules: {
                    age: (value) => value >= 18 || 'Must be an adult'
                }
            }
        );

        expect(() => user.setAge(15)).toThrowError('Must be an adult');
        expect(user.getAge()).toBe(30);
    });

    test('context references point to the current model and root model', () => {
        let receivedContext;

        const user = transmute(
            { profile: { age: 30 } },
            {
                validateInput: true,
                rules: {
                    'root.profile.age': (value, context) => {
                        receivedContext = context;
                        return true;
                    }
                }
            }
        );

        const profile = user.getProfile();
        profile.setAge(31);

        expect(receivedContext.parentObject).toBe(profile);
        expect(receivedContext.rootObject).toBe(user);
        expect(receivedContext.getParent()).toBe(profile);
        expect(receivedContext.getRoot()).toBe(user);
    });
});
