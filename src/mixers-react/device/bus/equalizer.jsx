// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { scaleLog } from 'd3';
import { DeviceContext } from '..';
import { useHas } from '../../helpers/has';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useOptions } from '../../helpers/options';
import { hasCall } from '../../helpers/feature';
import { defaultOption, useChanges } from '../../helpers/changes';


// Exported
export const useBusEqualizer = (busId) => {
    const { features: { bus: { equalizer } } } = useContext(DeviceContext);

    const has = useHas(equalizer, busId);

    return { has };
};


export const useBusEqualizerOn = (busId) => {
    const { features: { bus: { equalizer: { on } } } } = useContext(DeviceContext);

    const [has, value, set, toggle] = useHasGetSet(on, busId);

    return {
        has, value, set, toggle,
    };
};


export const useBusEqualizerMode = (busId) => {
    const { features: { bus: { equalizer: { mode } } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(mode, busId);

    const options = useOptions(mode, busId);

    const is = useCallback(modeName => !!options
        .find(o => o.name === modeName && o.id === value), [options, value]);

    return {
        has, value, set, options, is,
    };
};


export const useBusEqualizerParametric = (busId) => {
    const { features: { bus: { equalizer: { parametric } } } } = useContext(DeviceContext);

    const has = useHas(parametric, busId);

    return { has };
};


export const useBusEqualizerParametricOptions = (busId) => {
    const { features: { bus: { equalizer: { parametric } } } } = useContext(DeviceContext);

    const options = useOptions(parametric, busId);

    return { options };
};


export const useBusEqualizerParametricOn = (busId, parameterId) => {
    const {
        features: { bus: { equalizer: { parametric: { on } } } },
    } = useContext(DeviceContext);

    const [has, value, set, toggle] = useHasGetSet(on, [busId, parameterId]);

    return {
        has, value, set, toggle,
    };
};


export const useBusEqualizerParametricType = (busId, parameterId) => {
    const {
        features: { bus: { equalizer: { parametric: { type } } } },
    } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(type, [busId, parameterId]);

    const options = useOptions(type, [busId, parameterId]);

    return {
        has, value, set, options,
    };
};


export const useBusEqualizerParametricFrequency = (busId, parameterId) => {
    const {
        features: { bus: { equalizer: { parametric: { frequency } } } },
    } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(frequency, [busId, parameterId]);

    const minimum = useMemo(() => frequency
        .minimum(busId, parameterId), [frequency, busId, parameterId]);
    const maximum = useMemo(() => frequency
        .maximum(busId, parameterId), [frequency, busId, parameterId]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusEqualizerParametricQ = (busId, parameterId) => {
    const {
        features: { bus: { equalizer: { parametric: { q } } } },
    } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(q, [busId, parameterId]);

    const minimum = useMemo(() => q.minimum, [q]);
    const maximum = useMemo(() => q.maximum, [q]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useBusEqualizerParametricGain = (busId, parameterId) => {
    const {
        features: { bus: { equalizer: { parametric: { gain } } } },
    } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(gain, [busId, parameterId]);

    const minimum = useMemo(() => gain.minimum, [gain]);
    const maximum = useMemo(() => gain.maximum, [gain]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const busEqualizerParametricReset = (changeSchedule, parametric, busId) => {
    hasCall(parametric, [busId], () => {
        const parameters = parametric.options(busId);
        parameters.forEach(({ id: parameterId }, index) => {
            hasCall(parametric.frequency, [busId, parameterId], () => {
                // Calculate the frequency to set
                const minimum = parametric.frequency.minimum(busId, parameterId);
                const maximum = parametric.frequency.maximum(busId, parameterId);
                const decimalToFrequency = scaleLog().domain([minimum, maximum])
                    .range([0, 0.9999]).invert;
                const f = decimalToFrequency(((index + 1) / (parameters.length + 1)) * 0.9999);

                // Set the changes
                if (parametric.isLowCut(busId, parameterId)) {
                    changeSchedule(parametric, [`on(${busId}, ${parameterId})`, false]);
                    changeSchedule(parametric, [`frequency(${busId}, ${parameterId})`, f]);
                } else {
                    changeSchedule(parametric, [`type(${busId}, ${parameterId})`, defaultOption]);
                    changeSchedule(parametric, [`frequency(${busId}, ${parameterId})`, f]);
                    changeSchedule(parametric, [`q(${busId}, ${parameterId})`, parametric.q.defaultValue]);
                    changeSchedule(parametric, [`gain(${busId}, ${parameterId})`, parametric.gain.defaultValue]);
                }
            });
        });
    });
};


export const useBusEqualizerParametricReset = (busId) => {
    const { features: { bus: { equalizer: { parametric } } } } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const reset = useCallback(async () => {
        await runScheduled((sched) => {
            busEqualizerParametricReset(sched, parametric, busId);
        });
    }, [parametric, busId, runScheduled]);

    return { reset };
};


export const useBusEqualizerGraphic = (busId) => {
    const { features: { bus: { equalizer: { graphic } } } } = useContext(DeviceContext);

    const has = useHas(graphic, busId);

    return { has };
};


export const useBusEqualizerGraphicOptions = (busId) => {
    const { features: { bus: { equalizer: { graphic } } } } = useContext(DeviceContext);

    const options = useOptions(graphic, busId);

    return { options };
};


export const useBusEqualizerGraphicGain = (busId, graphId) => {
    const {
        features: { bus: { equalizer: { graphic: { gain } } } },
    } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(gain, [busId, graphId]);

    const minimum = useMemo(() => gain.minimum, [gain]);
    const maximum = useMemo(() => gain.maximum, [gain]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const busEqualizerGraphicReset = (changeSchedule, graphic, busId) => {
    hasCall(graphic, [busId], () => {
        graphic.options(busId).forEach(({ id: gainId }) => {
            changeSchedule(graphic, [`gain(${busId}, ${gainId})`, graphic.gain.defaultValue]);
        });
    });
};


export const useBusEqualizerGraphicReset = (busId) => {
    const { features: { bus: { equalizer: { graphic } } } } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const reset = useCallback(async () => {
        await runScheduled((sched) => {
            busEqualizerGraphicReset(sched, graphic, busId);
        });
    }, [graphic, busId, runScheduled]);

    return { reset };
};


export const useBusEqualizerTrue = (busId) => {
    const { features: { bus: { equalizer: { true: trueE } } } } = useContext(DeviceContext);

    const has = useHas(trueE, busId);

    return { has };
};


export const useBusEqualizerTrueOptions = (busId) => {
    const { features: { bus: { equalizer: { true: trueE } } } } = useContext(DeviceContext);

    const options = useOptions(trueE, busId);

    return { options };
};


export const useBusEqualizerTrueGain = (busId, graphId) => {
    const {
        features: { bus: { equalizer: { true: { gain } } } },
    } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(gain, [busId, graphId]);

    const minimum = useMemo(() => gain.minimum, [gain]);
    const maximum = useMemo(() => gain.maximum, [gain]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const busEqualizerTrueReset = (changeSchedule, truE, busId) => {
    hasCall(truE, [busId], () => {
        truE.options(busId).forEach(({ id: gainId }) => {
            changeSchedule(truE, [`gain(${busId}, ${gainId})`, truE.gain.defaultValue]);
        });
    });
};


export const useBusEqualizerTrueReset = (busId) => {
    const { features: { bus: { equalizer: { true: truE } } } } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const reset = useCallback(async () => {
        await runScheduled((sched) => {
            busEqualizerTrueReset(sched, truE, busId);
        });
    }, [truE, busId, runScheduled]);

    return { reset };
};
