// Requirements
import { useContext, useMemo } from 'react';
import { DeviceContextRoot } from '../..';
import { useHasGetSet } from '../../../helpers/hasGetSet';


// Exported
export const useBusToPan = (busIdFrom, busIdTo) => {
    const { features: { bus: { to: { pan } } } } = useContext(DeviceContextRoot);

    const ids = useMemo(() => [busIdFrom, busIdTo], [busIdFrom, busIdTo]);
    const [has, value, set] = useHasGetSet(pan, ids);

    const minimum = useMemo(() => pan.minimum, [pan]);
    const maximum = useMemo(() => pan.maximum, [pan]);

    return {
        has, value, set, minimum, maximum,
    };
};
