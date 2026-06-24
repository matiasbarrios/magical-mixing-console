// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useSetMany } from '../../helpers/setMany';


// Exported
export const useOutputTap = (outputId) => {
    const { features: { output: { tap } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(tap, outputId);

    return { has, value, set };
};


export const useOutputTapOptions = () => {
    const { features: { output: { tap } } } = useContext(DeviceContext);

    const options = useMemo(() => tap.options(), [tap]);

    const get = useCallback(tapId => options.find(o => o.id === tapId), [options]);

    return { options, get };
};


export const useOutputTapSetMany = () => {
    const { features: { output: { tap } } } = useContext(DeviceContext);

    const setMany = useSetMany(tap);

    return { setMany };
};
