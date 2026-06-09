// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useChanges } from '../../helpers/changes';


// Exported
export const useMgName = (mgId) => {
    const { features: { mg: { name } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(name, mgId);

    return { has, value, set };
};


export const useMgNameResetAll = () => {
    const { features: { mg } } = useContext(DeviceContextRoot);
    const { runScheduled } = useChanges();

    const resetAll = useCallback(async () => {
        await runScheduled((sched) => {
            mg.options.forEach(({ id }) => {
                sched(mg, [`name(${id})`, '']);
            });
        });
    }, [mg, runScheduled]);

    return { resetAll };
};
