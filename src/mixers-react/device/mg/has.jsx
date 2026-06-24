// Requirements
import { useContext } from 'react';
import { useHas } from '../../helpers/has';
import { DeviceContext } from '..';


// Exported
export const useMgHas = () => {
    const { features: { mg } } = useContext(DeviceContext);

    const has = useHas(mg);

    return { has };
};
