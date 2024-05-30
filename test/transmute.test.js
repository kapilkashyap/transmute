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

    test('Check if we can use indexed get accessor methods to read values', () => {
        expect(transmutedStore.getStore().getBooks()).toBeDefined();
        expect(Array.isArray(transmutedStore.getStore().getBooks())).toBe(true);
        expect(transmutedStore.getStore().getBooksAt(1).getPrice()).toBe(12.99);

        expect(transmutedStore.getStore().getBicycles()).toBeDefined();
        expect(Array.isArray(transmutedStore.getStore().getBicycles())).toBe(true);
        expect(transmutedStore.getStore().getBicyclesAt(0).getPrice()).toBe(199.95);
    });

    test('Check if we can use indexed set accessor methods to update values', () => {
        expect(transmutedStore.getStore().getBooks()).toBeDefined();
        expect(Array.isArray(transmutedStore.getStore().getBooks())).toBe(true);
        expect(transmutedStore.getStore().getBooksAt(1).getPrice()).toBe(12.99);
        transmutedStore.getStore().setBooksAt(1, transmutedStore.getStore().getBooksAt(1).setPrice(10.99));
        expect(transmutedStore.getStore().getBooksAt(1).getPrice()).toBe(10.99);

        expect(transmutedStore.getStore().getBicycles()).toBeDefined();
        expect(Array.isArray(transmutedStore.getStore().getBicycles())).toBe(true);
        expect(transmutedStore.getStore().getBicyclesAt(0).getPrice()).toBe(199.95);
        transmutedStore.getStore().setBicyclesAt(0, transmutedStore.getStore().getBicyclesAt(0).setPrice(159.95));
        expect(transmutedStore.getStore().getBicyclesAt(0).getPrice()).toBe(159.95);
    });

    test('Check if chaining is possible with setters', () => {
        const thirdBook = transmutedStore.getStore().getBooksAt(2);
        expect(thirdBook.getPrice()).toBe(8.99);
        expect(transmutedStore.getStore().setBooksAt(2, thirdBook.setPrice(18.99)).getBooksAt(2).getPrice()).toBe(18.99);
    });

    test('Check if getters and setters work on object instances', () => {
        // returns the 4th book instance
        const fourthBook = transmutedStore.getStore().getBooksAt(3);
        expect(fourthBook.getPrice()).toBe(22.99);
        // setting price of fourth book instance
        fourthBook.setPrice(33.99);
        expect(fourthBook.getPrice()).toBe(33.99);
        // fetching the fourth book instance from parent object also returns updated value
        expect(transmutedStore.getStore().getBooksAt(3).getPrice()).toBe(33.99);
    });
});
