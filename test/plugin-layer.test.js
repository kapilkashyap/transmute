import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

const user = {
    name: 'John Doe',
    age: 27,
    profile: { bio: 'Loves testing' }
};

describe('Plugin layer: generic ModelPlugin contract alongside the built-in validation plugin', () => {
    test('Models without plugins behave exactly as before', () => {
        const transmutedUser = transmute(user);
        expect(transmutedUser.getName()).toBe('John Doe');
        transmutedUser.setAge(30);
        expect(transmutedUser.getAge()).toBe(30);
        expect(transmutedUser.validate({ collectErrors: true })).toEqual({ valid: true, errors: [] });
    });

    test('Built-in validation (rules/validateInput/validateOnCreate) keeps working alongside the plugin contract', () => {
        const transmutedUser = transmute(user, {
            validateInput: true,
            rules: { age: { required: true, validator: (v) => v >= 18 || 'Must be an adult' } }
        });
        expect(() => transmutedUser.setAge(10)).toThrow(/Must be an adult/);
        transmutedUser.setAge(21);
        expect(transmutedUser.getAge()).toBe(21);
    });

    test('A custom plugin observes setter-time values via onSet', () => {
        const observed = [];
        const auditPlugin = {
            name: 'audit',
            onSet: (context) => {
                observed.push({ key: context.key, value: context.value });
            }
        };
        const transmutedUser = transmute(user, { plugins: [auditPlugin] });
        transmutedUser.setName('Jane Doe');

        expect(observed).toEqual([{ key: 'name', value: 'Jane Doe' }]);
    });

    test('A custom plugin participates in validate() and validateAsync() alongside the built-in plugin', async () => {
        // Flat object (no nested models) keeps this test focused on root-level plugin dispatch.
        const flatUser = { name: 'John Doe', age: 27 };
        const failingPlugin = {
            name: 'custom-validate',
            onValidate: () => {
                throw new Error('custom-validate failed');
            },
            onValidateAsync: async () => {
                throw new Error('custom-validate-async failed');
            },
            onCollectErrors: () => [{ path: 'root', key: 'custom', message: 'custom collected error' }],
            onCollectErrorsAsync: async () => [{ path: 'root', key: 'custom', message: 'custom collected async error' }]
        };
        const transmutedUser = transmute(flatUser, { plugins: [failingPlugin] });

        expect(() => transmutedUser.validate()).toThrow('custom-validate failed');
        await expect(transmutedUser.validateAsync()).rejects.toThrow('custom-validate-async failed');

        const result = transmutedUser.validate({ collectErrors: true });
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual({ path: 'root', key: 'custom', message: 'custom collected error' });

        const asyncResult = await transmutedUser.validateAsync({ collectErrors: true });
        expect(asyncResult.valid).toBe(false);
        expect(asyncResult.errors).toContainEqual({ path: 'root', key: 'custom', message: 'custom collected async error' });
    });

    test('Multiple custom plugins dispatch in declared order', () => {
        const order = [];
        const pluginA = { name: 'plugin-a', onSet: () => order.push('a') };
        const pluginB = { name: 'plugin-b', onSet: () => order.push('b') };
        const transmutedUser = transmute(user, { plugins: [pluginA, pluginB] });

        transmutedUser.setName('Someone Else');

        expect(order).toEqual(['a', 'b']);
    });

    test('Plugins reject the setter update the same way built-in rules do, leaving the previous value intact', () => {
        const rejectingPlugin = {
            name: 'reject-negative-age',
            onSet: (context) => {
                if (context.key === 'age' && context.value < 0) {
                    throw new Error('Age cannot be negative');
                }
            }
        };
        const transmutedUser = transmute(user, { plugins: [rejectingPlugin] });

        expect(() => transmutedUser.setAge(-5)).toThrow('Age cannot be negative');
        expect(transmutedUser.getAge()).toBe(27);
    });

    test('Nested models share the same plugin instance as the root model', () => {
        const calls = [];
        const sharedPlugin = { name: 'shared', onSet: (context) => calls.push(context.path) };
        const transmutedUser = transmute(user, { plugins: [sharedPlugin] });

        transmutedUser.getProfile().setBio('Updated bio');

        expect(calls).toEqual(['root.profile.bio']);
    });

    test('Cloned models keep the same plugin instances registered', () => {
        const calls = [];
        const sharedPlugin = { name: 'shared', onSet: (context) => calls.push(context.value) };
        const transmutedUser = transmute(user, { plugins: [sharedPlugin] });
        const clonedUser = transmutedUser.clone();

        clonedUser.setName('Clone Name');

        expect(calls).toEqual(['Clone Name']);
    });

    test('A plugin with only onValidateAsync does not run during synchronous validate()', () => {
        let asyncCalled = false;
        let syncCalled = false;
        const asyncOnlyPlugin = {
            name: 'async-only',
            onValidateAsync: async () => {
                asyncCalled = true;
            }
        };
        const transmutedUser = transmute(user, { plugins: [asyncOnlyPlugin] });

        syncCalled = transmutedUser.validate() != null;

        expect(syncCalled).toBe(true);
        expect(asyncCalled).toBe(false);
    });

    test('Duplicate or reserved plugin names are rejected at model creation', () => {
        const duplicateName = { name: 'dup' };
        expect(() => transmute(user, { plugins: [duplicateName, { name: 'dup' }] })).toThrow(/Duplicate or reserved plugin name/);
        expect(() => transmute(user, { plugins: [{ name: 'transmute.validation' }] })).toThrow(/Duplicate or reserved plugin name/);
    });
});
