// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useOptions } from '../../helpers/options';
import { useChanges, defaultOption } from '../../helpers/changes';


// Exported
export const useBusColor = (busId) => {
    const { features: { bus: { color } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(color, busId);

    const options = useOptions(color, busId);

    const noneOption = useMemo(() => options.find(o => o.name === 'none'), [options]);

    return {
        has, value, set, options, noneOption,
    };
};


export const useBusColorResetAll = () => {
    const { features: { bus } } = useContext(DeviceContextRoot);
    const { runScheduled } = useChanges();

    const resetAll = useCallback(async () => {
        await runScheduled((sched) => {
            bus.options.forEach(({ id }) => {
                sched(bus, [`color(${id})`, defaultOption]);
            });
        });
    }, [bus, runScheduled]);

    return { resetAll };
};
