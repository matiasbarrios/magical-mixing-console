// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContextRoot } from '..';
import { hasCall, hasGetOnlyOnce } from '../../helpers/feature';
import { defaultOption, useChanges } from '../../helpers/changes';


// Internal
const scheduleOutputReset = (changeSchedule, output, outputId) => {
    changeSchedule(output, [`tap(${outputId})`, defaultOption]);
    changeSchedule(output, [`source(${outputId})`, defaultOption]);
};


// Exported
export const outputReset = (changeSchedule, output, outputId) => {
    hasCall(output, [], () => {
        scheduleOutputReset(changeSchedule, output, outputId);
    });
};


export const outputsReset = (changeSchedule, output) => {
    hasCall(output, [], () => {
        output.options.forEach(({ id }) => {
            scheduleOutputReset(changeSchedule, output, id);
        });
    });
};


export const outputResetAllWithSource = (changeSchedule, output, sourceType, sourceId) => {
    hasCall(output, [], () => {
        output.options.forEach(({ id: outputId }) => {
            hasGetOnlyOnce(output.source, [outputId], (sourceIdAssigned) => {
                const s = output.source.options(outputId).find(o => o.id === sourceIdAssigned
                    && o.type === sourceType && o.externalId === sourceId);
                if (s) scheduleOutputReset(changeSchedule, output, outputId);
            });
        });
    });
};


export const useOutputReset = (outputId) => {
    const { features: { output } } = useContext(DeviceContextRoot);
    const { runScheduled } = useChanges();

    const reset = useCallback(async () => {
        await runScheduled((sched) => {
            outputReset(sched, output, outputId);
        });
    }, [output, outputId, runScheduled]);

    return { reset };
};


export const useOutputResetAll = () => {
    const { features: { output } } = useContext(DeviceContextRoot);
    const { runScheduled } = useChanges();

    const resetAll = useCallback(async () => {
        await runScheduled((sched) => {
            outputsReset(sched, output);
        });
    }, [output, runScheduled]);

    return { resetAll };
};


export const useOutputResetAllWithSource = (sourceType, sourceId) => {
    const { features: { output } } = useContext(DeviceContextRoot);
    const { runScheduled } = useChanges();

    const reset = useCallback(async () => {
        await runScheduled((sched) => {
            outputResetAllWithSource(sched, output, sourceType, sourceId);
        });
    }, [output, runScheduled, sourceId, sourceType]);

    return { reset };
};
