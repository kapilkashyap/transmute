const { transmute } = lib.api;

const ageRule = (value) => value >= 18 || 'Age must be at least 18';
const nameRule = (value) => String(value).length >= 3 || 'Name must have at least 3 characters';
const makeModel = (name) => transmute({ name, age: 30 }, { validateInput: true, rules: { age: ageRule } });

function Card({ label, model, refresh, setClone }) {
    const [message, setMessage] = React.useState('');
    const act = (fn) => {
        try {
            fn(model);
            setMessage('Accepted');
            refresh();
        } catch (e) {
            setMessage(e.message);
        }
    };
    return (
        <article>
            <h2>{label}</h2>
            <p>
                Name: {model.getName()} · Age: {model.getAge()}
            </p>
            <div className="button-group">
                <button onClick={() => act((m) => m.updateRules({ name: nameRule }, { mergeRules: true }))}>Merge name rule</button>
                <button onClick={() => act((m) => m.updateRules({ name: nameRule }))}>Replace rules</button>
                <button onClick={() => act((m) => m.setName('Al'))}>Try short name</button>
                <button onClick={() => setClone(model.clone())}>Clone</button>
            </div>
            <p className="error">{message}</p>
            <pre>{JSON.stringify(model.toJson(), null, 2)}</pre>
        </article>
    );
}

function App() {
    const [, refresh] = React.useState(0);
    const [first] = React.useState(() => makeModel('Alice'));
    const [second] = React.useState(() => makeModel('Bob'));
    const [clone, setClone] = React.useState(null);
    return (
        <div>
            <div>
                <p>Each model has isolated rules. Merge is explicit; replacement is the default.</p>
                <div className="grid">
                    <Card label="Model A" model={first} refresh={() => refresh((n) => n + 1)} setClone={setClone}></Card>
                    <Card label="Model B" model={second} refresh={() => refresh((n) => n + 1)} setClone={setClone}></Card>
                </div>
                {clone && (
                    <div>
                        <h2>Latest clone</h2>
                        <pre>{JSON.stringify(clone.toJson(), null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
