// Requirements
import { useContext } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGet } from '../../helpers/hasGet';


// Exported
export const useSceneActive = (sceneId) => {
    const { features: { scene: { active } } } = useContext(DeviceContextRoot);

    const [has, value] = useHasGet(active, sceneId);

    return { has, value };
};
