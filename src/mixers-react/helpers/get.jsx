// Requirements
import { useEffect, useRef, useState } from 'react';
import { hasOnly, readGet } from './feature';
import { sameIds, useStableIds } from './stableIds';


// Exported
export const useGet = (feature, ids) => {
    const idsArray = useStableIds(ids);

    const [value, setValue] = useState(undefined);
    const prevIdsRef = useRef(null);

    useEffect(() => {
        // Clear stale UI only when ids change (same instance, e.g. pagination). Skip on
        // remount with same ids so cached readGet can paint without a flash.
        if (prevIdsRef.current === null || !sameIds(prevIdsRef.current, idsArray)) {
            setValue(undefined);
        }
        prevIdsRef.current = idsArray;

        let active = true;
        let unlistenGet = null;
        let lastHas;

        const unlistenHas = hasOnly(feature, idsArray, (has) => {
            if (!active) return;

            if (has === lastHas) return;
            lastHas = has;

            if (unlistenGet) {
                unlistenGet();
                unlistenGet = null;
            }

            if (has) {
                unlistenGet = readGet(feature, idsArray, (v) => {
                    if (active) setValue(v);
                });
            } else {
                setValue(undefined);
            }
        });
        return () => {
            active = false;
            if (unlistenHas) unlistenHas();
            if (unlistenGet) unlistenGet();
        };
    }, [feature, idsArray]);

    return value;
};
