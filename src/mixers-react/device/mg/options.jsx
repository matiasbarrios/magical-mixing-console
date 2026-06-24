// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContext } from '..';


// Exported
export const useMgOptions = () => {
    const { features: { mg: { options } } } = useContext(DeviceContext);

    const get = useCallback(mgId => options.find(o => o.id === mgId), [options]);

    return { options, get };
};
