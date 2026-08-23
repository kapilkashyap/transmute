const { useUserDirectory } = window.UD;

function App() {
    const {
        users,
        selectedId,
        model,
        strict,
        status,
        fieldError,
        banner,
        selectUser,
        updateField,
        updateProfileField,
        updateContact,
        toggleStrict,
        save
    } = useUserDirectory();

    return (
        <div>
            {!model ? (
                <section>
                    <p>Loading directory...</p>
                </section>
            ) : (
                <div className="layout">
                    <aside>
                        <h2>Directory</h2>
                        <br />
                        <ul className="user-list">
                            {users.map((user) => (
                                <li key={user.id}>
                                    <button className={user.id === selectedId ? 'selected' : ''} onClick={() => selectUser(user.id)}>
                                        {user.name}
                                        <span className="badge">{user.status}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <section className="paddingTopZero">
                        <p className="marginTopZero">
                            A full flow built on <code>transmute</code>: hydrate a model from the API, edit it via accessor methods with
                            built-in and context-aware validation, toggle dynamic rules, then save through an adapter layer with optimistic
                            updates and rollback on server rejection.
                        </p>

                        <div className="grid">
                            <div className="grid-item">
                                <label>
                                    Name
                                    <input value={model.getName()} onChange={(e) => updateField('setName', e.target.value)} />
                                </label>
                                <label>
                                    Email
                                    <input value={model.getEmail()} onChange={(e) => updateField('setEmail', e.target.value)} />
                                </label>
                                <label>
                                    Age
                                    <input
                                        type="number"
                                        value={model.getAge()}
                                        onChange={(e) => updateField('setAge', Number(e.target.value))}
                                    />
                                </label>
                                <label>
                                    Status
                                    <select value={model.getStatus()} onChange={(e) => updateField('setStatus', e.target.value)}>
                                        <option value="draft">draft</option>
                                        <option value="active">active</option>
                                        <option value="archived">archived</option>
                                    </select>
                                </label>
                            </div>
                            <div className="grid-item">
                                <label>
                                    City
                                    <input
                                        value={model.getProfile().getCity()}
                                        onChange={(e) => updateProfileField('setCity', e.target.value)}
                                    />
                                </label>
                                <label>
                                    Score (only positive values allowed)
                                    <input
                                        type="number"
                                        value={model.getProfile().getScore()}
                                        onChange={(e) => updateProfileField('setScore', Number(e.target.value))}
                                    />
                                </label>

                                {model.toJson().contacts.map((_, index) => (
                                    <label key={index}>
                                        {`Contact #${index + 1} (must start with +)`}
                                        <input value={model.getContactsAt(index)} onChange={(e) => updateContact(index, e.target.value)} />
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="rules-panel">
                                <button onClick={save} disabled={status === 'saving'}>
                                    {status === 'saving' ? 'Saving...' : 'Save to server'}
                                </button>
                                <button onClick={toggleStrict}>{strict ? 'Reset to base rules' : 'Merge strict rules'}</button>
                                <span className="badge">{strict ? 'strict rules merged' : 'base rules only'}</span>
                            </div>
                        </div>
                        <p className="error">{fieldError}</p>
                        <p className={status === 'error' ? 'error' : 'ok'}>{banner}</p>

                        <h3>Debug</h3>
                        <pre>{JSON.stringify({ toJson: model.toJson(), metaInfo: model.getMetaInfo() }, null, 2)}</pre>
                    </section>
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
