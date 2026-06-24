// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContext } from '..';


// Exported
export const useSceneSave = (sceneId) => {
    const { features: { scene } } = useContext(DeviceContext);

    const save = useCallback((sceneName) => { scene.save(sceneId, sceneName); }, [scene, sceneId]);

    return { save };
};
