// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContext } from '..';


// Exported
export const useOutputOptions = () => {
    const { features: { output: { options } } } = useContext(DeviceContext);

    const get = useCallback(outputId => options.find(o => o.id === outputId), [options]);

    const types = useMemo(() => [...new Set(options.map(o => o.type))], [options]);

    return { options, types, get };
};
