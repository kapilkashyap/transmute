import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

const user = {
    name: 'John Doe',
    age: 27,
    contacts: ['555-000-1234', 5551117890],
    married: true,
    experience: [
        {
            companyName: 'Company 1',
            tenure: 10,
            projects: [{ title: 'Project-11' }, { title: 'Project-12' }, { title: 'Project-13' }, { title: 'Project-14' }]
        },
        {
            companyName: 'Company 2',
            tenure: 6.5,
            projects: [{ title: 'Project-21' }, { title: 'Project-22' }]
        },
        {
            companyName: 'Company 3',
            tenure: 1.5,
            projects: [{ title: 'Project-31' }, { title: 'Project-32' }]
        }
    ]
};

describe('Converting transmuted object to JSON', () => {
    const transmutedUser = transmute(user);

    test('JSON.stringify returns empty object', () => {
        expect(JSON.stringify(transmutedUser)).toBe('{}');
    });

    test('JSON.parse throws syntax error', () => {
        try {
            JSON.parse(transmutedUser);
        } catch (e) {
            expect(e.toString()).toBe('SyntaxError: Unexpected token o in JSON at position 1');
        }
    });

    test('Calling toJson on transmuted object returns a proper JSON', () => {
        // update transmuted object via chaining in single go!
        const cloned = transmutedUser
            .clone()
            .setName('Jane Does')
            .setAge(18)
            .setContacts(['555-666-7777'])
            .setMarried(false)
            .setExperience([]);

        expect(cloned.toJson()).toEqual({
            name: 'Jane Does',
            age: 18,
            contacts: ['555-666-7777'],
            married: false,
            experience: []
        });
    });

    test('Check the stringified JSON', () => {
        expect(JSON.stringify(transmutedUser.toJson())).toEqual(
            '{"name":"John Doe","age":27,"married":true,"contacts":["555-000-1234",5551117890],"experience":[{"companyName":"Company 1","tenure":10,"projects":[{"title":"Project-11"},{"title":"Project-12"},{"title":"Project-13"},{"title":"Project-14"}]},{"companyName":"Company 2","tenure":6.5,"projects":[{"title":"Project-21"},{"title":"Project-22"}]},{"companyName":"Company 3","tenure":1.5,"projects":[{"title":"Project-31"},{"title":"Project-32"}]}]}'
        );
    });
});
