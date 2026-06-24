// Requirements
import { useContext } from 'react';
import { useHas } from '../../helpers/has';
import { DeviceContext } from '..';


// Exported
export const useFxHas = () => {
    const { features: { fx } } = useContext(DeviceContext);

    const has = useHas(fx);

    return { has };
};
