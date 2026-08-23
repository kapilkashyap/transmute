const { transmute } = lib.api;

function App() {
    const [model, setModel] = React.useState(() =>
        transmute(
            {
                password: 'secret123',
                confirmPassword: 'secret123',
                startDate: '2025-01-01',
                endDate: '2025-01-31'
            },
            {
                validateInput: true,
                rules: {
                    confirmPassword: (value, context) => value === context.parentObject.getPassword() || 'Passwords do not match',
                    endDate: (value, context) => value >= context.parentObject.getStartDate() || 'End date must be after start date'
                }
            }
        )
    );
    const [error, setError] = React.useState('');
    const update = (fn) => {
        const next = model.clone();
        try {
            fn(next);
            setModel(next);
            setError('');
        } catch (e) {
            setError(e.message);
        }
    };
    return (
        <div>
            <p>
                Validators can inspect sibling fields through <code>context.parentObject</code>.
            </p>
            <label>
                Confirmation <input defaultValue="wrong" id="confirm" />
            </label>
            <button onClick={() => update((m) => m.setConfirmPassword(document.getElementById('confirm').value))}>
                Validate confirmation
            </button>
            <label>
                End date <input defaultValue="2024-01-01" id="end" />
            </label>
            <button onClick={() => update((m) => m.setEndDate(document.getElementById('end').value))}>Validate date range</button>
            <p className="error">{error}</p>
            <pre>{JSON.stringify(model.toJson(), null, 2)}</pre>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
