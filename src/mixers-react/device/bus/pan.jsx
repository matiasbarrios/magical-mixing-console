// Requirements
import { useContext, useMemo } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';


// Exported
export const useBusPan = (busId) => {
    const { features: { bus: { pan } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(pan, busId);

    const minimum = useMemo(() => pan.minimum, [pan]);
    const maximum = useMemo(() => pan.maximum, [pan]);

    return {
        has, value, set, minimum, maximum,
    };
};
