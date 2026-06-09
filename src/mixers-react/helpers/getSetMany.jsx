// Requirements
import { useCallback } from 'react';
import { hasGetOnlyOnce, setOnly, toArray } from './feature';
import { useStableIds } from './stableIds';


// Exported
export const useGetSetMany = (feature, ids) => {
    const idsArray = useStableIds(ids);

    const getSetMany = useCallback((valueFromCurrent) => {
        idsArray.forEach((i) => {
            const ia = toArray(i);
            hasGetOnlyOnce(feature, ia, (value) => {
                setOnly(feature, ia, valueFromCurrent(value));
            });
        });
    }, [idsArray, feature]);

    return getSetMany;
};
