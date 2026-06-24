// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useHas } from '../../helpers/has';
import { useSetManyIf } from '../../helpers/setManyIf';
import { hasCall } from '../../helpers/feature';
import { useChanges } from '../../helpers/changes';


// Exported
export const useBusDca = (busId) => {
    const { features: { bus: { dca } } } = useContext(DeviceContext);

    const has = useHas(dca, busId);

    return { has };
};


export const useBusDcaOn = (busId, dcaId) => {
    const { features: { bus: { dca: { on } } } } = useContext(DeviceContext);

    const [has, value, set, toggle] = useHasGetSet(on, [busId, dcaId]);

    return {
        has, value, set, toggle,
    };
};


export const useBusDcaUnassignAllOf = (dcaId) => {
    const { features: { bus: { options, dca: { on } } } } = useContext(DeviceContext);

    const idsToEvaluate = useMemo(() => options.map(o => [o.id, dcaId]), [options, dcaId]);
    const conditionToEvaluate = useCallback(value => !!value, []);
    const unassignAllOf = useSetManyIf({
        idsToEvaluate,
        conditionToEvaluate,
        featureToEvaluate: on,
        featureToSet: on,
        valueToSet: false,
    });

    return { unassignAllOf };
};


export const busDcaUnassignAll = (changeSchedule, bus, dca, busId) => {
    hasCall(bus.dca, [busId], () => {
        bus.dca.options(busId).forEach(({ id: dcaId }) => {
            changeSchedule(bus.dca, [`on(${busId}, ${dcaId})`, false]);
        });
    });
};


export const useBusDcaUnassignAllOfAll = () => {
    const { features: { bus, dca } } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const unassignAll = useCallback(async () => {
        await runScheduled((sched) => {
            hasCall(dca, [], () => {
                hasCall(bus, [], () => {
                    dca.options.forEach(({ id: dcaId }) => {
                        bus.options.forEach(({ id: busId }) => {
                            sched(bus.dca, [`on(${busId}, ${dcaId})`, false]);
                        });
                    });
                });
            });
        });
    }, [dca, bus, runScheduled]);

    return { unassignAll };
};
