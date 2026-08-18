import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

describe('Context-aware arrays', () => {
    test('supports positional validation using array indexes', () => {
        const o = transmute(
            { contacts: ['primary', 'secondary', 'tertiary'] },
            {
                validateInput: true,
                rules: {
                    contacts: (value, context) => {
                        if (context.index === 0 && value !== 'primary') {
                            return 'First contact must be marked as primary';
                        }
                        return true;
                    }
                }
            }
        );

        expect(() => o.setContactsAt(0, 'primary')).not.toThrow();
        expect(() => o.setContactsAt(0, 'secondary')).toThrowError('First contact must be marked as primary');
        expect(() => o.setContactsAt(1, 'secondary')).not.toThrow();
    });

    test('enforces uniqueness using the array index', () => {
        const o = transmute(
            {
                employees: [
                    { id: 'E-1001', name: 'Alice' },
                    { id: 'E-1002', name: 'Bob' }
                ]
            },
            {
                validateInput: true,
                rules: {
                    'root.employees.id': (value, context) => {
                        const ids = context.rootObject
                            .getEmployees()
                            .map((employee, index) => (index === context.index ? value : employee.getId()));
                        return new Set(ids).size === ids.length || `Duplicate ID: ${value}`;
                    }
                }
            }
        );

        expect(() => o.getEmployeesAt(1).setId('E-1003')).not.toThrow();
        expect(() => o.getEmployeesAt(1).setId('E-1001')).toThrowError(/Duplicate ID/);
    });
});
