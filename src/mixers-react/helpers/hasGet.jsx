// Requirements
import { useEffect, useRef, useState } from 'react';
import { hasGet } from './feature';
import { sameIds, useStableIds } from './stableIds';


// Exported
export const useHasGet = (feature, ids) => {
    const idsArray = useStableIds(ids);

    const [has, setHas] = useState(undefined);
    const [value, setValue] = useState(undefined);
    const prevIdsRef = useRef(null);

    useEffect(() => {
        if (prevIdsRef.current === null || !sameIds(prevIdsRef.current, idsArray)) {
            setHas(undefined);
            setValue(undefined);
        }
        prevIdsRef.current = idsArray;
        const unlisten = hasGet(feature, idsArray, setHas, setValue);
        return () => { unlisten(); };
    }, [idsArray, feature]);

    return [has, value];
};
