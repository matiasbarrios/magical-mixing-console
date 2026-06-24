// Requirements
import { useContext } from 'react';
import { useHas } from '../../helpers/has';
import { DeviceContext } from '..';


// Exported
export const useInputHas = () => {
    const { features: { input } } = useContext(DeviceContext);

    const has = useHas(input);

    return { has };
};
