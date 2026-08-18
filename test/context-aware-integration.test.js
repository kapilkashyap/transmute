import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

describe('Context-aware integration and errors', () => {
    test('includes path details in validation errors', () => {
        const o = transmute(
            { departments: [{ name: 'Eng', budget: 500000, limit: 1000000 }] },
            {
                validateInput: true,
                rules: {
                    'root.departments.budget': (value, context) => {
                        const limit = context.parentObject.getLimit();
                        return value <= limit || `Department budget ${value} exceeds limit ${limit} at path: ${context.path}`;
                    }
                }
            }
        );

        expect(() => o.getDepartmentsAt(0).setBudget(1500000)).toThrowError(
            /Department budget 1500000 exceeds limit 1000000 at path: root\.departments\.budget/
        );
    });

    test('includes array indexes in validation errors', () => {
        const o = transmute(
            {
                items: [
                    { id: 'I-1', name: 'Item 1' },
                    { id: 'I-2', name: 'Item 2' }
                ]
            },
            {
                validateInput: true,
                rules: {
                    'root.items.id': (value, context) =>
                        value.startsWith('I-') || `Item at index ${context.index} has invalid ID: ${value}. Expected to start with 'I-'`
                }
            }
        );

        expect(() => o.getItemsAt(1).setId('INVALID')).toThrowError(/Item at index 1 has invalid ID: INVALID/);
    });

    test('validates a complete order across nested and array context', () => {
        const data = {
            orderId: 'ORD-001',
            customer: { name: 'Alice', email: 'alice@example.com', country: 'US' },
            items: [
                { id: 'ITEM-1', quantity: 5, price: 100, maxQuantity: 10 },
                { id: 'ITEM-2', quantity: 3, price: 200, maxQuantity: 5 }
            ],
            shipping: { method: 'standard', country: 'US', cost: 10 },
            status: 'pending'
        };

        const o = transmute(data, {
            validateInput: true,
            rules: {
                'root.customer.email': (value) =>
                    /^[\w.-]+@[\w.-]+\.(com|org|net)$/.test(value) || 'US customers require .com/.org/.net email',
                'root.items.quantity': (value, context) => {
                    const maxQuantity = context.parentObject.getMaxQuantity();
                    return value <= maxQuantity || `Quantity ${value} exceeds maximum ${maxQuantity}`;
                },
                'root.shipping.country': (value, context) => {
                    const customerCountry = context.rootObject.getCustomer().getCountry();
                    return value === customerCountry || `Shipping country must match customer country (${customerCountry})`;
                },
                'root.status': (value) =>
                    ['pending', 'processing', 'shipped'].includes(value) || `Invalid status. Allowed: pending, processing, shipped`
            }
        });

        expect(() => o.getCustomer().setEmail('alice@example.com')).not.toThrow();
        expect(() => o.getItemsAt(0).setQuantity(8)).not.toThrow();
        expect(() => o.getShipping().setCountry('US')).not.toThrow();
        expect(() => o.setStatus('processing')).not.toThrow();
        expect(() => o.getItemsAt(0).setQuantity(15)).toThrowError(/exceeds maximum/);
        expect(() => o.getShipping().setCountry('CA')).toThrowError(/must match customer country/);
        expect(() => o.setStatus('cancelled')).toThrowError(/Invalid status/);
    });
});
