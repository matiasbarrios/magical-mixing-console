// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContextRoot } from '..';


// Exported
export const useDcaOptions = () => {
    const { features: { dca: { options } } } = useContext(DeviceContextRoot);

    const get = useCallback(dcaId => options.find(o => o.id === dcaId), [options]);

    return { options, get };
};
