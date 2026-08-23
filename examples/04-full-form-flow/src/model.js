import { transmute } from '../../../dist/index.mjs';

export function createProfileModel(payload) {
    return transmute(
        payload,
        {
            validateInput: true,
            rules: {
                name: (value) => String(value).trim().length > 1 || 'Name is required',
                email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email',
                age: (value) => value >= 18 || 'Age must be 18 or more'
            }
        },
        'Profile'
    );
}
