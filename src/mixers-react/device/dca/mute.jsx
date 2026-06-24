// Requirements
import { useContext, useMemo } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useSetMany } from '../../helpers/setMany';
import { useOptions } from '../../helpers/options';
import { toIds } from '../../helpers/feature';


// Exported
export const useDcaMute = (dcaId) => {
    const { features: { dca: { mute } } } = useContext(DeviceContext);

    const [has, value, set, toggle] = useHasGetSet(mute, dcaId);

    return {
        has, value, set, toggle,
    };
};


export const useDcaMuteAll = () => {
    const { features: { dca } } = useContext(DeviceContext);

    const options = useOptions(dca);

    const ids = useMemo(() => toIds(options), [options]);
    const muteAll = useSetMany(dca.mute, ids, true);

    return { muteAll };
};
