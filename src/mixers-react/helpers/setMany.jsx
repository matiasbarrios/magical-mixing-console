// Requirements
import { useCallback } from 'react';
import { hasSet, toArray } from './feature';
import { useStableIds } from './stableIds';


// Exported
export const useSetMany = (feature, predefinedIds, predefinedValue) => {
    const predefinedIdsArray = useStableIds(predefinedIds);

    const setMany = useCallback((value, ids) => {
        const valueFinal = predefinedValue !== undefined ? predefinedValue : value;
        (ids || predefinedIdsArray).forEach((i) => {
            hasSet(feature, toArray(i), valueFinal);
        });
    }, [feature, predefinedIdsArray, predefinedValue]);

    return setMany;
};
