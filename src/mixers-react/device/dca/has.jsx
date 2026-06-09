// Requirements
import { useContext } from 'react';
import { useHas } from '../../helpers/has';
import { DeviceContextRoot } from '..';


// Exported
export const useDcaHas = () => {
    const { features: { dca } } = useContext(DeviceContextRoot);

    const has = useHas(dca);

    return { has };
};
