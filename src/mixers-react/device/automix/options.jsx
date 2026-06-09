// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContextRoot } from '..';


// Exported
export const useAutomixOptions = () => {
    const { features: { automix: { options } } } = useContext(DeviceContextRoot);

    const get = useCallback(automixId => options.find(o => o.id === automixId), [options]);

    const noneOption = useMemo(() => options.find(o => o.name === 'None') || null, [options]);

    return { options, get, noneOption };
};
