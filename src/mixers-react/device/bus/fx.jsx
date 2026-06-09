// Requirements
import { useContext, useMemo } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useOptions } from '../../helpers/options';
import { useHas } from '../../helpers/has';


// Exported
export const useBusFx = (busId) => {
    const { features: { bus: { fx } } } = useContext(DeviceContextRoot);

    const has = useHas(fx, busId);

    return { has };
};


export const useBusFxId = (busId) => {
    const { features: { bus: { fx: { id } } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(id, busId);

    const options = useOptions(id, busId);

    return {
        has, value, set, options,
    };
};


export const useBusFxOn = (busId) => {
    const { features: { bus: { fx: { on } } } } = useContext(DeviceContextRoot);

    const [has, value, set, toggle] = useHasGetSet(on, busId);

    return {
        has, value, set, toggle,
    };
};


export const useBusFxGain = (busId) => {
    const { features: { bus: { fx: { gain } } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(gain, busId);

    const minimum = useMemo(() => gain.minimum, [gain]);
    const maximum = useMemo(() => gain.maximum, [gain]);

    return {
        has, value, set, minimum, maximum,
    };
};
