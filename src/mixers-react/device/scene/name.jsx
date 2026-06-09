// Requirements
import { useContext } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';


// Exported
export const useSceneName = (sceneId) => {
    const { features: { scene: { name } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(name, sceneId);

    return { has, value, set };
};
