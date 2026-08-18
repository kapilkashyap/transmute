import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

describe('Context-aware navigation', () => {
    test('validates nested fields using the full path', () => {
        const o = transmute(
            {
                company: 'TechCorp',
                departments: [{ name: 'Engineering', manager: { contact: '+91-040-123-4567' } }]
            },
            {
                validateInput: true,
                rules: {
                    contact: (value, context) => {
                        if (context.path.includes('manager') && context.path.includes('departments')) {
                            return /^\+91-\d{3}-\d{3}-\d{4}$/.test(value) || 'Invalid manager contact format';
                        }
                        return true;
                    }
                }
            }
        );

        expect(() => o.getDepartmentsAt(0).getManager().setContact('+91-040-123-7890')).not.toThrow();
        expect(() => o.getDepartmentsAt(0).getManager().setContact('invalid')).toThrowError('Invalid manager contact format');
    });

    test('selects validation by path location', () => {
        const o = transmute(
            { billing: { phone: '555-1234' }, shipping: { phone: '+1-555-1234' } },
            {
                validateInput: true,
                rules: {
                    phone: (value, context) => {
                        if (context.path.includes('billing')) {
                            return /^\d{3}-\d{4}$/.test(value) || 'Invalid billing phone format';
                        }
                        if (context.path.includes('shipping')) {
                            return /^\+1-\d{3}-\d{4}$/.test(value) || 'Invalid shipping phone format';
                        }
                        return true;
                    }
                }
            }
        );

        expect(() => o.getBilling().setPhone('555-1234')).not.toThrow();
        expect(() => o.getShipping().setPhone('+1-555-1234')).not.toThrow();
        expect(() => o.getBilling().setPhone('+1-555-1234')).toThrowError('Invalid billing phone format');
        expect(() => o.getShipping().setPhone('555-1234')).toThrowError('Invalid shipping phone format');
    });

    test('supports parent and root helper methods', () => {
        const o = transmute(
            { version: '1.0', settings: { minAge: 18 } },
            {
                validateInput: true,
                rules: {
                    'root.settings.minAge': (value, context) => {
                        const root = context.getRoot();
                        const parent = context.getParent();
                        expect(parent).toBe(root.getSettings());
                        return root.getVersion() === '1.0' ? value >= 18 || 'Minimum age must be 18 or older' : true;
                    }
                }
            }
        );

        expect(() => o.getSettings().setMinAge(21)).not.toThrow();
        expect(() => o.getSettings().setMinAge(16)).toThrowError('Minimum age must be 18 or older');
    });

    test('supports deep parent navigation', () => {
        const data = {
            company: 'TechCorp',
            departments: [{ name: 'Engineering', employees: [{ id: 'E-1001', projects: [{ budget: 100000 }] }] }]
        };
        const o = transmute(data, {
            validateInput: true,
            rules: {
                'root.departments.employees.projects.budget': (value, context) => {
                    expect(context.parentObject.getParent().getId()).toBe('E-1001');
                    return value > 0 || 'Budget must be positive';
                }
            }
        });

        expect(() => o.getDepartmentsAt(0).getEmployeesAt(0).getProjectsAt(0).setBudget(200000)).not.toThrow();
    });
});
