// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useSetMany } from '../../helpers/setMany';


// Exported
export const useBusMute = (busId) => {
    const { features: { bus: { mute } } } = useContext(DeviceContextRoot);

    const [has, value, set, toggle] = useHasGetSet(mute, busId);

    return {
        has, value, set, toggle,
    };
};


export const useBusMuteSetMany = (busIds) => {
    const { features: { bus: { options, mute } } } = useContext(DeviceContextRoot);

    const selectedBusIds = useMemo(() => options
        .filter(o => busIds.includes(o.id))
        .map(o => o.id), [options, busIds]);
    const set = useSetMany(mute, selectedBusIds);

    return { set };
};


export const useBusMuteMany = () => {
    const { features: { bus: { mute } } } = useContext(DeviceContextRoot);

    const setMany = useSetMany(mute);
    const muteMany = useCallback(ids => setMany(true, ids), [setMany]);
    const unmuteMany = useCallback(ids => setMany(false, ids), [setMany]);

    return { muteMany, unmuteMany };
};


export const useBusMuteMains = () => {
    const { features: { bus: { options, mute } } } = useContext(DeviceContextRoot);

    const mainBusIds = useMemo(() => options
        .filter(o => o.type === 'main')
        .map(o => o.id), [options]);
    const muteMains = useSetMany(mute, mainBusIds, true);

    return { muteMains };
};
