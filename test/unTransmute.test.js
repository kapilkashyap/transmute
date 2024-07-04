import { describe, expect, test } from '@jest/globals';
import { transmute, unTransmute } from '../dist/index.js';

const user = {
    name: 'John Doe',
    age: 27,
    contacts: ['555-000-1234', 5551117890],
    married: true
};

describe('Transmute vs unTransmute', () => {
    const transmutedUser = transmute(user);

    test('Transmuted object properties should not be accessible', () => {
        expect(transmutedUser['name']).toBeUndefined();
        expect(transmutedUser['age']).toBeUndefined();
        expect(transmutedUser['contacts']).toBeUndefined();
        expect(transmutedUser['married']).toBeUndefined();
    });

    test('Untransmuted object properties should be accessible', () => {
        // unTransmute the transmuted object
        const unTransmutedUser = unTransmute(transmutedUser);

        expect(unTransmutedUser['name']).toBe('John Doe');
        expect(unTransmutedUser['age']).toBe(27);
        expect(unTransmutedUser['contacts']).toEqual(['555-000-1234', 5551117890]);
        expect(unTransmutedUser['contacts'].length).toBe(2);
        expect(unTransmutedUser['married']).toBe(true);
    });

    test('Check invalid input passed to unTransmute', () => {
        expect(() => unTransmute()).toThrowError('Transmuted object or an array of transmuted object(s) expected!');
        expect(() => unTransmute({})).toThrowError('Meta info is missing in the object!');
        expect(() => unTransmute([])).toThrowError('Transmuted object or an array of transmuted object(s) expected!');
        expect(() => unTransmute([{}])).toThrowError('Meta info is missing in the object!');
    });
});
