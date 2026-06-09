// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { useMgOptions } from '@magical-mixing/mixers-react';
import { FallbackContextRoot } from '../context';


// Exported
export const useFallbackMgOptions = () => {
    const { mgOptions, setMgOptions } = useContext(FallbackContextRoot);
    const { options: deviceOptions } = useMgOptions();

    const options = useMemo(() => [...deviceOptions.map(o => ({
        ...o,
    })), ...mgOptions], [deviceOptions, mgOptions]);

    const add = useCallback((name) => {
        const id = Math.max(...options.map(o => o.id), -1) + 1;
        setMgOptions([...mgOptions, {
            id,
            number: (id + 1).toString(),
            name,
            mute: false,
            buses: [],
        }]);
    }, [options, mgOptions, setMgOptions]);

    const get = useCallback(id => options.find(o => o.id === id), [options]);

    const hasRemove = useCallback(id => mgOptions.some(o => o.id === id), [mgOptions]);

    const remove = useCallback((id) => {
        setMgOptions(mgOptions.filter(o => o.id !== id));
    }, [mgOptions, setMgOptions]);

    return {
        options, add, get, hasRemove, remove,
    };
};

