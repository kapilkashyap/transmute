import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

describe('Wildcard and reusable path rules', () => {
    test('a single "*" segment applies one rule to multiple sibling paths', () => {
        const user = transmute(
            {
                homeAddress: { zip: '00000' },
                workAddress: { zip: '11111' }
            },
            {
                validateInput: true,
                rules: {
                    'root.*.zip': (value) => /^\d{5}$/.test(value) || 'Zip must be 5 digits'
                }
            }
        );

        expect(() => user.getHomeAddress().setZip('bad')).toThrowError('Zip must be 5 digits');
        expect(() => user.getWorkAddress().setZip('bad')).toThrowError('Zip must be 5 digits');
        expect(() => user.getHomeAddress().setZip('22222')).not.toThrow();
        expect(() => user.getWorkAddress().setZip('33333')).not.toThrow();
    });

    test('an exact namespaced path rule takes precedence over a matching wildcard rule', () => {
        const user = transmute(
            {
                homeAddress: { zip: '00000' },
                workAddress: { zip: '11111' }
            },
            {
                validateInput: true,
                rules: {
                    'root.*.zip': () => 'Generic zip rule',
                    'root.workAddress.zip': () => 'Work zip rule'
                }
            }
        );

        expect(() => user.getHomeAddress().setZip('22222')).toThrowError('Generic zip rule');
        expect(() => user.getWorkAddress().setZip('33333')).toThrowError('Work zip rule');
    });

    test('"*" matches exactly one segment and does not match a different segment count', () => {
        const user = transmute(
            {
                office: { address: { zip: '00000' } }
            },
            {
                validateInput: true,
                rules: {
                    'root.*.zip': () => 'Should not match a deeper path'
                }
            }
        );

        expect(() => user.getOffice().getAddress().setZip('anything')).not.toThrow();
    });

    test('wildcard rules can be added, updated, and removed like any other rule', () => {
        const user = transmute(
            {
                homeAddress: { zip: '00000' },
                workAddress: { zip: '11111' }
            },
            { validateInput: true }
        );

        user.updateRules({ 'root.*.zip': (value) => /^\d{5}$/.test(value) || 'Zip must be 5 digits' });
        expect(() => user.getHomeAddress().setZip('bad')).toThrowError('Zip must be 5 digits');

        user.removeRules('root.*.zip');
        expect(() => user.getHomeAddress().setZip('bad')).not.toThrow();
    });
});
