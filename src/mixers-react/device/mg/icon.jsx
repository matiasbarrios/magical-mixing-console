// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useOptions } from '../../helpers/options';
import { useChanges, defaultOption } from '../../helpers/changes';


// Exported
export const useMgIcon = (busId) => {
    const { features: { mg: { icon } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(icon, busId);

    const options = useOptions(icon, busId);

    return {
        has, value, set, options,
    };
};


export const useMgIconResetAll = () => {
    const { features: { mg } } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const resetAll = useCallback(async () => {
        await runScheduled((sched) => {
            mg.options.forEach(({ id }) => {
                sched(mg, [`icon(${id})`, defaultOption]);
            });
        });
    }, [mg, runScheduled]);

    return { resetAll };
};
