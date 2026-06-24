// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContext } from '..';


// Exported
export const useSceneLoad = (sceneId) => {
    const { features: { scene, cacheRefetch } } = useContext(DeviceContext);

    const load = useCallback(() => {
        scene.load(sceneId);
        cacheRefetch();
    }, [scene, sceneId, cacheRefetch]);

    return { load };
};
