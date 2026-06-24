// Requirements
import { useContext } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';


// Exported
export const useInputPhantom = (inputId) => {
    const { features: { input: { phantom } } } = useContext(DeviceContext);

    const [has, value, set, toggle] = useHasGetSet(phantom, inputId);

    return {
        has, value, set, toggle,
    };
};
