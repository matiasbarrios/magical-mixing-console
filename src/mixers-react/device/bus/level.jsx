// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useGet } from '../../helpers/get';
import { useGetSetMany } from '../../helpers/getSetMany';
import { useSetMany } from '../../helpers/setMany';


// Exported
export const useBusLevel = (busId) => {
    const { features: { bus: { level } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(level, busId);

    const minimum = useMemo(() => level.minimum, [level]);
    const maximum = useMemo(() => level.maximum, [level]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusLevelSetIncrementMany = (busIds) => {
    const { features: { bus: { options, level } } } = useContext(DeviceContext);

    const selectedBusIds = useMemo(() => options
        .filter(o => busIds.includes(o.id))
        .map(o => o.id), [options, busIds]);
    const getSetMany = useGetSetMany(level, selectedBusIds);
    const set = useCallback((increment) => { getSetMany(c => c + increment); }, [getSetMany]);

    return { set };
};


export const useBusLevelLowerMany = () => {
    const { features: { bus: { level } } } = useContext(DeviceContext);

    const minimum = useMemo(() => level.minimum, [level]);
    const setMany = useSetMany(level);
    const lowerMany = useCallback(ids => setMany(minimum, ids), [setMany, minimum]);

    return { lowerMany };
};


export const useBusLevelPre = (busId) => {
    const { features: { bus: { level: { pre } } } } = useContext(DeviceContext);

    const value = useGet(pre, busId);

    return { value };
};


export const useBusLevelPost = (busId) => {
    const { features: { bus: { level: { post } } } } = useContext(DeviceContext);

    const value = useGet(post, busId);

    return { value };
};
