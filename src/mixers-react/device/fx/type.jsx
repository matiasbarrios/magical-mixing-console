// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useOptions } from '../../helpers/options';


// Exported
export const useFxType = (fxId) => {
    const { features: { fx: { type } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(type, fxId);

    const options = useOptions(type, fxId);

    const get = useCallback(typeId => options.find(o => o.id === typeId), [options]);

    return {
        has, value, set, options, get,
    };
};
