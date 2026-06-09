// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContextRoot } from '..';


// Exported
export const useSceneLoad = (sceneId) => {
    const { features: { scene, cacheRefetch } } = useContext(DeviceContextRoot);

    const load = useCallback(() => {
        scene.load(sceneId);
        cacheRefetch();
    }, [scene, sceneId, cacheRefetch]);

    return { load };
};
