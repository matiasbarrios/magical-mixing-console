// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useHas } from '../../helpers/has';
import { useSetManyIf } from '../../helpers/setManyIf';
import { hasCall } from '../../helpers/feature';
import { useChanges } from '../../helpers/changes';


// Exported
export const useBusMg = (busId) => {
    const { features: { bus: { mg } } } = useContext(DeviceContextRoot);

    const has = useHas(mg, busId);

    return { has };
};


export const useBusMgOn = (busId, mgId) => {
    const { features: { bus: { mg: { on } } } } = useContext(DeviceContextRoot);

    const [has, value, set, toggle] = useHasGetSet(on, [busId, mgId]);

    return {
        has, value, set, toggle,
    };
};


export const useBusMgUnassignAllOf = (mgId) => {
    const { features: { bus: { options, mg: { on } } } } = useContext(DeviceContextRoot);

    const idsToEvaluate = useMemo(() => options.map(o => [o.id, mgId]), [options, mgId]);
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


export const busMgUnassignAll = (changeSchedule, bus, mg, busId) => {
    hasCall(bus.mg, [busId], () => {
        bus.mg.options(busId).forEach(({ id: mgId }) => {
            changeSchedule(bus.mg, [`on(${busId}, ${mgId})`, false]);
        });
    });
};


export const useBusMgUnassignAllOfAll = () => {
    const { features: { bus, mg } } = useContext(DeviceContextRoot);
    const { runScheduled } = useChanges();

    const unassignAll = useCallback(async () => {
        await runScheduled((sched) => {
            hasCall(mg, [], () => {
                hasCall(bus, [], () => {
                    mg.options.forEach(({ id: mgId }) => {
                        bus.options.forEach(({ id: busId }) => {
                            sched(bus.mg, [`on(${busId}, ${mgId})`, false]);
                        });
                    });
                });
            });
        });
    }, [mg, bus, runScheduled]);

    return { unassignAll };
};
