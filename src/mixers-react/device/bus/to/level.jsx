// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContext } from '../..';
import { useHasGetSet } from '../../../helpers/hasGetSet';
import { useSetMany } from '../../../helpers/setMany';


// Exported
export const useBusToLevel = (busIdFrom, busIdTo) => {
    const { features: { bus: { to: { level } } } } = useContext(DeviceContext);

    const ids = useMemo(() => [busIdFrom, busIdTo], [busIdFrom, busIdTo]);
    const [has, value, set] = useHasGetSet(level, ids);

    const minimum = useMemo(() => level.minimum, [level]);
    const maximum = useMemo(() => level.maximum, [level]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusLevelToLowerMany = () => {
    const { features: { bus: { to: { level } } } } = useContext(DeviceContext);

    const minimum = useMemo(() => level.minimum, [level]);
    const setMany = useSetMany(level);
    const lowerMany = useCallback(ids => setMany(minimum, ids), [setMany, minimum]);

    return { lowerMany };
};
