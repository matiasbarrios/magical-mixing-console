// Requirements
import { useContext } from 'react';
import { DeviceContext } from '../..';
import { useOptions } from '../../../helpers/options';


// Exported
export const useBusToOptions = (busId) => {
    const { features: { bus: { to } } } = useContext(DeviceContext);

    const options = useOptions(to, busId);

    return { options };
};
