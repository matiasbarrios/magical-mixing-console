// Requirements
import { useContext } from 'react';
import { useHas } from '../../helpers/has';
import { DeviceContextRoot } from '..';


// Exported
export const useAutomixHas = () => {
    const { features: { automix } } = useContext(DeviceContextRoot);

    const has = useHas(automix);

    return { has };
};
