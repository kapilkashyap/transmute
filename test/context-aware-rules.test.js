import { describe, expect, test } from '@jest/globals';
import { transmute } from '../dist/index.js';

describe('Context-aware validator contract', () => {
    test('passes context to a validator', () => {
        let receivedContext;

        const user = transmute(
            { email: 'test@example.com' },
            {
                validateInput: true,
                rules: {
                    email: (value, context) => {
                        receivedContext = context;
                        return /^\S+@\S+\.\S+$/.test(value) || 'Invalid email';
                    }
                }
            }
        );

        user.setEmail('valid@test.com');

        expect(receivedContext.key).toBe('email');
        expect(receivedContext.path).toBe('email');
        expect(receivedContext.value).toBe('valid@test.com');
        expect(receivedContext.rootObject).toBe(user);
        expect(receivedContext.parentObject).toBe(user);
        expect(receivedContext.getRoot()).toBe(user);
        expect(receivedContext.getParent()).toBe(user);
    });

    test('supports JavaScript validators that declare only the value parameter', () => {
        const user = transmute(
            { email: 'test@example.com' },
            {
                validateInput: true,
                rules: {
                    email: (value) => /^\S+@\S+\.\S+$/.test(value) || 'Invalid email'
                }
            }
        );

        expect(() => user.setEmail('invalid-email')).toThrowError('Invalid email');
        expect(() => user.setEmail('valid@test.com')).not.toThrow();
    });

    test('supports mixed value-only and context-aware validators', () => {
        const user = transmute(
            { email: 'test@example.com', age: 25, confirmPassword: 'secret123', password: 'secret123' },
            {
                validateInput: true,
                rules: {
                    email: (value) => /^\S+@\S+\.\S+$/.test(value) || 'Invalid email',
                    age: (value) => value >= 18 || 'Must be 18 or older',
                    confirmPassword: (value, context) => context.parentObject.getPassword() === value || 'Passwords do not match'
                }
            }
        );

        expect(() => user.setEmail('new@test.com')).not.toThrow();
        expect(() => user.setAge(21)).not.toThrow();
        expect(() => user.setConfirmPassword('secret123')).not.toThrow();
        expect(() => user.setEmail('invalid')).toThrowError('Invalid email');
        expect(() => user.setAge(16)).toThrowError('Must be 18 or older');
        expect(() => user.setConfirmPassword('wrong')).toThrowError('Passwords do not match');
    });
});
