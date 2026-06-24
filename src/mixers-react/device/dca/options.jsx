// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContext } from '..';


// Exported
export const useDcaOptions = () => {
    const { features: { dca: { options } } } = useContext(DeviceContext);

    const get = useCallback(dcaId => options.find(o => o.id === dcaId), [options]);

    return { options, get };
};
