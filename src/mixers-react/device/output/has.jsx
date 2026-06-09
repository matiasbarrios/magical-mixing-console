// Requirements
import { useContext } from 'react';
import { useHas } from '../../helpers/has';
import { DeviceContextRoot } from '..';


// Exported
export const useOutputHas = () => {
    const { features: { output } } = useContext(DeviceContextRoot);

    const has = useHas(output);

    return { has };
};
