// Requirements
import { useContext } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';


// Exported
export const useDcaSolo = (dcaId) => {
    const { features: { dca: { solo } } } = useContext(DeviceContext);

    const [has, value, set, toggle] = useHasGetSet(solo, dcaId);

    return {
        has, value, set, toggle,
    };
};
