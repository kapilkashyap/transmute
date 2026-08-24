import { describe, expect, test } from '@jest/globals';
import { transmute, unTransmute, allOf, anyOf, memorySizeOf } from '../dist/index.js';

const user = {
    name: 'John Doe',
    age: 27,
    address: { city: 'Springfield', zip: '00000' },
    contacts: ['555-000-1234', 5551117890]
};

describe('Module boundaries: modularized src produces an unchanged public surface', () => {
    test('Public API surface exposes the expected functions', () => {
        expect(typeof transmute).toBe('function');
        expect(typeof unTransmute).toBe('function');
        expect(typeof allOf).toBe('function');
        expect(typeof anyOf).toBe('function');
        expect(typeof memorySizeOf).toBe('function');
    });

    test('Generated instance shape (getters, nested models, toJson, clone, validate) is unaffected by the module split', () => {
        const transmutedUser = transmute(user);

        expect(transmutedUser.getName()).toBe('John Doe');
        expect(transmutedUser.getAge()).toBe(27);
        expect(transmutedUser.getAddress().getCity()).toBe('Springfield');
        expect(transmutedUser.getContacts()[0]).toBe('555-000-1234');

        expect(typeof transmutedUser.toJson).toBe('function');
        expect(typeof transmutedUser.clone).toBe('function');
        expect(typeof transmutedUser.validate).toBe('function');
        expect(typeof transmutedUser.validateAsync).toBe('function');
        expect(typeof transmutedUser.getRules).toBe('function');
        expect(typeof transmutedUser.updateRules).toBe('function');

        expect(transmutedUser.toJson()).toEqual(user);
    });

    test('unTransmute() round-trips a transmuted instance back to plain JSON', () => {
        const transmutedUser = transmute(user);
        expect(unTransmute(transmutedUser)).toEqual(user);
    });

    test('Cloning still produces an isolated, independently mutable instance', () => {
        const transmutedUser = transmute(user);
        const clonedUser = transmutedUser.clone();

        clonedUser.setName('Jane Doe');

        expect(transmutedUser.getName()).toBe('John Doe');
        expect(clonedUser.getName()).toBe('Jane Doe');
    });
});
