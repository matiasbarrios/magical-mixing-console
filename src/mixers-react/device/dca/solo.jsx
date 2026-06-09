// Requirements
import { useContext } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';


// Exported
export const useDcaSolo = (dcaId) => {
    const { features: { dca: { solo } } } = useContext(DeviceContextRoot);

    const [has, value, set, toggle] = useHasGetSet(solo, dcaId);

    return {
        has, value, set, toggle,
    };
};
