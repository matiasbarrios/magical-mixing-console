// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContextRoot } from '..';
import { useHas } from '../../helpers/has';
import { useHasGet } from '../../helpers/hasGet';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useOptions } from '../../helpers/options';
import { useChanges, defaultOption } from '../../helpers/changes';


// Exported
export const useBusGate = (busId) => {
    const { features: { bus: { gate } } } = useContext(DeviceContextRoot);

    const has = useHas(gate, busId);

    return { has };
};


export const useBusGateOn = (busId) => {
    const { features: { bus: { gate: { on } } } } = useContext(DeviceContextRoot);

    const [has, value, set, toggle] = useHasGetSet(on, busId);

    return {
        has, value, set, toggle,
    };
};


export const useBusGateMode = (busId) => {
    const { features: { bus: { gate: { mode } } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(mode, busId);

    const options = useOptions(mode, busId);

    const get = useCallback(modeId => options.find(o => o.id === modeId), [options]);

    return {
        has, value, set, options, get,
    };
};


export const useBusGateThreshold = (busId) => {
    const {
        features: { bus: { gate: { threshold } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(threshold, busId);

    const minimum = useMemo(() => threshold.minimum, [threshold]);
    const maximum = useMemo(() => threshold.maximum, [threshold]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusGateRange = (busId) => {
    const { features: { bus: { gate: { range } } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(range, busId);

    const minimum = useMemo(() => range.minimum, [range]);
    const maximum = useMemo(() => range.maximum, [range]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusGateAttack = (busId) => {
    const {
        features: { bus: { gate: { attack } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(attack, busId);

    const minimum = useMemo(() => attack.minimum, [attack]);
    const maximum = useMemo(() => attack.maximum, [attack]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusGateHold = (busId) => {
    const {
        features: { bus: { gate: { hold } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(hold, busId);

    const minimum = useMemo(() => hold.minimum, [hold]);
    const maximum = useMemo(() => hold.maximum, [hold]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusGateRelease = (busId) => {
    const {
        features: { bus: { gate: { release } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(release, busId);

    const minimum = useMemo(() => release.minimum, [release]);
    const maximum = useMemo(() => release.maximum, [release]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusGateSidechain = (busId) => {
    const { features: { bus: { gate: { sidechain } } } } = useContext(DeviceContextRoot);

    const has = useHas(sidechain, busId);

    return { has };
};


export const useBusGateSidechainOn = (busId) => {
    const {
        features: { bus: { gate: { sidechain: { on } } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set, toggle] = useHasGetSet(on, busId);

    return {
        has, value, set, toggle,
    };
};


export const useBusGateSidechainSource = (busId) => {
    const {
        features: { bus: { gate: { sidechain: { source } } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(source, busId);

    const options = useOptions(source, busId);

    const get = useCallback(sourceId => options.find(o => o.id === sourceId), [options]);

    return {
        has, value, set, options, get,
    };
};


export const useBusGateSidechainType = (busId) => {
    const {
        features: { bus: { gate: { sidechain: { type } } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(type, busId);

    const options = useOptions(type, busId);

    const get = useCallback(typeId => options.find(o => o.id === typeId), [options]);

    return {
        has, value, set, options, get,
    };
};


export const useBusGateSidechainFrequency = (busId) => {
    const {
        features: { bus: { gate: { sidechain: { frequency } } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(frequency, busId);

    const minimum = useMemo(() => frequency.minimum, [frequency]);
    const maximum = useMemo(() => frequency.maximum, [frequency]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusGateGainReduction = (busId) => {
    const {
        features: { bus: { gate: { gainReduction } } },
    } = useContext(DeviceContextRoot);

    const [has, value] = useHasGet(gainReduction, busId);

    return { has, value };
};


export const useBusGateKey = (busId) => {
    const {
        features: { bus: { gate: { key } } },
    } = useContext(DeviceContextRoot);

    const [has, value] = useHasGet(key, busId);

    return { has, value };
};


export const busGateReset = (changeSchedule, gate, busId) => {
    changeSchedule(gate, [`mode(${busId})`, defaultOption]);
    changeSchedule(gate, [`threshold(${busId})`, gate.threshold.maximum]);
    changeSchedule(gate, [`range(${busId})`, gate.range.minimum]);
    changeSchedule(gate, [`attack(${busId})`, gate.attack.minimum]);
    changeSchedule(gate, [`hold(${busId})`, gate.hold.minimum]);
    changeSchedule(gate, [`release(${busId})`, gate.release.minimum]);
    changeSchedule(gate, [`sidechain(${busId}).on`, false]);
    changeSchedule(gate, [`sidechain(${busId}).source`, defaultOption]);
    changeSchedule(gate, [`sidechain(${busId}).type`, defaultOption]);
    changeSchedule(gate, [`sidechain(${busId}).frequency`, gate.sidechain.frequency.minimum]);
};


export const useBusGateReset = (busId) => {
    const { features: { bus: { gate } } } = useContext(DeviceContextRoot);
    const { runScheduled } = useChanges();

    const reset = useCallback(async () => {
        await runScheduled((sched) => {
            busGateReset(sched, gate, busId);
        });
    }, [gate, busId, runScheduled]);

    return { reset };
};
