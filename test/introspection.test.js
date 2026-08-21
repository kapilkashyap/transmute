import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

describe('Rule introspection', () => {
    test('returns defensive snapshots of synchronous and asynchronous rules', () => {
        const syncValidator = (value) => value.length > 0 || 'Value is required';
        const asyncValidator = async (value) => value === 'available' || 'Value is unavailable';
        const model = transmute(
            { name: 'Jane', username: 'available' },
            {
                rules: {
                    name: { required: true, validator: syncValidator }
                },
                asyncRules: {
                    username: asyncValidator
                }
            }
        );

        const rules = model.getRules();
        const asyncRules = model.getAsyncRules();

        expect(rules).toEqual({ name: { required: true, validator: syncValidator } });
        expect(asyncRules).toEqual({ username: asyncValidator });
        expect(rules).not.toBe(model.getRules());
        expect(asyncRules).not.toBe(model.getAsyncRules());

        rules.name.required = false;
        asyncRules.username = async () => true;

        expect(model.getRules().name.required).toBe(true);
        expect(model.getAsyncRules().username).toBe(asyncValidator);
    });

    test('reflects rules added and removed after model creation', () => {
        const model = transmute({ age: 30 });
        const ageRule = (value) => value >= 18 || 'Must be an adult';
        const usernameRule = async (value) => value.length > 2 || 'Username is too short';

        model.updateRules({ age: ageRule });
        model.updateAsyncRules({ username: usernameRule });

        expect(model.getRules()).toEqual({ age: ageRule });
        expect(model.getAsyncRules()).toEqual({ username: usernameRule });

        model.removeRules('age');
        model.removeAsyncRules('username');

        expect(model.getRules()).toEqual({});
        expect(model.getAsyncRules()).toEqual({});
    });
});
