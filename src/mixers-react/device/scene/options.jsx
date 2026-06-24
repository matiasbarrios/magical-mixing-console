// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContext } from '..';


// Exported
export const useSceneOptions = () => {
    const { features: { scene: { options } } } = useContext(DeviceContext);

    const get = useCallback(sceneId => options.find(o => o.id === sceneId), [options]);

    return { options, get };
};
