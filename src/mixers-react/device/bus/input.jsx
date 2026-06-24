// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useOptions } from '../../helpers/options';
import { useHas } from '../../helpers/has';
import { useHasGet } from '../../helpers/hasGet';
import { inputReset } from '../input/reset';
import { hasCall } from '../../helpers/feature';
import { useChanges, defaultOption } from '../../helpers/changes';


// Exported
export const useBusInput = (busId) => {
    const { features: { bus: { input } } } = useContext(DeviceContext);

    const has = useHas(input, busId);

    return { has };
};


export const useBusInputId = (busId) => {
    const { features: { bus: { input: { id } } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(id, busId);

    const options = useOptions(id, busId);

    const get = useCallback(inputId => options.find(o => o.id === inputId), [options]);

    return {
        has, value, set, options, get,
    };
};


export const useBusInputTrim = (busId, inputId) => {
    const { features: { bus: { input: { trim } } } } = useContext(DeviceContext);

    const ids = useMemo(() => [busId, inputId], [busId, inputId]);
    const [has, value, set] = useHasGetSet(trim, ids);

    const minimum = useMemo(() => trim.minimum, [trim]);
    const maximum = useMemo(() => trim.maximum, [trim]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusInputTrimPre = (busId, inputId) => {
    const { features: { bus: { input: { trim: { pre } } } } } = useContext(DeviceContext);

    const ids = useMemo(() => [busId, inputId], [busId, inputId]);
    const [has, value] = useHasGet(pre, ids);

    return { has, value };
};


export const useBusInputTrimPost = (busId, inputId) => {
    const { features: { bus: { input: { trim: { post } } } } } = useContext(DeviceContext);

    const ids = useMemo(() => [busId, inputId], [busId, inputId]);
    const [has, value] = useHasGet(post, ids);

    return { has, value };
};


export const useBusInputVolume = (busId) => {
    const { features: { bus: { input: { volume } } } } = useContext(DeviceContext);

    const [has, value] = useHasGet(volume, busId);

    return { has, value };
};


export const busInputReset = (changeSchedule, input, busId) => {
    hasCall(input.id, [busId], () => {
        const defaultInput = input.id.defaultOption(busId);
        changeSchedule(input, [`id(${busId})`, defaultInput ? defaultOption : null]);
        if (defaultInput.id !== null) {
            changeSchedule(input, [`trim(${busId},${defaultInput.id})`, input.trim.defaultValue]);
        }
    });
};


export const busInputResetDeep = (changeSchedule, bus, input, busId) => {
    busInputReset(changeSchedule, bus.input, busId);
    hasCall(bus.input.id, [busId], () => {
        const defaultInput = bus.input.id.defaultOption(busId);
        if (defaultInput.id !== null) {
            inputReset(changeSchedule, input, defaultInput.id);
        }
    });
};


export const useBusInputReset = (busId) => {
    const { features: { bus } } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const reset = useCallback(async () => {
        await runScheduled((sched) => {
            busInputReset(sched, bus.input, busId);
        });
    }, [bus.input, busId, runScheduled]);

    return { reset };
};


export const useBusInputResetDeep = (busId) => {
    const { features: { bus, input } } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const reset = useCallback(async () => {
        await runScheduled((sched) => {
            busInputResetDeep(sched, bus, input, busId);
        });
    }, [busId, bus, input, runScheduled]);

    return { reset };
};
