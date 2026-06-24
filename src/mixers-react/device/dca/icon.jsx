// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useOptions } from '../../helpers/options';
import { useChanges, defaultOption } from '../../helpers/changes';


// Exported
export const useDcaIcon = (busId) => {
    const { features: { dca: { icon } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(icon, busId);

    const options = useOptions(icon, busId);

    return {
        has, value, set, options,
    };
};


export const useDcaIconResetAll = () => {
    const { features: { dca } } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const resetAll = useCallback(async () => {
        await runScheduled((sched) => {
            dca.options.forEach(({ id }) => {
                sched(dca, [`icon(${id})`, defaultOption]);
            });
        });
    }, [dca, runScheduled]);

    return { resetAll };
};
