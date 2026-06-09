// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useSetMany } from '../../helpers/setMany';


// Exported
export const useOutputTap = (outputId) => {
    const { features: { output: { tap } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(tap, outputId);

    return { has, value, set };
};


export const useOutputTapOptions = () => {
    const { features: { output: { tap } } } = useContext(DeviceContextRoot);

    const options = useMemo(() => tap.options(), [tap]);

    const get = useCallback(tapId => options.find(o => o.id === tapId), [options]);

    return { options, get };
};


export const useOutputTapSetMany = () => {
    const { features: { output: { tap } } } = useContext(DeviceContextRoot);

    const setMany = useSetMany(tap);

    return { setMany };
};
