// Requirements
import { useContext } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useOptions } from '../../helpers/options';
import { useHasGet } from '../../helpers/hasGet';


// Exported
export const useBusRTA = (busId) => {
    const { features: { bus: { rta } } } = useContext(DeviceContextRoot);

    const [has, value] = useHasGet(rta, busId);

    return { has, value };
};


export const useBusRTAPosition = (busId) => {
    const { features: { bus: { rta: { position } } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(position, busId);

    const options = useOptions(position, busId);

    return {
        has, value, set, options,
    };
};
