import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

const user = {
    name: 'John Doe',
    age: 27,
    contacts: ['555-000-1234', 5551117890],
    married: true
};

describe('Generated API exposed in transmuted object', () => {
    const transmutedUser = transmute(user);

    test('Check if getters are defined for the object properties', () => {
        expect(transmutedUser.getName).toBeDefined();
        expect(transmutedUser.getAge).toBeDefined();
        expect(transmutedUser.getContacts).toBeDefined();
        expect(transmutedUser.getMarried).toBeDefined();
    });

    test('Check if setters are defined for the object properties', () => {
        expect(transmutedUser.setName).toBeDefined();
        expect(transmutedUser.setAge).toBeDefined();
        expect(transmutedUser.setContacts).toBeDefined();
        expect(transmutedUser.setMarried).toBeDefined();
    });

    test('Check if indexed getters are defined for the array object properties', () => {
        expect(transmutedUser.getContactsAt).toBeDefined();
    });

    test('Check if indexed setters are defined for the array object properties', () => {
        expect(transmutedUser.setContactsAt).toBeDefined();
    });

    test('Check if toJson and clone methods are exposed', () => {
        expect(transmutedUser.toJson).toBeDefined();
        expect(transmutedUser.clone).toBeDefined();
    });
});
