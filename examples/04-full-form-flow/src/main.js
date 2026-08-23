const { transmute } = lib.api;

const createModel = () =>
    transmute(
        {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            company: 'Northstar Labs',
            age: 31
        },
        {
            validateInput: true,
            rules: {
                name: (value) => String(value).trim().length > 1 || 'Name is required',
                email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email',
                company: (value) => String(value).trim().length > 1 || 'Company is required',
                age: (value) => value >= 18 || 'Age must be 18 or more'
            }
        }
    );

function App() {
    const [model, setModel] = React.useState(() => createModel());
    const [error, setError] = React.useState('');
    const update = (field, value) => {
        const next = model.clone();
        try {
            next[`set${field[0].toUpperCase()}${field.slice(1)}`](value);
            setModel(next);
            setError('');
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div>
            <div>
                <p>Edit a model, see validation at the field boundary, then inspect the payload sent to an API.</p>
                <label>
                    Name
                    <input value={model.getName()} onChange={(e) => update('name', e.target.value)} />
                </label>
                <label>
                    Email
                    <input value={model.getEmail()} onChange={(e) => update('email', e.target.value)} />
                </label>
                <label>
                    Company
                    <input value={model.getCompany()} onChange={(e) => update('company', e.target.value)} />
                </label>
                <label>
                    Age
                    <input type="number" value={model.getAge()} onChange={(e) => update('age', Number(e.target.value))} />
                </label>
                <p className="error">{error}</p>
                <button onClick={() => console.log('[04-full-form-flow] submit payload', model.toJson())}>Save and log payload</button>
                <pre>{JSON.stringify(model.toJson(), null, 2)}</pre>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
