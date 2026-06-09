// Requirements
import { useContext } from 'react';
import { useHas } from '../../helpers/has';
import { DeviceContextRoot } from '..';


// Exported
export const useMgHas = () => {
    const { features: { mg } } = useContext(DeviceContextRoot);

    const has = useHas(mg);

    return { has };
};
