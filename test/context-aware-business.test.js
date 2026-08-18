import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

describe('Context-aware business rules', () => {
    test('validates password confirmation using a sibling property', () => {
        const o = transmute(
            { password: 'secret123', confirmPassword: 'secret123' },
            {
                validateInput: true,
                rules: {
                    confirmPassword: (value, context) => {
                        const password = context.parentObject.getPassword();
                        return password === value || 'Passwords do not match';
                    }
                }
            }
        );

        expect(() => o.setConfirmPassword('secret123')).not.toThrow();
        expect(() => o.setConfirmPassword('wrong')).toThrowError('Passwords do not match');
    });

    test('validates date ranges using a sibling property', () => {
        const o = transmute(
            { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') },
            {
                validateInput: true,
                rules: {
                    endDate: (value, context) => {
                        const startDate = context.parentObject.getStartDate();
                        return value >= startDate || 'End date must be after start date';
                    }
                }
            }
        );

        expect(() => o.setEndDate(new Date('2025-01-01'))).not.toThrow();
        expect(() => o.setEndDate(new Date('2023-01-01'))).toThrowError('End date must be after start date');
    });

    test('validates a nested field using a sibling property', () => {
        const o = transmute(
            { info: { country: 'US', phone: '+1-123-456-7890' } },
            {
                validateInput: true,
                rules: {
                    'root.info.phone': (value, context) => {
                        if (context.parentObject.getCountry() === 'US') {
                            return /^\+1-\d{3}-\d{3}-\d{4}$/.test(value) || 'Invalid US phone format';
                        }
                        return true;
                    }
                }
            }
        );

        expect(() => o.getInfo().setPhone('+1-999-888-7777')).not.toThrow();
        expect(() => o.getInfo().setPhone('invalid')).toThrowError('Invalid US phone format');
    });

    test('prevents archiving a department with active projects', () => {
        const data = {
            departments: [
                {
                    name: 'Engineering',
                    status: 'active',
                    employees: [{ id: 'E-1001', name: 'Alice', projects: [{ id: 'P-1', status: 'Active' }] }]
                }
            ]
        };

        const o = transmute(data, {
            validateInput: true,
            rules: {
                'root.departments.status': (value, context) => {
                    if (value === 'archived') {
                        const employees = context.parentObject.getEmployees();
                        const hasActiveProjects = employees.some((employee) =>
                            employee.getProjects().some((project) => project.getStatus() === 'Active')
                        );
                        return !hasActiveProjects || 'Cannot archive department with active projects';
                    }
                    return true;
                }
            }
        });

        expect(() => o.getDepartmentsAt(0).setStatus('archived')).toThrowError('Cannot archive department with active projects');
        expect(() => o.getDepartmentsAt(0).setStatus('inactive')).not.toThrow();
    });

    test('enforces a company-wide department budget limit', () => {
        const data = {
            company: { totalBudget: 1000000 },
            departments: [
                { name: 'Engineering', budget: 500000 },
                { name: 'HR', budget: 200000 }
            ]
        };

        const o = transmute(data, {
            validateInput: true,
            rules: {
                'root.departments.budget': (value, context) => {
                    const totalBudget = context.rootObject.getCompany().getTotalBudget();
                    const otherBudget = context.rootObject
                        .getDepartments()
                        .reduce((sum, department) => (department === context.parentObject ? sum : sum + department.getBudget()), 0);
                    const totalNeeded = otherBudget + value;
                    return totalNeeded <= totalBudget || `Total budget would exceed limit. Max: ${totalBudget}, Requested: ${totalNeeded}`;
                }
            }
        });

        expect(() => o.getDepartmentsAt(0).setBudget(900000)).toThrowError(/Total budget would exceed limit/);
        expect(() => o.getDepartmentsAt(0).setBudget(300000)).not.toThrow();
    });

    test('requires a lead before setting a team budget', () => {
        const data = {
            org: {
                name: 'TechCorp',
                divisions: [{ name: 'Product', teams: [{ name: 'Backend', budget: 500000, members: [{ id: 'E-1', role: 'lead' }] }] }]
            }
        };

        const o = transmute(data, {
            validateInput: true,
            rules: {
                'root.org.divisions.teams.budget': (value, context) => {
                    const hasLead = context.parentObject.getMembers().some((member) => member.getRole() === 'lead');
                    return hasLead || 'Team must have a lead before setting budget';
                }
            }
        });

        expect(() => o.getOrg().getDivisionsAt(0).getTeamsAt(0).setBudget(600000)).not.toThrow();
    });
});
