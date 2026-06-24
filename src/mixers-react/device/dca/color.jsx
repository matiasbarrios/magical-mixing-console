// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useOptions } from '../../helpers/options';
import { useChanges, defaultOption } from '../../helpers/changes';


// Exported
export const useDcaColor = (dcaId) => {
    const { features: { dca: { color } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(color, dcaId);

    const options = useOptions(color, dcaId);

    const noneOption = useMemo(() => options.find(o => o.name === 'none'), [options]);

    return {
        has, value, set, options, noneOption,
    };
};


export const useDcaColorResetAll = () => {
    const { features: { dca } } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const resetAll = useCallback(async () => {
        await runScheduled((sched) => {
            dca.options.forEach(({ id }) => {
                sched(dca, [`color(${id})`, defaultOption]);
            });
        });
    }, [dca, runScheduled]);

    return { resetAll };
};
