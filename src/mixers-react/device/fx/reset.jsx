// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContext } from '..';
import { hasCall } from '../../helpers/feature';
import { useChanges, defaultOption } from '../../helpers/changes';


// Internal
const scheduleFxReset = (changeSchedule, fx, fxId) => {
    changeSchedule(fx, [`insert(${fxId}).on`, false]);
    changeSchedule(fx, [`insert(${fxId}).left`, defaultOption]);
    changeSchedule(fx, [`insert(${fxId}).right`, defaultOption]);
    changeSchedule(fx, [`type(${fxId})`, defaultOption]);
};


// Exported
export const fxReset = (changeSchedule, fx, fxId) => {
    hasCall(fx, [], () => {
        scheduleFxReset(changeSchedule, fx, fxId);
    });
};


export const fxsReset = (changeSchedule, fx) => {
    hasCall(fx, [], () => {
        fx.options.forEach(({ id }) => {
            scheduleFxReset(changeSchedule, fx, id);
        });
    });
};


export const useFxReset = (fxId) => {
    const { features: { fx } } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const reset = useCallback(async () => {
        await runScheduled((sched) => {
            fxReset(sched, fx, fxId);
        });
    }, [fx, fxId, runScheduled]);

    return { reset };
};


export const useFxResetAll = () => {
    const { features: { fx } } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const resetAll = useCallback(async () => {
        await runScheduled((sched) => {
            fxsReset(sched, fx);
        });
    }, [fx, runScheduled]);

    return { resetAll };
};
