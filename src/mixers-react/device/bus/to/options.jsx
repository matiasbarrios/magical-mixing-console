// Requirements
import { useContext } from 'react';
import { DeviceContextRoot } from '../..';
import { useOptions } from '../../../helpers/options';


// Exported
export const useBusToOptions = (busId) => {
    const { features: { bus: { to } } } = useContext(DeviceContextRoot);

    const options = useOptions(to, busId);

    return { options };
};
