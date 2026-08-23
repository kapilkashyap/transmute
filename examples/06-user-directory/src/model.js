const { transmute } = lib.api;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rules shared by every directory user model; contacts[0] is treated as the primary number.
const baseRules = {
    name: (value) => String(value).trim().length > 1 || 'Name is required',
    email: (value) => EMAIL_PATTERN.test(String(value)) || 'Invalid email format',
    age: (value) => Number(value) >= 18 || 'Age must be 18 or more',
    status: (value) => ['draft', 'active', 'archived'].includes(value) || 'Invalid status',
    contacts: (value, context) => context.index !== 0 || String(value).startsWith('+') || 'Primary contact must start with +'
};

// Opt-in rules merged over baseRules via updateRules() to demonstrate runtime rule changes.
const strictRules = {
    name: (value) => String(value).trim().length >= 3 || 'Name must have at least 3 characters',
    email: (value) => (EMAIL_PATTERN.test(String(value)) && String(value).split('@')[1].includes('.')) || 'Email domain looks incomplete'
};

function createUserModel(payload) {
    return transmute(payload, { validateInput: true, rules: baseRules }, 'DirectoryUser');
}

window.UD = window.UD || {};
window.UD.baseRules = baseRules;
window.UD.strictRules = strictRules;
window.UD.createUserModel = createUserModel;
