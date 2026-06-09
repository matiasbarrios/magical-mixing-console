// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContextRoot } from '..';


// Exported
export const useFxOptions = () => {
    const { features: { fx: { options } } } = useContext(DeviceContextRoot);

    const get = useCallback(fxId => options.find(o => o.id === fxId), [options]);

    return { options, get };
};
