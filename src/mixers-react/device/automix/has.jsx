// Requirements
import { useContext } from 'react';
import { useHas } from '../../helpers/has';
import { DeviceContext } from '..';


// Exported
export const useAutomixHas = () => {
    const { features: { automix } } = useContext(DeviceContext);

    const has = useHas(automix);

    return { has };
};
