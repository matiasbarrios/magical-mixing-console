// Requirements
import { useContext } from 'react';
import { DeviceContext } from '..';
import { useHasGet } from '../../helpers/hasGet';


// Exported
export const useSceneActive = (sceneId) => {
    const { features: { scene: { active } } } = useContext(DeviceContext);

    const [has, value] = useHasGet(active, sceneId);

    return { has, value };
};
