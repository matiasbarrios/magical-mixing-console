// Requirements
import { useContext, useMemo } from 'react';
import { DeviceContextRoot } from '../..';
import { useHasGetSet } from '../../../helpers/hasGetSet';
import { useSetMany } from '../../../helpers/setMany';


// Exported
export const useBusToOn = (busIdFrom, busIdTo) => {
    const { features: { bus: { to: { on } } } } = useContext(DeviceContextRoot);

    const ids = useMemo(() => [busIdFrom, busIdTo], [busIdFrom, busIdTo]);
    const [has, value, set, toggle] = useHasGetSet(on, ids);

    return {
        has, value, set, toggle,
    };
};


export const useBusToOnMonitorSetMany = (busIds) => {
    const { features: { bus: { options, to: { on } } } } = useContext(DeviceContextRoot);

    const from = useMemo(() => options.filter(o => busIds.includes(o.id)), [options, busIds]);
    const to = useMemo(() => options.filter(o => o.type === 'monitor'), [options]);
    const fromToBusIds = useMemo(() => {
        const r = [];
        from.forEach((f) => { to.forEach((t) => { r.push([f.id, t.id]); }); });
        return r;
    }, [from, to]);

    const set = useSetMany(on, fromToBusIds);

    return { set };
};
