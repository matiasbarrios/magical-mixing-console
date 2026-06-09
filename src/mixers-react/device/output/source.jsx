// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useOptions } from '../../helpers/options';


// Exported
export const useOutputSourceDefault = (outputId) => {
    const { features: { output: { source } } } = useContext(DeviceContextRoot);

    return useMemo(() => source.defaultOption(outputId), [source, outputId]);
};


export const useOutputSource = (outputId) => {
    const { features: { output: { source } } } = useContext(DeviceContextRoot);

    const [has, value, set] = useHasGetSet(source, outputId);

    const options = useOptions(source, outputId);

    const get = useCallback(sourceId => options.find(o => o.id === sourceId), [options]);

    return {
        has, value, set, options, get,
    };
};
