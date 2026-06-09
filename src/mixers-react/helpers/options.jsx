// Requirements
import { useMemo } from 'react';
import { useIfHasCalculate } from './ifHasCalculate';


// Exported
export const useOptions = (feature, ids) => {
    const emptyArray = useMemo(() => [], []);
    const options = useIfHasCalculate(feature, 'options', ids, emptyArray);
    return options;
};
