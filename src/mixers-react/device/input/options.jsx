// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContext } from '..';


// Exported
export const useInputOptions = () => {
    const { features: { input: { options } } } = useContext(DeviceContext);

    const get = useCallback(inputId => options.find(o => o.id === inputId), [options]);

    const types = useMemo(() => [...new Set(options.map(o => o.type))], [options]);

    return { options, types, get };
};
