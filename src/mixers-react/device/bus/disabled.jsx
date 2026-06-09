// Requirements
import { useContext } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGet } from '../../helpers/hasGet';


// Exported
export const useBusDisabled = (busId) => {
    const { features: { bus: { disabled } } } = useContext(DeviceContextRoot);

    const [has, value] = useHasGet(disabled, busId);

    return { has, value };
};
