// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContext } from '..';
import { hasCall } from '../../helpers/feature';
import { useChanges } from '../../helpers/changes';


// Exported
export const automixReset = (changeSchedule, automix) => {
    hasCall(automix, [], () => {
        automix.options.forEach(({ id }) => {
            changeSchedule(automix, [`on(${id})`, false]);
            changeSchedule(automix, [`lock(${id})`, false]);
        });
    });
};


export const useAutomixReset = () => {
    const { features: { automix } } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const reset = useCallback(async () => {
        await runScheduled((sched) => {
            automixReset(sched, automix);
        });
    }, [automix, runScheduled]);

    return { reset };
};
