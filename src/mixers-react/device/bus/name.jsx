// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { hasCall } from '../../helpers/feature';
import { useChanges } from '../../helpers/changes';


// Exported
export const useBusName = (busId) => {
    const { features: { bus: { name } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(name, busId);

    return { has, value, set };
};


export const useBusNameResetAll = () => {
    const { features: { bus } } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const resetAll = useCallback(async () => {
        await runScheduled((sched) => {
            hasCall(bus, [], () => {
                bus.options.forEach(({ id }) => {
                    sched(bus, [`name(${id})`, '']);
                });
            });
        });
    }, [bus, runScheduled]);

    return { resetAll };
};
