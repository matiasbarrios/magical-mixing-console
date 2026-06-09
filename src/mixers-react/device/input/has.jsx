// Requirements
import { useContext } from 'react';
import { useHas } from '../../helpers/has';
import { DeviceContextRoot } from '..';


// Exported
export const useInputHas = () => {
    const { features: { input } } = useContext(DeviceContextRoot);

    const has = useHas(input);

    return { has };
};
