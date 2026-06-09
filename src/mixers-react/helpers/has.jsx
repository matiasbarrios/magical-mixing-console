// Requirements
import { useEffect, useRef, useState } from 'react';
import { hasOnly } from './feature';
import { sameIds, useStableIds } from './stableIds';


// Exported
export const useHas = (feature, ids) => {
    const idsArray = useStableIds(ids);

    const [has, setHas] = useState(undefined);
    const prevIdsRef = useRef(null);

    useEffect(() => {
        if (prevIdsRef.current === null || !sameIds(prevIdsRef.current, idsArray)) {
            setHas(undefined);
        }
        prevIdsRef.current = idsArray;

        let active = true;
        let lastHas;

        const unlistenHas = hasOnly(feature, idsArray, (h) => {
            if (!active) return;

            if (h === lastHas) return;
            lastHas = h;
            setHas(h);
        });

        return () => {
            active = false;
            if (unlistenHas) unlistenHas();
        };
    }, [idsArray, feature]);

    return has;
};
