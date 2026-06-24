// Requirements
import { useContext, useMemo } from 'react';
import { DeviceContext } from '../..';
import { useHasGet } from '../../../helpers/hasGet';


// Exported
export const useBusToMeter = (busIdFrom, busIdTo) => {
    const { features: { bus: { to: { meter } } } } = useContext(DeviceContext);

    const ids = useMemo(() => [busIdFrom, busIdTo], [busIdFrom, busIdTo]);

    const [has, value] = useHasGet(meter, ids);

    return { has, value };
};
