// Requirements
import { useContext, useMemo } from 'react';
import { DeviceContext } from '../..';
import { useGet } from '../../../helpers/get';
import { useHas } from '../../../helpers/has';


// Exported
export const useBusToLevelIsBusLevel = (busIdFrom, busIdTo) => {
    const { features: { bus: { to: { level: { isBusLevel } } } } } = useContext(DeviceContext);

    const ids = useMemo(() => [busIdFrom, busIdTo], [busIdFrom, busIdTo]);
    const has = useHas(isBusLevel, ids);
    const value = useGet(isBusLevel, ids);

    return { has, value };
};
