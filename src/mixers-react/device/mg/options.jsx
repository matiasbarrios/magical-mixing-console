// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContextRoot } from '..';


// Exported
export const useMgOptions = () => {
    const { features: { mg: { options } } } = useContext(DeviceContextRoot);

    const get = useCallback(mgId => options.find(o => o.id === mgId), [options]);

    return { options, get };
};
