// Requirements
import { useContext, useMemo } from 'react';
import { DeviceContextRoot } from '../..';
import { useGet } from '../../../helpers/get';
import { useHas } from '../../../helpers/has';


// Exported
export const useBusToPanIsBusPan = (busIdFrom, busIdTo) => {
    const { features: { bus: { to: { pan: { isBusPan } } } } } = useContext(DeviceContextRoot);

    const ids = useMemo(() => [busIdFrom, busIdTo], [busIdFrom, busIdTo]);
    const has = useHas(isBusPan, ids);
    const value = useGet(isBusPan, ids);

    return { has, value };
};
