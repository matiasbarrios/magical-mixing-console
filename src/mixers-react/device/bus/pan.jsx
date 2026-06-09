// Requirements
import { useContext, useMemo } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';


// Exported
export const useBusPan = (busId) => {
    const { features: { bus: { pan } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(pan, busId);

    const minimum = useMemo(() => pan.minimum, [pan]);
    const maximum = useMemo(() => pan.maximum, [pan]);

    return {
        has, value, set, minimum, maximum,
    };
};
