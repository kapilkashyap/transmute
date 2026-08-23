const { allOf, transmute } = lib.api;

const phonePattern = /^\+?[0-9]{2,3}-[0-9]{5}-[0-9]{5}$/;

const model = transmute(
    {
        id: 'user-001',
        name: 'Ada Lovelace',
        password: 'transmute',
        contacts: ['+91-11111-11111', '+91-22222-22222'],
        username: 'ada-lovelace'
    },
    {
        validateInput: true,
        rules: {
            id: { immutable: true },
            name: {
                required: true,
                validator: (value) => String(value).trim().length > 2 || 'Name must be longer than two characters'
            },
            password: allOf(
                (value) => String(value).trim().length > 0 || 'Password is required',
                (value) => String(value).length >= 8 || 'Password must be at least 8 characters'
            ),
            contacts: (value) => phonePattern.test(String(value)) || 'Contact must be of format +CC-XXXXX-XXXXX',
            'contacts[]': (value) => value.length >= 2 || 'At least two contacts are required'
        },
        asyncRules: {
            username: async (value) => {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                return value !== 'existing-name' || 'Username is already taken';
            }
        }
    },
    'ValidationErgonomics'
);

console.log(model.getRules());
console.log(model.getAsyncRules());

const text = (id) => document.getElementById(id);
const setStatus = (id, message, error = false) => {
    const node = text(id);
    node.textContent = message;
    node.classList.toggle('error', error);
};
const refresh = () => {
    text('model-json').textContent = JSON.stringify(model.toJson(), null, 2);
};
const attempt = (statusId, callback) => {
    try {
        callback();
        setStatus(statusId, 'Update accepted.');
        refresh();
    } catch (error) {
        setStatus(statusId, error.message, true);
    }
};

text('check-password').addEventListener('click', () => {
    attempt('password-status', () => model.setPassword(text('password').value));
});

text('update-name').addEventListener('click', () => {
    attempt('metadata-status', () => model.setName(text('name').value));
});

text('change-id').addEventListener('click', () => {
    attempt('metadata-status', () => model.setId('user-002'));
});

text('update-contact-1').addEventListener('click', () => {
    attempt('collection-status', () => model.setContactsAt(0, text('contact-1').value));
});

text('update-contact-2').addEventListener('click', () => {
    attempt('collection-status', () => model.setContactsAt(1, text('contact-2').value));
});

text('update-both-contacts').addEventListener('click', () => {
    attempt('collection-status', () => {
        model.setContacts([text('contact-1').value, text('contact-2').value].filter((str) => str.trim() !== ''));
    });
});

text('run-async').addEventListener('click', async () => {
    setStatus('async-status', 'Checking remote availability...');
    try {
        model.setUsername(text('username').value);
        await model.validateAsync();
        setStatus('async-status', 'Async validation passed.');
        refresh();
    } catch (error) {
        setStatus('async-status', error.message, true);
    }
});

text('inspect').addEventListener('click', () => {
    text('inspection').textContent = JSON.stringify(
        {
            syncRuleKeys: Object.keys(model.getRules()),
            asyncRuleKeys: Object.keys(model.getAsyncRules())
        },
        null,
        2
    );
});

refresh();
