// Requirements
import { useContext } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';


// Exported
export const useInputName = (inputId) => {
    const { features: { input: { name } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(name, inputId);

    return { has, value, set };
};
