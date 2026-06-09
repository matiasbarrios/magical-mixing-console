// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useOptions } from '../../helpers/options';


// Exported
export const useFxBus = (fxId) => {
    const { features: { fx: { bus } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(bus, fxId);

    const options = useOptions(bus, fxId);

    const get = useCallback(busId => options.find(o => o.id === busId), [options]);

    return {
        has, value, set, options, get,
    };
};
