// Requirements
import { useContext } from 'react';
import { useHas } from '../../helpers/has';
import { DeviceContext } from '..';


// Exported
export const useDcaHas = () => {
    const { features: { dca } } = useContext(DeviceContext);

    const has = useHas(dca);

    return { has };
};
