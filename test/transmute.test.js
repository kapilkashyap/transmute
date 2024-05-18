import { describe, expect, test } from '@jest/globals';
import store from '../data/store.js';
import { transmute } from '../dist/transmute.js';

const transmuted = transmute(store);

describe('Tests for transmute js', () => {
    test('Check transmuted object', () => {
        const cycleTypes = transmuted
            .getStore()
            .getBicycles()
            .map((entry) => entry.getType());
        expect(cycleTypes.length).toEqual(2);
        expect(cycleTypes[0]).toEqual('MTB');
        expect(cycleTypes[1]).toEqual('ATB');
    });
});
