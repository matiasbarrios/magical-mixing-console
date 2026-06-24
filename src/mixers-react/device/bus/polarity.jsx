// Requirements
import { useContext } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';


// Exported
export const useBusPolarity = (busId) => {
    const { features: { bus: { polarity } } } = useContext(DeviceContext);

    const [has, value, set, toggle] = useHasGetSet(polarity, busId);

    return {
        has, value, set, toggle,
    };
};
