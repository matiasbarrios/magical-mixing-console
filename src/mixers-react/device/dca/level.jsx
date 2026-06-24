// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useHasGet } from '../../helpers/hasGet';
import { useChanges } from '../../helpers/changes';


// Exported
export const useDcaLevel = (dcaId) => {
    const { features: { dca: { level } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(level, dcaId);

    const minimum = useMemo(() => level.minimum, [level]);
    const maximum = useMemo(() => level.maximum, [level]);

    return {
        has, value, set, minimum, maximum,
    };
};


export const useDcaLevelResetAll = () => {
    const { features: { dca } } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const resetAll = useCallback(async () => {
        await runScheduled((sched) => {
            dca.options.forEach(({ id }) => {
                sched(dca, [`level(${id})`, dca.level.minimum]);
            });
        });
    }, [dca, runScheduled]);

    return { resetAll };
};


export const useDcaLevelPre = (dcaId) => {
    const { features: { dca: { level: { pre } } } } = useContext(DeviceContext);

    const [has, value] = useHasGet(pre, dcaId);

    return { has, value };
};


export const useDcaLevelPost = (dcaId) => {
    const { features: { dca: { level: { post } } } } = useContext(DeviceContext);

    const [has, value] = useHasGet(post, dcaId);

    return { has, value };
};
