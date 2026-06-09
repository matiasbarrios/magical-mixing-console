// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContextRoot } from '..';
import { hasCall, hasGetOnlyOnce } from '../../helpers/feature';
import { useChanges, defaultOption } from '../../helpers/changes';


// Internal
const scheduleInputReset = (changeSchedule, input, inputId) => {
    changeSchedule(input, [`gain(${inputId})`, input.gain.defaultValue]);
    changeSchedule(input, [`phantom(${inputId})`, false]);
};


// Exported
export const inputReset = (changeSchedule, input, inputId) => {
    hasCall(input, [], () => {
        scheduleInputReset(changeSchedule, input, inputId);
    });
};


export const inputsReset = (changeSchedule, input) => {
    hasCall(input, [], () => {
        input.options.forEach(({ id }) => {
            scheduleInputReset(changeSchedule, input, id);
        });
    });
};


export const inputBusAssignmentsReset = (changeSchedule, bus, inputId) => {
    hasCall(bus, [], () => {
        bus.options.forEach(({ id: busId }) => {
            hasGetOnlyOnce(bus.input.id, [busId], (inputIdAssigned) => {
                if (inputIdAssigned !== inputId) return;
                changeSchedule(bus.input, [`id(${busId})`, defaultOption]);
            });
        });
    });
};


export const inputsBusAssignmentsReset = (changeSchedule, bus) => {
    hasCall(bus, [], () => {
        bus.options.forEach(({ id: busId }) => {
            hasCall(bus.input.id, [busId], () => {
                changeSchedule(bus.input, [`id(${busId})`, defaultOption]);
            });
        });
    });
};


export const inputsOutputAssignmentsReset = (changeSchedule, output) => {
    hasCall(output, [], () => {
        output.options.forEach(({ id: outputId }) => {
            hasGetOnlyOnce(output.source, [outputId], (sourceId) => {
                const s = output.source.options(outputId).find(o => o.id === sourceId && o.type === 'input');
                if (s) changeSchedule(output, [`source(${outputId})`, defaultOption]);
            });
        });
    });
};


export const inputsAssignmentsReset = (changeSchedule, bus, output) => {
    inputsBusAssignmentsReset(changeSchedule, bus);
    inputsOutputAssignmentsReset(changeSchedule, output);
};


export const useInputBusAssignmentsReset = (inputId) => {
    const { features: { bus } } = useContext(DeviceContextRoot);
    const { runScheduled } = useChanges();

    const reset = useCallback(async () => {
        await runScheduled((sched) => {
            inputBusAssignmentsReset(sched, bus, inputId);
        });
    }, [bus, inputId, runScheduled]);

    return { reset };
};


export const useInputAssignmentsResetAll = () => {
    const { features: { bus, output } } = useContext(DeviceContextRoot);
    const { runScheduled } = useChanges();

    const resetAll = useCallback(async () => {
        await runScheduled((sched) => {
            inputsAssignmentsReset(sched, bus, output);
        });
    }, [bus, output, runScheduled]);

    return { resetAll };
};


export const useInputResetAll = () => {
    const { features: { bus, input, output } } = useContext(DeviceContextRoot);
    const { runScheduled } = useChanges();

    const resetAll = useCallback(async () => {
        await runScheduled((sched) => {
            inputsReset(sched, input);
            inputsAssignmentsReset(sched, bus, output);
        });
    }, [bus, input, output, runScheduled]);

    return { resetAll };
};
