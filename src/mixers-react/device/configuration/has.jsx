// Requirements
import { useContext } from 'react';
import { useHas } from '../../helpers/has';
import { DeviceContextRoot } from '..';


// Exported
export const useConfigurationHas = () => {
    const { features: { configuration } } = useContext(DeviceContextRoot);

    const has = useHas(configuration);

    return { has };
};
