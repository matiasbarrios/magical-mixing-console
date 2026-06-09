// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContextRoot } from '..';


// Exported
export const useSceneSave = (sceneId) => {
    const { features: { scene } } = useContext(DeviceContextRoot);

    const save = useCallback((sceneName) => { scene.save(sceneId, sceneName); }, [scene, sceneId]);

    return { save };
};
