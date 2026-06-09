// Requirements
import { useCallback } from 'react';
import { hasGetOnlyOnce, hasSet, toArray } from './feature';


// Exported
export const useSetManyIf = ({
    idsToEvaluate, conditionToEvaluate, featureToEvaluate, featureToSet, valueToSet,
}) => {
    const onValueGotten = useCallback((ids, valueToEvaluate) => {
        if (!conditionToEvaluate(valueToEvaluate)) return;
        hasSet(featureToSet, ids, valueToSet);
    }, [conditionToEvaluate, featureToSet, valueToSet]);

    const setManyIf = useCallback(() => {
        idsToEvaluate.forEach((id) => {
            const ids = toArray(id);
            hasGetOnlyOnce(featureToEvaluate, ids, value => onValueGotten(ids, value));
        });
    }, [idsToEvaluate, featureToEvaluate, onValueGotten]);

    return setManyIf;
};
