// Requirements
import {
    createContext, useCallback, useContext, useMemo,
} from 'react';
import { useSettings } from '../global/settings';
import {
    HOTKEY_ACTIONS, getDefaultBindings,
} from '../../helpers/hotkeys/actions';


// Variables
const Context = createContext(null);


// Internal
const mergeBindings = (stored) => {
    const merged = getDefaultBindings();
    if (!stored || typeof stored !== 'object') return merged;

    Object.keys(HOTKEY_ACTIONS).forEach((id) => {
        const binding = stored[id];
        if (!binding?.key) return;
        merged[id] = {
            key: binding.key,
            ctrlKey: !!binding.ctrlKey,
            altKey: !!binding.altKey,
            metaKey: !!binding.metaKey,
            shiftKey: !!binding.shiftKey,
        };
    });

    return merged;
};


// Exported
export const HotkeysProvider = ({ children }) => {
    const [stored, setStored] = useSettings('hotkeys-bindings', null);

    const bindings = useMemo(() => mergeBindings(stored), [stored]);

    const setBinding = useCallback((actionId, binding) => {
        if (!HOTKEY_ACTIONS[actionId]) return;
        setStored({
            ...bindings,
            [actionId]: binding,
        });
    }, [bindings, setStored]);

    const resetBinding = useCallback((actionId) => {
        if (!HOTKEY_ACTIONS[actionId]) return;
        setStored({
            ...bindings,
            [actionId]: { ...HOTKEY_ACTIONS[actionId].defaultBinding },
        });
    }, [bindings, setStored]);

    const resetAll = useCallback(() => {
        setStored(getDefaultBindings());
    }, [setStored]);

    const value = useMemo(() => ({
        bindings,
        setBinding,
        resetBinding,
        resetAll,
        actions: HOTKEY_ACTIONS,
    }), [bindings, setBinding, resetBinding, resetAll]);

    return (
        <Context.Provider value={value}>
            { children }
        </Context.Provider>
    );
};


export const useHotkeys = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error('useHotkeys must be used within HotkeysProvider');
    }
    return context;
};
