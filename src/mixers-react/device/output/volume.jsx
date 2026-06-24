// Requirements
import { useContext } from 'react';
import { DeviceContext } from '..';
import { useHasGet } from '../../helpers/hasGet';


// Exported
export const useOutputVolume = (outputId) => {
    const { features: { output: { volume } } } = useContext(DeviceContext);

    const [has, value] = useHasGet(volume, outputId);

    return { has, value };
};
