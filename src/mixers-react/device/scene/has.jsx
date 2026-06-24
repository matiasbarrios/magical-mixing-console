// Requirements
import { useContext } from 'react';
import { useHas } from '../../helpers/has';
import { DeviceContext } from '..';


// Exported
export const useSceneHas = () => {
    const { features: { scene } } = useContext(DeviceContext);

    const has = useHas(scene);

    return { has };
};
