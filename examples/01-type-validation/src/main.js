const { transmute } = lib.api;

function App() {
    const [model, setModel] = React.useState(() =>
        transmute(
            {
                name: 'Jane Doe',
                age: 31,
                active: true,
                contacts: ['+91-99999-99999']
            },
            { validateInput: true }
        )
    );
    const [message, setMessage] = React.useState('Try a valid or invalid update.');
    const run = (update) => {
        const next = model.clone();
        try {
            update(next);
            setModel(next);
            setMessage('Update accepted.');
        } catch (error) {
            setMessage(error);
        }
    };

    console.log('[01-type-validation] model', model.toJson());
    return (
        <div>
            <ol>
                <li>
                    Setting <code>validateInput</code> to true enables built-in type validation.
                </li>
                <li>The model will throw an error if a field is set to a value of the wrong type.</li>
                <li>If an error is thrown, the model will remain unchanged.</li>
            </ol>
            <div>Try the buttons below to see how the model reacts to valid and invalid updates.</div>
            <br />
            <div className="button-group">
                <button onClick={() => run((m) => m.setAge(32))}>Set age as number</button>
                <button onClick={() => run((m) => m.setAge('32'))}>Set age as text</button>
                <button onClick={() => run((m) => m.setActive(false))}>Set active as boolean</button>
                <button onClick={() => run((m) => m.setContacts('not an array'))}>Set contacts as text</button>
            </div>
            <p className={message.startsWith('Update') ? 'ok' : 'error'}>{message}</p>
            <pre>{JSON.stringify(model.toJson(), null, 2)}</pre>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
