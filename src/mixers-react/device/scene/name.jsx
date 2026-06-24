// Requirements
import { useContext } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';


// Exported
export const useSceneName = (sceneId) => {
    const { features: { scene: { name } } } = useContext(DeviceContext);

    const [has, value] = useHasGetSet(name, sceneId);

    return { has, value };
};
