// Requirements
import { useContext } from 'react';
import { useHas } from '../../helpers/has';
import { DeviceContextRoot } from '..';


// Exported
export const useFxHas = () => {
    const { features: { fx } } = useContext(DeviceContextRoot);

    const has = useHas(fx);

    return { has };
};
