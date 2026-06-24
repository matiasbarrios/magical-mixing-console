// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContext } from '../..';
import { hasCall } from '../../../helpers/feature';
import { useChanges, defaultOption } from '../../../helpers/changes';


// Internal
const sendOnAfterReset = () => false;


const busToSendReset = (
    changeSchedule, to, busIdFrom, busIdTo, levelMinimum
) => {
    // on while tap may still be Same level (grpon off), then tap, then aux level OSC
    changeSchedule(to, [`on(${busIdFrom},${busIdTo})`, sendOnAfterReset()]);
    changeSchedule(to, [`tap(${busIdFrom},${busIdTo})`, defaultOption]);
    changeSchedule(to, [`level(${busIdFrom},${busIdTo})`, levelMinimum]);
    changeSchedule(to, [`pan(${busIdFrom},${busIdTo})`, to.pan.defaultValue]);
};


// Exported
export const busToReset = (changeSchedule, to, busIdFrom) => {
    hasCall(to, [busIdFrom], () => {
        const toOptions = to.options(busIdFrom);
        toOptions.forEach(({ id: busIdTo }) => {
            busToSendReset(
                changeSchedule, to, busIdFrom, busIdTo, to.level.minimum
            );
        });
    });
};


export const busFromReset = (changeSchedule, bus, busIdTo) => {
    hasCall(bus, [], () => {
        const busTo = bus.options.find(o => o.id === busIdTo);
        if (!busTo) return;
        bus.options.forEach(({ id: busIdFrom }) => {
            if (bus.to.options(busIdFrom).some(o => o.id === busIdTo)) {
                busToSendReset(
                    changeSchedule, bus.to, busIdFrom, busIdTo, bus.to.level.minimum
                );
            }
        });
    });
};


export const useBusFromToReset = (busId, mode) => {
    const { features: { bus } } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const reset = useCallback(async () => {
        await runScheduled((sched) => {
            if (mode === 'to') busToReset(sched, bus.to, busId);
            if (mode === 'from') busFromReset(sched, bus, busId);
        });
    }, [bus, busId, mode, runScheduled]);

    return { reset };
};
