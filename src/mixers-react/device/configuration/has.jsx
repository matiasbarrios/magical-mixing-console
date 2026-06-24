// Requirements
import { useContext } from 'react';
import { useHas } from '../../helpers/has';
import { DeviceContext } from '..';


// Exported
export const useConfigurationHas = () => {
    const { features: { configuration } } = useContext(DeviceContext);

    const has = useHas(configuration);

    return { has };
};
