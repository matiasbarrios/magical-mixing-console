// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useOptions } from '../../helpers/options';
import { useChanges, defaultOption } from '../../helpers/changes';


// Exported
export const useBusIcon = (busId) => {
    const { features: { bus: { icon } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(icon, busId);

    const options = useOptions(icon, busId);

    return {
        has, value, set, options,
    };
};


export const useBusIconResetAll = () => {
    const { features: { bus } } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const resetAll = useCallback(async () => {
        await runScheduled((sched) => {
            bus.options.forEach(({ id }) => {
                sched(bus, [`icon(${id})`, defaultOption]);
            });
        });
    }, [bus, runScheduled]);

    return { resetAll };
};
