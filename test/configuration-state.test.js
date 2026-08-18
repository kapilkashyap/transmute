import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

describe('Configuration and model state', () => {
    test('cloneable false removes clone while preserving serialization', () => {
        const user = transmute(
            { name: 'Jane' },
            {
                cloneable: false
            }
        );

        expect(user.clone).toBeUndefined();
        expect(user.toJson()).toEqual({ name: 'Jane' });
    });

    test('explicit configuration can restore clone support', () => {
        transmute({ name: 'Without clone' }, { cloneable: false });
        const user = transmute({ name: 'With clone' }, { cloneable: true });

        expect(user.clone).toBeDefined();
        expect(user.clone().toJson()).toEqual({ name: 'With clone' });
    });

    test('validation remains enabled for models configured with validateInput', () => {
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

    test('models retain their generated API after later transmute calls', () => {
        const first = transmute({ name: 'First' }, { cloneable: true });
        transmute({ name: 'Second' }, { cloneable: false });

        expect(first.getName()).toBe('First');
        expect(first.toJson()).toEqual({ name: 'First' });
        expect(first.clone).toBeDefined();
    });
});
