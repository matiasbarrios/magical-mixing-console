// Requirements
import { useContext } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';


// Exported
export const useInputPhantom = (inputId) => {
    const { features: { input: { phantom } } } = useContext(DeviceContextRoot);

    const [has, value, set, toggle] = useHasGetSet(phantom, inputId);

    return {
        has, value, set, toggle,
    };
};
