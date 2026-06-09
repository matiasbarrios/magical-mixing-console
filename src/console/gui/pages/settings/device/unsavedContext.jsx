// Requirements
import {
    createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';


// Variables
const Context = createContext({});


// Internal
export const useUnsavedValues = () => useContext(Context);


export const useValueOrFunction = (valueOrFunction) => {
    const [value, setValue] = useState(undefined);
    const { subscribeForTentative } = useUnsavedValues();

    useEffect(() => {
        if (typeof valueOrFunction === 'function') {
            return subscribeForTentative((tentativeValues) => {
                setValue(valueOrFunction(tentativeValues));
            });
        }
        setValue(valueOrFunction);
        return undefined;
    }, [valueOrFunction, subscribeForTentative]);

    return value;
};


// Exported
export const UnsavedValuesProvider = ({ children }) => {
    const [unsavedValues] = useState(new Map());
    const [savedValues] = useState(new Map());
    const [tentativeValues] = useState(new Map());
    const [tentativeSubscribers] = useState(new Set());
    const [savers] = useState(new Map());

    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const checkUnsavedChanges = useCallback(() => {
        if (unsavedValues.size === 0) {
            setUnsavedChanges(false);
        } else {
            setUnsavedChanges([...unsavedValues.entries()]
                .some(([key, value]) => savedValues.get(key) !== value));
        }
    }, [unsavedValues, savedValues]);

    const callTentativeSubscribers = useCallback(() => {
        const o = Object.fromEntries(tentativeValues);
        tentativeSubscribers.forEach(c => c(o));
    }, [tentativeSubscribers, tentativeValues]);

    const getUnsavedValue = useCallback(id => unsavedValues.get(id), [unsavedValues]);

    const setUnsavedValue = useCallback((id, value) => {
        if (value === undefined) {
            unsavedValues.delete(id);
            tentativeValues.set(id, savedValues.get(id));
        } else {
            unsavedValues.set(id, value);
            tentativeValues.set(id, value);
        }
        checkUnsavedChanges();
        callTentativeSubscribers();
    }, [checkUnsavedChanges, unsavedValues, tentativeValues,
        savedValues, callTentativeSubscribers]);

    const setSavedValue = useCallback((id, value) => {
        savedValues.set(id, value);
        tentativeValues.set(id, value);
        checkUnsavedChanges();
        callTentativeSubscribers();
    }, [savedValues, checkUnsavedChanges, tentativeValues,
        callTentativeSubscribers]);

    const subscribeForTentative = useCallback((s) => {
        tentativeSubscribers.add(s);
        return () => { tentativeSubscribers.delete(s); };
    }, [tentativeSubscribers]);

    const subscribeForSaving = useCallback((key, set) => {
        savers.set(key, set);
        return () => { savers.delete(key); };
    }, [savers]);

    const save = useCallback(() => {
        const changes = [...unsavedValues.keys()];
        savers.forEach((set, key) => {
            const c = changes.find(k => k === key);
            if (!c) return;
            set(unsavedValues.get(key));
        });
    }, [savers, unsavedValues]);

    const status = useMemo(() => ({
        getUnsavedValue,
        setUnsavedValue,
        setSavedValue,
        subscribeForTentative,
        subscribeForSaving,
        unsavedChanges,
        tentativeValues,
        save,
    }), [getUnsavedValue, setUnsavedValue, setSavedValue, subscribeForTentative,
        subscribeForSaving, unsavedChanges, tentativeValues, save]);

    return (
        <Context.Provider value={status}>
            {children}
        </Context.Provider>
    );
};
