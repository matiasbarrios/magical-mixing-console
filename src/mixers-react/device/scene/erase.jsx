// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContextRoot } from '..';


// Exported
export const useSceneErase = (sceneId) => {
    const { features: { scene } } = useContext(DeviceContextRoot);

    const erase = useCallback(() => { scene.erase(sceneId); }, [scene, sceneId]);

    return { erase };
};
