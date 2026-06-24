// Requirements
import { useContext } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';


// Exported
export const useOutputName = (outputId) => {
    const { features: { output: { name } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(name, outputId);

    return { has, value, set };
};
