// Requirements
import { useContext } from 'react';
import { DeviceContext } from '..';
import { useHasGet } from '../../helpers/hasGet';


// Exported
export const useBusDisabled = (busId) => {
    const { features: { bus: { disabled } } } = useContext(DeviceContext);

    const [has, value] = useHasGet(disabled, busId);

    return { has, value };
};
