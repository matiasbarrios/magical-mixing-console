// Requirements
import { useContext } from 'react';
import { useHas } from '../../helpers/has';
import { DeviceContext } from '..';


// Exported
export const useOutputHas = () => {
    const { features: { output } } = useContext(DeviceContext);

    const has = useHas(output);

    return { has };
};
