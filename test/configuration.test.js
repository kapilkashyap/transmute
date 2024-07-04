import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

const user = {
    name: 'John Doe',
    age: 27,
    contacts: ['555-000-1234', 5551117890],
    married: true
};

describe('Configuration check', () => {
    test('Default configuration should be applied', () => {
        const transmutedUser = transmute(user);
        expect(transmutedUser.clone).toBeDefined();
        expect(transmutedUser.toJson).toBeDefined();
        expect(transmutedUser.getMetaInfo).toBeDefined();
    });

    test('Should be able to turn off clone functionality', () => {
        const transmutedUser = transmute(user, { cloneable: false });
        expect(transmutedUser.clone).toBeUndefined();
        expect(transmutedUser.toJson).toBeDefined();
        expect(transmutedUser.getMetaInfo).toBeDefined();
    });

    test('Should be able to specify class name for transmuted instance', () => {
        const transmutedUser = transmute(user, { validateInput: true, cloneable: false }, 'TransmutedUser');
        expect(transmutedUser.constructor.name).toBe('TransmutedUser');
    });
});
