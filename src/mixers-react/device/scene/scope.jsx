// Requirements
import { useContext, useMemo } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useOptions } from '../../helpers/options';
import { useHas } from '../../helpers/has';
import { useSetMany } from '../../helpers/setMany';


// Exported
export const useSceneScope = (sceneId) => {
    const { features: { scene: { scope } } } = useContext(DeviceContext);

    const has = useHas(scope, sceneId);

    const options = useOptions(scope, sceneId);

    return { has, options };
};


export const useSceneScopeOnAll = (sceneId) => {
    const { features: { scene: { scope } } } = useContext(DeviceContext);

    const options = useOptions(scope, sceneId);
    const ids = useMemo(() => options.map(o => [sceneId, o.id]), [options, sceneId]);
    const set = useSetMany(scope.on, ids);

    return { set };
};


export const useSceneScopeOn = (sceneId, scopeId) => {
    const { features: { scene: { scope: { on } } } } = useContext(DeviceContext);

    const [has, value, set, toggle] = useHasGetSet(on, [sceneId, scopeId]);

    return {
        has, value, set, toggle,
    };
};
