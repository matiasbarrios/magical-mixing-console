// Requirements
import { useContext } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGet } from '../../helpers/hasGet';


// Exported
export const useOutputVolume = (outputId) => {
    const { features: { output: { volume } } } = useContext(DeviceContextRoot);

    const [has, value] = useHasGet(volume, outputId);

    return { has, value };
};
