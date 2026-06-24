// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useHas } from '../../helpers/has';
import { useOptions } from '../../helpers/options';


// Exported
export const useBusMonitor = (busId) => {
    const { features: { bus: { monitor } } } = useContext(DeviceContext);

    const has = useHas(monitor, busId);

    return { has };
};


export const useBusMonitorMono = (busId) => {
    const { features: { bus: { monitor: { mono } } } } = useContext(DeviceContext);

    const [has, value, set, toggle] = useHasGetSet(mono, busId);

    return {
        has, value, set, toggle,
    };
};


export const useBusMonitorChannelLineEffectTap = (busId) => {
    const {
        features: { bus: { monitor: { channelLineEffectTap } } },
    } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(channelLineEffectTap, busId);

    const options = useOptions(channelLineEffectTap, busId);

    const get = useCallback(channelLineEffectTapId => options
        .find(o => o.id === channelLineEffectTapId), [options]);

    return {
        has, value, set, options, get,
    };
};


export const useBusMonitorSecondaryTap = (busId) => {
    const {
        features: { bus: { monitor: { secondaryTap } } },
    } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(secondaryTap, busId);

    const options = useOptions(secondaryTap, busId);

    const get = useCallback(secondaryTapId => options
        .find(o => o.id === secondaryTapId), [options]);

    return {
        has, value, set, options, get,
    };
};


export const useBusMonitorSource = (busId) => {
    const { features: { bus: { monitor: { source } } } } = useContext(DeviceContext);

    const has = useHas(source, busId);

    return { has };
};


export const useBusMonitorSourceId = (busId) => {
    const { features: { bus: { monitor: { source: { id } } } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(id, busId);

    const options = useOptions(id, busId);

    const get = useCallback(sourceId => options.find(o => o.id === sourceId), [options]);

    return {
        has, value, set, options, get,
    };
};


export const useBusMonitorSourceTrim = (busId) => {
    const { features: { bus: { monitor: { source: { trim } } } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(trim, busId);

    const minimum = useMemo(() => trim.minimum, [trim]);
    const maximum = useMemo(() => trim.maximum, [trim]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusMonitorDim = (busId) => {
    const { features: { bus: { monitor: { dim } } } } = useContext(DeviceContext);

    const has = useHas(dim, busId);

    return { has };
};


export const useBusMonitorDimOn = (busId) => {
    const { features: { bus: { monitor: { dim: { on } } } } } = useContext(DeviceContext);

    const [has, value, set, toggle] = useHasGetSet(on, busId);

    return {
        has, value, set, toggle,
    };
};


export const useBusMonitorDimAttenuation = (busId) => {
    const {
        features: { bus: { monitor: { dim: { attenuation } } } },
    } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(attenuation, busId);

    const minimum = useMemo(() => attenuation.minimum, [attenuation]);
    const maximum = useMemo(() => attenuation.maximum, [attenuation]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusMonitorDimAtPreLevel = (busId) => {
    const {
        features: { bus: { monitor: { dim: { atPreLevel } } } },
    } = useContext(DeviceContext);

    const [has, value, set, toggle] = useHasGetSet(atPreLevel, busId);

    return {
        has, value, set, toggle,
    };
};
