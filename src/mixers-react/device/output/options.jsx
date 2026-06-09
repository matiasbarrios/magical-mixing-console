// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContextRoot } from '..';


// Exported
export const useOutputOptions = () => {
    const { features: { output: { options } } } = useContext(DeviceContextRoot);

    const get = useCallback(outputId => options.find(o => o.id === outputId), [options]);

    const types = useMemo(() => [...new Set(options.map(o => o.type))], [options]);

    return { options, types, get };
};
