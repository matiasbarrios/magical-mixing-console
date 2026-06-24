// Requirements
import { useContext, useMemo } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useHas } from '../../helpers/has';


// Exported
export const useBusLowCut = (busId) => {
    const { features: { bus: { lowCut } } } = useContext(DeviceContext);

    const has = useHas(lowCut, busId);

    return { has };
};


export const useBusLowCutOn = (busId) => {
    const { features: { bus: { lowCut: { on } } } } = useContext(DeviceContext);

    const [has, value, set, toggle] = useHasGetSet(on, busId);

    return {
        has, value, set, toggle,
    };
};


export const useBusLowCutFrequency = (busId) => {
    const { features: { bus: { lowCut: { frequency } } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(frequency, busId);

    const minimum = useMemo(() => frequency.minimum, [frequency]);
    const maximum = useMemo(() => frequency.maximum, [frequency]);

    return {
        has, value, set, minimum, maximum,
    };
};
