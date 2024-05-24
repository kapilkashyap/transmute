import { describe, expect, test } from '@jest/globals';
import store from '../data/store.js';
import { transmute } from '../dist/index.js';

const transmutedStore = transmute(store);

describe('Tests for transmuted object with default configuration', () => {
    test('Check if properties are private', () => {
        expect(transmutedStore['store']).toBeUndefined();
        expect(transmutedStore['#store']).toBeUndefined();
    });

    test('Check if we can use get accessor methods to read values', () => {
        expect(transmutedStore.getStore()).toBeDefined();
        expect(transmutedStore.getStore().getInfo()).toBeDefined();
        expect(transmutedStore.getStore().getInfo().getContacts()).toBeDefined();
        expect(transmutedStore.getStore().getInfo().getContacts()[0]).toBe('555-000-1234');
        expect(transmutedStore.getStore().getBooks()).toBeDefined();
        expect(transmutedStore.getStore().getBooks()[0]).toBeDefined();
        expect(transmutedStore.getStore().getBooks()[0].getAuthor()).toBe('Nigel Rees');
        expect(transmutedStore.getStore().getBooks()[0].getPrice()).toBe(8.95);
    });

    test('Check if we can use set accessor methods to update values', () => {
        expect(transmutedStore.getStore().getInfo().getName()).toBe('Some Store');
        transmutedStore.getStore().getInfo().setName('Awesome Store!!!');
        expect(transmutedStore.getStore().getInfo().getName()).toBe('Awesome Store!!!');

        expect(transmutedStore.getStore().getBooks()[0].getPrice()).toBe(8.95);
        transmutedStore.getStore().getBooks()[0].setPrice(7.99);
        expect(transmutedStore.getStore().getBooks()[0].getPrice()).toBe(7.99);

        expect(transmutedStore.getStore().getBicycles()[0].getType()).toBe('MTB');
        transmutedStore.getStore().getBicycles()[0].setType('x-MTB');
        expect(transmutedStore.getStore().getBicycles()[0].getType()).toBe('x-MTB');
    });
});
