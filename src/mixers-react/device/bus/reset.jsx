// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContext } from '..';
import { hasCall } from '../../helpers/feature';
import { useChanges, defaultOption } from '../../helpers/changes';
import { busInputResetDeep } from './input';
import { busEqualizerGraphicReset, busEqualizerParametricReset, busEqualizerTrueReset } from './equalizer';
import { busCompressorReset } from './compressor';
import { busGateReset } from './gate';
import { busAutomixReset } from './automix';
import { busFromReset, busToReset } from './to/reset';
import { busMgUnassignAll } from './mg';
import { busDcaUnassignAll } from './dca';


// Internal
const busReset = (
    changeSchedule, bus, input, dca, mg, busId
) => {
    hasCall(bus, [], () => {
        changeSchedule(bus, [`name(${busId})`, '']);
        changeSchedule(bus, [`color(${busId})`, defaultOption]);
        changeSchedule(bus, [`icon(${busId})`, defaultOption]);
        changeSchedule(bus, [`mute(${busId})`, true]);
        changeSchedule(bus, [`level(${busId})`, bus.level.minimum]);
        changeSchedule(bus, [`pan(${busId})`, bus.pan.defaultValue]);
        changeSchedule(bus, [`polarity(${busId})`, false]);
        changeSchedule(bus, [`stereoLink(${busId})`, false]);
        changeSchedule(bus, [`lowCut(${busId}).on`, false]);
        changeSchedule(bus, [`lowCut(${busId}).frequency`, bus.lowCut.frequency.minimum]);

        changeSchedule(bus, [`equalizer(${busId}).on`, false]);
        changeSchedule(bus, [`equalizer(${busId}).mode`, defaultOption]);

        changeSchedule(bus, [`compressor(${busId}).on`, false]);

        changeSchedule(bus, [`gate(${busId}).on`, false]);

        changeSchedule(bus, [`fx(${busId}).on`, true]);
        changeSchedule(bus, [`fx(${busId}).gain`, 0]);

        changeSchedule(bus, [`insert(${busId}).on`, false]);
        changeSchedule(bus, [`insert(${busId}).fx`, bus.insert.fx.unassignedOption.id]);

        changeSchedule(bus, [`monitor(${busId}).mono`, false]);
        changeSchedule(bus, [`monitor(${busId}).channelLineEffectTap`, defaultOption]);
        changeSchedule(bus, [`monitor(${busId}).secondaryTap`, defaultOption]);

        changeSchedule(bus, [`monitor(${busId}).source.id`, defaultOption]);
        changeSchedule(bus, [`monitor(${busId}).source.trim`, bus.monitor.source.trim.defaultValue]);
        changeSchedule(bus, [`monitor(${busId}).dim.on`, false]);
        changeSchedule(bus, [`monitor(${busId}).dim.attenuation`, bus.monitor.dim.attenuation.maximum]);
        changeSchedule(bus, [`monitor(${busId}).dim.atPreLevel`, false]);
    });

    busInputResetDeep(changeSchedule, bus, input, busId);
    busEqualizerParametricReset(changeSchedule, bus.equalizer.parametric, busId);
    busEqualizerGraphicReset(changeSchedule, bus.equalizer.graphic, busId);
    busEqualizerTrueReset(changeSchedule, bus.equalizer.true, busId);
    busCompressorReset(changeSchedule, bus.compressor, busId);
    busGateReset(changeSchedule, bus.gate, busId);
    busAutomixReset(changeSchedule, bus.automix, busId);
    busDcaUnassignAll(changeSchedule, bus, dca, busId);
    busMgUnassignAll(changeSchedule, bus, mg, busId);
    busToReset(changeSchedule, bus.to, busId);
    busFromReset(changeSchedule, bus, busId);
};


export const busesReset = (
    changeSchedule, bus, input, dca, mg
) => {
    hasCall(bus, [], () => {
        bus.options.forEach(({ id }) => {
            busReset(
                changeSchedule, bus, input, dca, mg, id
            );
        });
    });
};


export const useBusReset = (busId) => {
    const {
        features: {
            bus, input, dca, mg,
        },
    } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const reset = useCallback(async () => {
        await runScheduled((sched) => {
            busReset(
                sched, bus, input, dca, mg, busId
            );
        });
    }, [bus, input, dca, mg, busId, runScheduled]);

    return { reset };
};


export const useBusResetAll = () => {
    const {
        features: {
            bus, input, dca, mg,
        },
    } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const resetAll = useCallback(async () => {
        await runScheduled((sched) => {
            busesReset(
                sched, bus, input, dca, mg
            );
        });
    }, [bus, input, dca, mg, runScheduled]);

    return { resetAll };
};
