import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

const user = {
    name: 'John Doe',
    age: 27,
    contacts: ['555-000-1234', 5551117890],
    married: true
};

describe('Cloning transmuted object', () => {
    const originalUser = transmute(user);
    const clonedUser = originalUser.clone();

    const transmutedObjectVerification = function (transmutedObject) {
        // private properties cannot be access directly
        expect(transmutedObject['#name']).toBeUndefined();
        expect(transmutedObject['#age']).toBeUndefined();
        expect(transmutedObject['#contacts']).toBeUndefined();
        expect(transmutedObject['#married']).toBeUndefined();

        // non-private properties are not available to be accessed
        expect(transmutedObject['name']).toBeUndefined();
        expect(transmutedObject['age']).toBeUndefined();
        expect(transmutedObject['contacts']).toBeUndefined();
        expect(transmutedObject['married']).toBeUndefined();
    };

    test('Verify if original object was transmuted correctly', () => {
        transmutedObjectVerification(originalUser);

        // check original user values via getters
        expect(originalUser.getName()).toBe('John Doe');
        expect(originalUser.getAge()).toBe(27);
        expect(originalUser.getContacts().length).toBe(2);
        expect(originalUser.getContactsAt(1)).toBe(5551117890);
        expect(originalUser.getMarried()).toBe(true);
    });

    test('Verify if cloned object was transmuted correctly', () => {
        transmutedObjectVerification(clonedUser);

        // check cloned user values via getters
        expect(clonedUser.getName()).toBe('John Doe');
        expect(clonedUser.getAge()).toBe(27);
        expect(clonedUser.getContacts().length).toBe(2);
        expect(clonedUser.getContactsAt(1)).toBe(5551117890);
        expect(clonedUser.getMarried()).toBe(true);
    });

    test('Check if original and cloned object values to be same', () => {
        expect(clonedUser.getName()).toBe(originalUser.getName());
        expect(clonedUser.getAge()).toBe(originalUser.getAge());
        expect(clonedUser.getMarried()).toBe(originalUser.getMarried());
        expect(clonedUser.getContacts().length).toBe(originalUser.getContacts().length);
        expect(clonedUser.getContactsAt(0)).toBe(originalUser.getContactsAt(0));
    });

    test('Updating cloned instance should not update original instance', () => {
        // update the cloned user
        clonedUser.setName('Jane Doe');
        clonedUser.setAge(18);
        clonedUser.setContacts(['800-000-1234']);
        clonedUser.setMarried(false);

        // verify the cloned user
        expect(clonedUser.getName()).toBe('Jane Doe');
        expect(clonedUser.getAge()).toBe(18);
        expect(clonedUser.getContacts().length).toBe(1);
        expect(clonedUser.getContactsAt(0)).toBe('800-000-1234');
        expect(clonedUser.getMarried()).toBe(false);
    });

    test('Check if original and cloned object values are different', () => {
        // compare the cloned user with original user
        expect(clonedUser.getName()).not.toEqual(originalUser.getName());
        expect(clonedUser.getAge()).not.toEqual(originalUser.getAge());
        expect(clonedUser.getContacts().length).not.toEqual(originalUser.getContacts().length);
        expect(clonedUser.getContactsAt(0)).not.toEqual(originalUser.getContactsAt(0));
        expect(clonedUser.getMarried()).not.toEqual(originalUser.getMarried);
    });

    test('Check if instances are different', () => {
        const clonedUser = originalUser.clone();
        expect(clonedUser == originalUser).toBe(false);
        expect(clonedUser === originalUser).toBe(false);
    });
});
