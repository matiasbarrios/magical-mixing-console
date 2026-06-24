// Requirements
import { useContext } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';


// Exported
export const useInputName = (inputId) => {
    const { features: { input: { name } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(name, inputId);

    return { has, value, set };
};
