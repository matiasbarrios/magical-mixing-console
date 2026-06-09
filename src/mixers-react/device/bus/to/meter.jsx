// Requirements
import { useContext, useMemo } from 'react';
import { DeviceContextRoot } from '../..';
import { useHasGet } from '../../../helpers/hasGet';


// Exported
export const useBusToMeter = (busIdFrom, busIdTo) => {
    const { features: { bus: { to: { meter } } } } = useContext(DeviceContextRoot);

    const ids = useMemo(() => [busIdFrom, busIdTo], [busIdFrom, busIdTo]);

    const [has, value] = useHasGet(meter, ids);

    return { has, value };
};
