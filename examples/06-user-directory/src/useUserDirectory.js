const { useCallback, useEffect, useRef, useState } = React;

// Custom hook combining fetch-hydration, clone-based edits, dynamic rule toggling and optimistic save/rollback.
function useUserDirectory() {
    const [users, setUsers] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [model, setModel] = useState(null);
    const [strict, setStrict] = useState(false);
    const [status, setStatus] = useState('idle');
    const [fieldError, setFieldError] = useState('');
    const [banner, setBanner] = useState('');
    const lastSyncedRef = useRef(null);

    const selectUser = useCallback((id) => {
        setStatus('loading');
        setFieldError('');
        setBanner('');
        window.UD.fetchUser(id).then((raw) => {
            const hydrated = window.UD.toUserModel(raw);
            lastSyncedRef.current = hydrated;
            setSelectedId(id);
            setModel(hydrated.clone());
            setStrict(false);
            setStatus('idle');
        });
    }, []);

    useEffect(() => {
        window.UD.fetchUsers().then((list) => {
            setUsers(list);
            if (list.length > 0) {
                selectUser(list[0].id);
            }
        });
    }, [selectUser]);

    const applyToClone = useCallback((mutator) => {
        setModel((current) => {
            if (!current) {
                return current;
            }
            const next = current.clone();
            try {
                mutator(next);
                setFieldError('');
                return next;
            } catch (error) {
                setFieldError(error.message || String(error));
                return current;
            }
        });
    }, []);

    const updateField = useCallback((setterName, value) => applyToClone((next) => next[setterName](value)), [applyToClone]);

    const updateProfileField = useCallback(
        (setterName, value) => applyToClone((next) => next.getProfile()[setterName](value)),
        [applyToClone]
    );

    const updateContact = useCallback((index, value) => applyToClone((next) => next.setContactsAt(index, value)), [applyToClone]);

    const toggleStrict = useCallback(() => {
        setModel((current) => {
            if (!current) {
                return current;
            }
            const nowStrict = !strict;
            current.updateRules(nowStrict ? window.UD.strictRules : window.UD.baseRules, { mergeRules: nowStrict });
            setStrict(nowStrict);
            setBanner(nowStrict ? 'Merged stricter name/email rules onto the model.' : 'Reset to base rules only.');
            return current.clone();
        });
    }, [strict]);

    const save = useCallback(async () => {
        if (!model || !selectedId) {
            return;
        }
        setStatus('saving');
        setBanner('');
        try {
            const payload = window.UD.fromUserModel(model);
            const saved = await window.UD.saveUser(selectedId, payload);
            setUsers((list) => list.map((user) => (user.id === selectedId ? { ...saved } : user)));
            lastSyncedRef.current = window.UD.toUserModel(saved);
            setStatus('saved');
            setBanner(`Saved at ${saved.savedAt}`);
        } catch (error) {
            // Roll back the optimistic edits to the last known-good server state.
            setModel(lastSyncedRef.current.clone());
            setStatus('error');
            setBanner(error.message || String(error));
        }
    }, [model, selectedId]);

    return {
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
    };
}

window.UD = window.UD || {};
window.UD.useUserDirectory = useUserDirectory;
