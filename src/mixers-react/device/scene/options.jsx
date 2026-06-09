// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContextRoot } from '..';


// Exported
export const useSceneOptions = () => {
    const { features: { scene: { options } } } = useContext(DeviceContextRoot);

    const get = useCallback(sceneId => options.find(o => o.id === sceneId), [options]);

    return { options, get };
};
