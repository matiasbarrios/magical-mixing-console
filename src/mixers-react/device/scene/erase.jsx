// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContext } from '..';


// Exported
export const useSceneErase = (sceneId) => {
    const { features: { scene } } = useContext(DeviceContext);

    const erase = useCallback(() => { scene.erase(sceneId); }, [scene, sceneId]);

    return { erase };
};
