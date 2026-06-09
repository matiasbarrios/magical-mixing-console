// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useChanges } from '../../helpers/changes';


// Exported
export const useDcaName = (dcaId) => {
    const { features: { dca: { name } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(name, dcaId);

    return { has, value, set };
};


export const useDcaNameResetAll = () => {
    const { features: { dca } } = useContext(DeviceContextRoot);
    const { runScheduled } = useChanges();

    const resetAll = useCallback(async () => {
        await runScheduled((sched) => {
            dca.options.forEach(({ id }) => {
                sched(dca, [`name(${id})`, '']);
            });
        });
    }, [dca, runScheduled]);

    return { resetAll };
};
