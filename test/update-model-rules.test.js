import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

describe('Updating model validation rules', () => {
    test('replaces existing rules by default', () => {
        const user = transmute(
            { age: 30, name: 'Jane' },
            {
                validateInput: true,
                rules: {
                    age: (value) => value >= 18 || 'Age rule',
                    name: (value) => value.length > 0 || 'Name rule'
                }
            }
        );

        user.updateRules({ age: (value) => value >= 21 || 'Updated age rule' });

        expect(() => user.setAge(20)).toThrowError('Updated age rule');
        expect(() => user.setName('')).not.toThrow();
    });

    test('merges rules only when mergeRules is enabled', () => {
        const user = transmute(
            { age: 30, name: 'Jane' },
            {
                validateInput: true,
                rules: {
                    age: (value) => value >= 18 || 'Age rule'
                }
            }
        );

        user.updateRules({ name: (value) => value.length > 0 || 'Name rule' }, { mergeRules: true });

        expect(() => user.setAge(17)).toThrowError('Age rule');
        expect(() => user.setName('')).toThrowError('Name rule');
    });

    test('applies updated rules to nested properties and array elements', () => {
        const user = transmute({ profile: { age: 30 }, contacts: ['primary', 'secondary'] }, { validateInput: true });

        user.updateRules({
            'root.profile.age': (value) => value >= 18 || 'Nested age rule',
            contacts: (value, context) => context.index !== 0 || value === 'primary' || 'Primary contact rule'
        });

        expect(() => user.getProfile().setAge(17)).toThrowError('Nested age rule');
        expect(() => user.setContactsAt(0, 'secondary')).toThrowError('Primary contact rule');
    });

    test('updates from nested models return the root model', () => {
        const user = transmute({ profile: { age: 30 } }, { validateInput: true });
        const returned = user.getProfile().updateRules({ 'root.profile.age': (value) => value >= 18 || 'Age rule' });

        expect(returned).toBe(user);
        expect(() => user.getProfile().setAge(17)).toThrowError('Age rule');
    });

    test('does not revalidate existing values during an update', () => {
        const user = transmute({ age: 30 }, { validateInput: true });
        user.updateRules({ age: (value) => value >= 18 || 'Age rule' });

        expect(user.getAge()).toBe(30);
        expect(() => user.setAge(17)).toThrowError('Age rule');
    });

    test('copies the caller rules map', () => {
        const rules = { age: (value) => value >= 18 || 'Age rule' };
        const user = transmute({ age: 30 }, { validateInput: true });

        user.updateRules(rules);
        rules.age = (value) => value >= 5 || 'Changed caller rule';

        expect(() => user.setAge(10)).toThrowError('Age rule');
    });

    test('isolates updates between models', () => {
        const first = transmute({ age: 30 }, { validateInput: true });
        const second = transmute({ age: 30 }, { validateInput: true });

        first.updateRules({ age: (value) => value >= 18 || 'First model rule' });

        expect(() => first.setAge(10)).toThrowError('First model rule');
        expect(() => second.setAge(10)).not.toThrow();
    });

    test('clones preserve rules at clone time', () => {
        const user = transmute({ age: 30 }, { validateInput: true });
        user.updateRules({ age: (value) => value >= 18 || 'Original rule' });

        const clone = user.clone();
        user.updateRules({ age: (value) => value >= 5 || 'Updated original rule' });

        expect(() => user.setAge(4)).toThrowError('Updated original rule');
        expect(() => clone.setAge(10)).toThrowError('Original rule');
    });

    test('removeRules() removes one rule while preserving the rest', () => {
        const user = transmute(
            { age: 30, name: 'Jane' },
            {
                validateInput: true,
                rules: {
                    age: (value) => value >= 18 || 'Age rule',
                    name: (value) => value.length > 0 || 'Name rule'
                }
            }
        );

        const returned = user.removeRules('age');

        expect(returned).toBe(user);
        expect(() => user.setAge(1)).not.toThrow();
        expect(() => user.setName('')).toThrowError('Name rule');
    });

    test('removeRules() accepts multiple keys, including namespaced paths', () => {
        const user = transmute({ profile: { age: 30 }, name: 'Jane' }, { validateInput: true });
        user.updateRules({
            'root.profile.age': (value) => value >= 18 || 'Nested age rule',
            name: (value) => value.length > 0 || 'Name rule'
        });

        user.removeRules('root.profile.age', 'name');

        expect(() => user.getProfile().setAge(1)).not.toThrow();
        expect(() => user.setName('')).not.toThrow();
    });

    test('updateRules() supports removing rules via the remove option', () => {
        const user = transmute(
            { age: 30, name: 'Jane' },
            {
                validateInput: true,
                rules: {
                    age: (value) => value >= 18 || 'Age rule',
                    name: (value) => value.length > 0 || 'Name rule'
                }
            }
        );

        user.updateRules({ email: (value) => /@/.test(value) || 'Email rule' }, { mergeRules: true, remove: ['age'] });

        expect(() => user.setAge(1)).not.toThrow();
        expect(() => user.setName('')).toThrowError('Name rule');
    });
});
