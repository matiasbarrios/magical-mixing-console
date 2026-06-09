// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { DeviceContextRoot } from '..';


// Exported
export const useBusOptions = () => {
    const { features: { bus: { options } } } = useContext(DeviceContextRoot);

    const types = useMemo(() => [...new Set(options.map(o => o.type))], [options]);

    const ofType = useCallback(type => options.filter(o => o.type === type), [options]);

    const get = useCallback(busId => options.find(o => o.id === busId), [options]);

    const mainOne = useMemo(() => options.filter(o => o.type === 'main')[0] || null, [options]);

    const soloOne = useMemo(() => options.filter(o => o.type === 'monitor')[0] || null, [options]);

    return {
        options, types, ofType, get, mainOne, soloOne,
    };
};
