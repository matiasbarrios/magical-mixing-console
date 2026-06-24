// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContext } from '..';


// Exported
export const useFxOptions = () => {
    const { features: { fx: { options } } } = useContext(DeviceContext);

    const get = useCallback(fxId => options.find(o => o.id === fxId), [options]);

    return { options, get };
};
