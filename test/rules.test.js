import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

const data = {
    company: 'TechCorp',
    info: {
        location: 'Hyderabad',
        office: 'Ascendas IT Park',
        floor: 9,
        contacts: ['+91-040-123-4567', '+91-040-123-4568', '+91-040-123-4569', '+91-040-123-4570'],
        hybrid: true
    },
    departments: [
        {
            name: 'Engineering',
            manager: {
                id: 'E-10001',
                name: 'Alpha',
                email: 'alpha@techcorp.com',
                contact: '+91-123-456-7890',
                role: 'Engineering Manager',
                skills: ['JavaScript', 'Architecture']
            },
            employees: [
                {
                    id: 'E-10002',
                    name: 'Beta',
                    email: 'beta@techcorp.com',
                    contact: '+91-23145-67890',
                    role: 'Senior Developer',
                    projects: [
                        {
                            id: 'P-3000',
                            name: 'Project 3000',
                            status: 'Completed'
                        },
                        {
                            id: 'P-9000',
                            name: 'Project 9000',
                            status: 'Active'
                        }
                    ]
                },
                {
                    id: 'E-10003',
                    name: 'Gamma',
                    email: 'gamma@techcorp.com',
                    contact: '+91 32145 67890',
                    role: 'DevOps',
                    projects: [
                        {
                            id: 'P-1000',
                            name: 'Project 1000',
                            status: 'Completed'
                        },
                        {
                            id: 'P-3000',
                            name: 'Project 3000',
                            status: 'Completed'
                        },
                        {
                            id: 'P-9000',
                            name: 'Project 9000',
                            status: 'Active'
                        }
                    ]
                }
            ]
        },
        {
            name: 'HR',
            employees: [
                {
                    id: 'E-10000',
                    name: 'Delta',
                    email: 'delta@techcorp.com',
                    contact: '+91 32145 67890',
                    role: 'Technical Recruiter'
                }
            ]
        }
    ]
};

const contactsPattern1 = /^[+]?\d{1,3}[-\s]?\d{3}[-\s]?\d{3}[-\s]?\d{4}$/;
const projectStatuses = ['Not started', 'Active', 'On hold', 'Completed'];

describe('Custom validations via rules', () => {
    let o = null;
    try {
        o = transmute(data, {
            validateInput: true,
            rules: {
                id: (value) => value.startsWith('E-') || 'Employee ID should start with E-',
                email: (value) => /^\S+@\S+\.\S+$/.test(value) || 'Invalid email format',
                contact: (value) =>
                    /^[+]?\d{1,3}[-\s]?\d{5}[-\s]?\d{5}$/.test(value) ||
                    'Invalid contact number, expected format: +xx-xxxxx-xxxxx or +xx xxxxx xxxxx',
                info: (value) => {
                    if (typeof value !== 'object' || value === null) {
                        return 'Info should be an object';
                    }
                    const valueJson = typeof value.toJson === 'function' ? value.toJson() : value;
                    if (!('contacts' in valueJson)) {
                        return 'Info should have a contacts property';
                    }
                    return true;
                },
                'root.info.contacts': (value) =>
                    contactsPattern1.test(value) || 'Invalid contact number, expected format: +xx-xxx-xxx-xxxx or +xx xxx xxx xxxx',
                'root.departments.manager.contact': (value) =>
                    contactsPattern1.test(value) || 'Invalid contact number, expected format: +xx-xxx-xxx-xxxx or +xx xxx xxx xxxx',
                'root.departments.employees.projects.id': (value) => value.startsWith('P-') || 'Project ID should start with P-',
                'root.departments.employees.projects.status': (value) => projectStatuses.includes(value) || 'Invalid project status'
            }
        });
    } catch (e) {
        console.error('Error during transmutation:', e);
    }

    test('Check setter validation errors for string input', () => {
        expect(() => o.setCompany()).toThrowError('Type mismatch: argument of type string expected but got undefined instead');
        expect(() => o.setCompany(123)).toThrowError('Type mismatch: argument of type string expected but got number instead');
        expect(() => o.setCompany(true)).toThrowError('Type mismatch: argument of type string expected but got boolean instead');
        expect(() => o.setCompany([])).toThrowError('Type mismatch: argument of type string expected but got array instead');
        expect(() => o.setCompany({})).toThrowError('Type mismatch: argument of type string expected but got object instead');
        expect(() => o.setCompany(null)).toThrowError('Type mismatch: argument of type string expected but got null instead');
    });

    test('Check setter validation errors for number input', () => {
        const info = o.getInfo();
        expect(() => info.setFloor()).toThrowError('Type mismatch: argument of type number expected but got undefined instead');
        expect(() => info.setFloor('')).toThrowError('Type mismatch: argument of type number expected but got string instead');
        expect(() => info.setFloor(true)).toThrowError('Type mismatch: argument of type number expected but got boolean instead');
        expect(() => info.setFloor([])).toThrowError('Type mismatch: argument of type number expected but got array instead');
        expect(() => info.setFloor({})).toThrowError('Type mismatch: argument of type number expected but got object instead');
        expect(() => info.setFloor(null)).toThrowError('Type mismatch: argument of type number expected but got null instead');
    });

    test('Check setter validation errors for boolean input', () => {
        const info = o.getInfo();
        expect(() => info.setHybrid()).toThrowError('Type mismatch: argument of type boolean expected but got undefined instead');
        expect(() => info.setHybrid('')).toThrowError('Type mismatch: argument of type boolean expected but got string instead');
        expect(() => info.setHybrid(123)).toThrowError('Type mismatch: argument of type boolean expected but got number instead');
        expect(() => info.setHybrid([])).toThrowError('Type mismatch: argument of type boolean expected but got array instead');
        expect(() => info.setHybrid({})).toThrowError('Type mismatch: argument of type boolean expected but got object instead');
        expect(() => info.setHybrid(null)).toThrowError('Type mismatch: argument of type boolean expected but got null instead');
    });

    test('Check setter validation errors for array input', () => {
        expect(() => o.setDepartments()).toThrowError('Type mismatch: argument of type array expected but got undefined instead');
        expect(() => o.setDepartments('')).toThrowError('Type mismatch: argument of type array expected but got string instead');
        expect(() => o.setDepartments(123)).toThrowError('Type mismatch: argument of type array expected but got number instead');
        expect(() => o.setDepartments(false)).toThrowError('Type mismatch: argument of type array expected but got boolean instead');
        expect(() => o.setDepartments({})).toThrowError('Type mismatch: argument of type array expected but got object instead');
        expect(() => o.setDepartments(null)).toThrowError('Type mismatch: argument of type array expected but got null instead');
    });

    test('Check setter validation errors for object input', () => {
        expect(() => o.setInfo()).toThrowError('Type mismatch: argument of type object expected but got undefined instead');
        expect(() => o.setInfo('')).toThrowError('Type mismatch: argument of type object expected but got string instead');
        expect(() => o.setInfo(123)).toThrowError('Type mismatch: argument of type object expected but got number instead');
        expect(() => o.setInfo(false)).toThrowError('Type mismatch: argument of type object expected but got boolean instead');
        expect(() => o.setInfo([])).toThrowError('Type mismatch: argument of type object expected but got array instead');
        expect(() => o.setInfo(null)).toThrowError('Type mismatch: argument of type object expected but got null instead');
    });

    test('Check indexed setter validation errors for array input', () => {
        expect(() => o.setDepartmentsAt()).toThrowError('Index should be of type number');
        expect(() => o.setDepartmentsAt(-1)).toThrowError('Index out of bound!');
        expect(() => o.setDepartmentsAt(3)).toThrowError('Index out of bound!');
    });

    test('Check validation rules', () => {
        const manager = o.getDepartmentsAt(0).getManager();
        expect(() => manager.setId('10001')).toThrowError('Employee ID should start with E-');
        expect(() => manager.setEmail('alpha@techcorp')).toThrowError('Invalid email format');
        expect(() => manager.setContact('1234567890')).toThrowError(
            'Invalid contact number, expected format: +xx-xxx-xxx-xxxx or +xx xxx xxx xxxx'
        );

        expect(() => o.setInfo()).toThrowError('Type mismatch: argument of type object expected but got undefined instead');
        expect(() => o.setInfo([])).toThrowError('Type mismatch: argument of type object expected but got array instead');
        expect(() =>
            o.setInfo({
                location: 'Hyderabad',
                office: 'Ascendas IT Park',
                floor: 9
            })
        ).toThrowError('Info should have a contacts property');

        const info = o.getInfo();
        expect(() => info.setContacts('+91-040-123-456')).toThrowError(
            'Type mismatch: argument of type array expected but got string instead'
        );
        expect(() => info.setContactsAt(0, '+91-040-123-456')).toThrowError(
            'Invalid contact number, expected format: +xx-xxx-xxx-xxxx or +xx xxx xxx xxxx'
        );

        const p0 = o.getDepartmentsAt(0).getEmployeesAt(0).getProjectsAt(0);
        expect(() => p0.setId('1000')).toThrowError('Project ID should start with P-');
        expect(() => p0.setStatus('Finished')).toThrowError('Invalid project status');
    });

    test('Check custom validation rules', () => {
        expect(() =>
            o
                .getInfo()
                .setContactsAt(
                    0,
                    '+91-040-123-4567',
                    (value) =>
                        /^[+]?\d{1,3}[-\s]?\d{5}[-\s]?\d{5}$/.test(value) ||
                        'Invalid contact number, expected format: +xx-xxxxx-xxxxx or +xx xxxxx xxxxx'
                )
        ).toThrowError('Invalid contact number, expected format: +xx-xxxxx-xxxxx or +xx xxxxx xxxxx');
    });
});
