// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContext } from '..';
import { useHasGet } from '../../helpers/hasGet';
import { useHas } from '../../helpers/has';
import { useOptions } from '../../helpers/options';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { hasCall } from '../../helpers/feature';
import { useChanges, defaultOption } from '../../helpers/changes';


// Exported
export const useBusAutomix = (busId) => {
    const { features: { bus: { automix } } } = useContext(DeviceContext);

    const has = useHas(automix, busId);

    return { has };
};


export const useBusAutomixId = (busId) => {
    const { features: { bus: { automix: { id } } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(id, busId);

    const options = useOptions(id, busId);

    return {
        has, value, set, options,
    };
};


export const useBusAutomixWeight = (busId) => {
    const { features: { bus: { automix: { weight } } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(weight, busId);

    const minimum = useMemo(() => weight.minimum, [weight]);
    const maximum = useMemo(() => weight.maximum, [weight]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusAutomixGainReduction = (busId) => {
    const {
        features: { bus: { automix: { gainReduction } } },
    } = useContext(DeviceContext);

    const [has, value] = useHasGet(gainReduction, busId);

    return { has, value };
};


export const busAutomixReset = (changeSchedule, automix, busId) => {
    changeSchedule(automix, [`id(${busId})`, defaultOption]);
    changeSchedule(automix, [`weight(${busId})`, automix.weight.defaultValue]);
};


export const useBusAutomixResetAll = () => {
    const { features: { bus } } = useContext(DeviceContext);
    const { runScheduled } = useChanges();
    const { options, automix } = bus;

    const resetAll = useCallback(async () => {
        await runScheduled((sched) => {
            hasCall(bus, [], () => {
                options.forEach(({ id }) => {
                    busAutomixReset(sched, automix, id);
                });
            });
        });
    }, [bus, automix, options, runScheduled]);

    return { resetAll };
};
