// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContextRoot } from '..';
import { useHas } from '../../helpers/has';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useOptions } from '../../helpers/options';
import { useHasGet } from '../../helpers/hasGet';
import { defaultOption, useChanges } from '../../helpers/changes';


// Exported
export const useBusCompressor = (busId) => {
    const { features: { bus: { compressor } } } = useContext(DeviceContextRoot);

    const has = useHas(compressor, busId);

    return { has };
};


export const useBusCompressorOn = (busId) => {
    const { features: { bus: { compressor: { on } } } } = useContext(DeviceContextRoot);

    const [has, value, set, toggle] = useHasGetSet(on, busId);

    return {
        has, value, set, toggle,
    };
};


export const useBusCompressorMode = (busId) => {
    const { features: { bus: { compressor: { mode } } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(mode, busId);

    const options = useOptions(mode, busId);

    const get = useCallback(modeId => options.find(o => o.id === modeId), [options]);

    return {
        has, value, set, options, get,
    };
};


export const useBusCompressorKnee = (busId) => {
    const {
        features: { bus: { compressor: { knee } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(knee, busId);

    const minimum = useMemo(() => knee.minimum, [knee]);
    const maximum = useMemo(() => knee.maximum, [knee]);
    const step = useMemo(() => knee.step, [knee]);

    return {
        has, value, set, minimum, maximum, step,
    };
};


export const useBusCompressorThreshold = (busId) => {
    const {
        features: { bus: { compressor: { threshold } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(threshold, busId);

    const minimum = useMemo(() => threshold.minimum, [threshold]);
    const maximum = useMemo(() => threshold.maximum, [threshold]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusCompressorRatio = (busId) => {
    const { features: { bus: { compressor: { ratio } } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(ratio, busId);

    const options = useOptions(ratio, busId);

    const get = useCallback(ratioId => options.find(o => o.id === ratioId), [options]);

    return {
        has, value, set, options, get,
    };
};


export const useBusCompressorMix = (busId) => {
    const {
        features: { bus: { compressor: { mix } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(mix, busId);

    const minimum = useMemo(() => mix.minimum, [mix]);
    const maximum = useMemo(() => mix.maximum, [mix]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusCompressorGain = (busId) => {
    const {
        features: { bus: { compressor: { gain } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(gain, busId);

    const minimum = useMemo(() => gain.minimum, [gain]);
    const maximum = useMemo(() => gain.maximum, [gain]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusCompressorEnvelope = (busId) => {
    const { features: { bus: { compressor: { envelope } } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(envelope, busId);

    const options = useOptions(envelope, busId);

    const get = useCallback(envelopeId => options.find(o => o.id === envelopeId), [options]);

    return {
        has, value, set, options, get,
    };
};


export const useBusCompressorDetermination = (busId) => {
    const { features: { bus: { compressor: { determination } } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(determination, busId);

    const options = useOptions(determination, busId);

    const get = useCallback(determinationId => options
        .find(o => o.id === determinationId), [options]);

    return {
        has, value, set, options, get,
    };
};


export const useBusCompressorAutomatic = (busId) => {
    const { features: { bus: { compressor: { automatic } } } } = useContext(DeviceContextRoot);

    const [has, value, set, toggle] = useHasGetSet(automatic, busId);

    return {
        has, value, set, toggle,
    };
};


export const useBusCompressorAttack = (busId) => {
    const {
        features: { bus: { compressor: { attack } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(attack, busId);

    const minimum = useMemo(() => attack.minimum, [attack]);
    const maximum = useMemo(() => attack.maximum, [attack]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusCompressorHold = (busId) => {
    const {
        features: { bus: { compressor: { hold } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(hold, busId);

    const minimum = useMemo(() => hold.minimum, [hold]);
    const maximum = useMemo(() => hold.maximum, [hold]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusCompressorRelease = (busId) => {
    const {
        features: { bus: { compressor: { release } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(release, busId);

    const minimum = useMemo(() => release.minimum, [release]);
    const maximum = useMemo(() => release.maximum, [release]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusCompressorSidechain = (busId) => {
    const { features: { bus: { compressor: { sidechain } } } } = useContext(DeviceContextRoot);

    const has = useHas(sidechain, busId);

    return { has };
};


export const useBusCompressorSidechainOn = (busId) => {
    const {
        features: { bus: { compressor: { sidechain: { on } } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set, toggle] = useHasGetSet(on, busId);

    return {
        has, value, set, toggle,
    };
};


export const useBusCompressorSidechainSource = (busId) => {
    const {
        features: { bus: { compressor: { sidechain: { source } } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(source, busId);

    const options = useOptions(source, busId);

    const get = useCallback(sourceId => options.find(o => o.id === sourceId), [options]);

    return {
        has, value, set, options, get,
    };
};


export const useBusCompressorSidechainType = (busId) => {
    const {
        features: { bus: { compressor: { sidechain: { type } } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(type, busId);

    const options = useOptions(type, busId);

    const get = useCallback(typeId => options.find(o => o.id === typeId), [options]);

    return {
        has, value, set, options, get,
    };
};


export const useBusCompressorSidechainFrequency = (busId) => {
    const {
        features: { bus: { compressor: { sidechain: { frequency } } } },
    } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(frequency, busId);

    const minimum = useMemo(() => frequency.minimum, [frequency]);
    const maximum = useMemo(() => frequency.maximum, [frequency]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusCompressorGainReduction = (busId) => {
    const {
        features: { bus: { compressor: { gainReduction } } },
    } = useContext(DeviceContextRoot);

    const [has, value] = useHasGet(gainReduction, busId);

    return { has, value };
};


export const useBusCompressorKey = (busId) => {
    const {
        features: { bus: { compressor: { key } } },
    } = useContext(DeviceContextRoot);

    const [has, value] = useHasGet(key, busId);

    return { has, value };
};


export const busCompressorReset = (changeSchedule, compressor, busId) => {
    changeSchedule(compressor, [`mode(${busId})`, defaultOption]);
    changeSchedule(compressor, [`knee(${busId})`, compressor.knee.minimum]);
    changeSchedule(compressor, [`threshold(${busId})`, compressor.threshold.maximum]);
    changeSchedule(compressor, [`ratio(${busId})`, defaultOption]);
    changeSchedule(compressor, [`mix(${busId})`, compressor.mix.maximum]);
    changeSchedule(compressor, [`gain(${busId})`, compressor.gain.minimum]);
    changeSchedule(compressor, [`envelope(${busId})`, defaultOption]);
    changeSchedule(compressor, [`determination(${busId})`, defaultOption]);
    changeSchedule(compressor, [`automatic(${busId})`, false]);
    changeSchedule(compressor, [`attack(${busId})`, compressor.attack.minimum]);
    changeSchedule(compressor, [`hold(${busId})`, compressor.hold.minimum]);
    changeSchedule(compressor, [`release(${busId})`, compressor.release.minimum]);
    changeSchedule(compressor, [`sidechain(${busId}).on`, false]);
    changeSchedule(compressor, [`sidechain(${busId}).source`, defaultOption]);
    changeSchedule(compressor, [`sidechain(${busId}).type`, defaultOption]);
    changeSchedule(compressor, [`sidechain(${busId}).frequency`, compressor.sidechain.frequency.minimum]);
};


export const useBusCompressorReset = (busId) => {
    const { features: { bus: { compressor } } } = useContext(DeviceContextRoot);
    const { runScheduled } = useChanges();

    const reset = useCallback(async () => {
        await runScheduled((sched) => {
            busCompressorReset(sched, compressor, busId);
        });
    }, [compressor, busId, runScheduled]);

    return { reset };
};
