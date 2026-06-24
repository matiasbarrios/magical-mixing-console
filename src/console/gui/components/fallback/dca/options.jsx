// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { useDcaOptions } from '@magical-mixing/mixers-react';
import { FallbackContext } from '../context';


// Exported
export const useFallbackDcaOptions = () => {
    const { dcaOptions, setDcaOptions } = useContext(FallbackContext);
    const { options: deviceOptions } = useDcaOptions();

    const options = useMemo(() => [...deviceOptions.map(o => ({
        ...o,
    })), ...dcaOptions], [deviceOptions, dcaOptions]);

    const add = useCallback((name) => {
        const id = Math.max(...options.map(o => o.id), -1) + 1;
        setDcaOptions([...dcaOptions, {
            id,
            number: (id + 1).toString(),
            name,
            mute: false,
            solo: false,
            level: 0,
            buses: [],
        }]);
    }, [options, dcaOptions, setDcaOptions]);

    const get = useCallback(id => options.find(o => o.id === id), [options]);

    const hasRemove = useCallback(id => dcaOptions.some(o => o.id === id), [dcaOptions]);

    const remove = useCallback((id) => {
        setDcaOptions(dcaOptions.filter(o => o.id !== id));
    }, [dcaOptions, setDcaOptions]);

    return {
        options, add, get, hasRemove, remove,
    };
};

