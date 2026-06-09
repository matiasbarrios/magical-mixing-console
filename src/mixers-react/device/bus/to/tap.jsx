// Requirements
import { useContext, useMemo } from 'react';
import { DeviceContextRoot } from '../..';
import { useOptions } from '../../../helpers/options';
import { useHasGetSet } from '../../../helpers/hasGetSet';


// Exported
export const useBusToTap = (busIdFrom, busIdTo) => {
    const { features: { bus: { to: { tap } } } } = useContext(DeviceContextRoot);

    const ids = useMemo(() => [busIdFrom, busIdTo], [busIdFrom, busIdTo]);
    const [has, value, set] = useHasGetSet(tap, ids);

    const options = useOptions(tap, ids);

    return {
        has, value, set, options,
    };
};
