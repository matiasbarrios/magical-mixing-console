// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useOptions } from '../../helpers/options';
import { useHas } from '../../helpers/has';


// Exported
export const useBusInsert = (busId) => {
    const { features: { bus: { insert } } } = useContext(DeviceContextRoot);

    const has = useHas(insert, busId);

    return { has };
};


export const useBusInsertOn = (busId) => {
    const { features: { bus: { insert: { on } } } } = useContext(DeviceContextRoot);

    const [has, value, set, toggle] = useHasGetSet(on, busId);

    return {
        has, value, set, toggle,
    };
};


export const useBusInsertFx = (busId) => {
    const { features: { bus: { insert: { fx } } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(fx, busId);

    const options = useOptions(fx, busId);

    const get = useCallback(fxId => options.find(o => o.id === fxId), [options]);

    return {
        has, value, set, options, get,
    };
};
