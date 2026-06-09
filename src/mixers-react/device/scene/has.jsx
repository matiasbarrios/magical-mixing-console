// Requirements
import { useContext } from 'react';
import { useHas } from '../../helpers/has';
import { DeviceContextRoot } from '..';


// Exported
export const useSceneHas = () => {
    const { features: { scene } } = useContext(DeviceContextRoot);

    const has = useHas(scene);

    return { has };
};
