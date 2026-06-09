// Requirements
import { useContext, useMemo } from 'react';
import { DeviceContextRoot } from '../..';
import { useGet } from '../../../helpers/get';
import { useHas } from '../../../helpers/has';


// Exported
export const useBusToLevelIsBusLevel = (busIdFrom, busIdTo) => {
    const { features: { bus: { to: { level: { isBusLevel } } } } } = useContext(DeviceContextRoot);

    const ids = useMemo(() => [busIdFrom, busIdTo], [busIdFrom, busIdTo]);
    const has = useHas(isBusLevel, ids);
    const value = useGet(isBusLevel, ids);

    return { has, value };
};
