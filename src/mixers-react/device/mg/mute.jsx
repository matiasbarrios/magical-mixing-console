// Requirements
import { useContext, useMemo } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useSetMany } from '../../helpers/setMany';
import { useOptions } from '../../helpers/options';
import { toIds } from '../../helpers/feature';


// Exported
export const useMgMute = (mgId) => {
    const { features: { mg: { mute } } } = useContext(DeviceContext);

    const [has, value, set, toggle] = useHasGetSet(mute, mgId);

    return {
        has, value, set, toggle,
    };
};


export const useMgMuteAll = () => {
    const { features: { mg } } = useContext(DeviceContext);

    const options = useOptions(mg);
    const ids = useMemo(() => toIds(options), [options]);
    const muteAll = useSetMany(mg.mute, ids, true);

    return { muteAll };
};
