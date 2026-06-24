// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { FallbackContext } from '../context';


// Exported
export const useFallbackNames = (type) => {
    const { names, setNames } = useContext(FallbackContext);

    const nameGet = useCallback(id => names[`${type}-${id}`], [names, type]);

    const nameSet = useCallback((id, name) => {
        const n = { ...names };
        n[`${type}-${id}`] = name;
        setNames(n);
    }, [names, setNames, type]);

    const namesReset = useCallback(() => {
        const n = { ...names };
        Object.keys(n).forEach((k) => {
            if (k.startsWith(`${type}-`)) delete n[k];
        });
        setNames(n);
    }, [names, setNames, type]);

    return { nameGet, nameSet, namesReset };
};


export const useFallbackName = (type, id) => {
    const { nameGet, nameSet } = useFallbackNames(type);

    const value = useMemo(() => nameGet(id) || null, [id, nameGet]);
    const set = useCallback(name => nameSet(id, name), [id, nameSet]);

    return { value, set };
};
