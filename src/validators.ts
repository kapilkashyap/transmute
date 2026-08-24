/**
 * Validator combinators. These compose plain ValidatorFn values and have no dependency
 * on the generator or the validation-plugin machinery.
 */

import type { ValidatorContext, ValidatorFn } from './types';

// Creates a validator that succeeds only when every supplied validator succeeds.
export const allOf = function (...validators: ValidatorFn[]): ValidatorFn {
    return (value: unknown, context: ValidatorContext): boolean | string => {
        for (const validator of validators) {
            const response = validator(value, context);
            if (response !== true) {
                return response;
            }
        }
        return true;
    };
};

// Creates a validator that succeeds when at least one supplied validator succeeds.
export const anyOf = function (...validators: ValidatorFn[]): ValidatorFn {
    return (value: unknown, context: ValidatorContext): boolean | string => {
        let lastFailure: boolean | string = false;
        for (const validator of validators) {
            const response = validator(value, context);
            if (response === true) {
                return true;
            }
            lastFailure = response;
        }
        return lastFailure;
    };
};
