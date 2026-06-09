// Requirements
import {
    useCallback, useEffect, useRef, useState,
} from 'react';
import {
    hasOnly, readGet, setOnly,
} from './feature';
import { sameIds, useStableIds } from './stableIds';


// Exported
export const useHasGetSet = (feature, ids) => {
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

        let active = true;
        let unlistenGet = null;
        let lastHas;

        const unlistenHas = hasOnly(feature, idsArray, (h) => {
            if (!active) return;

            if (h === lastHas) return;
            lastHas = h;
            setHas(h);

            if (unlistenGet) {
                unlistenGet();
                unlistenGet = null;
            }

            if (h) {
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
    }, [idsArray, feature]);

    const set = useCallback((v) => {
        if (has) setOnly(feature, idsArray, v);
    }, [has, feature, idsArray]);

    const toggle = useCallback(() => set(!value), [set, value]);

    return [has, value, set, toggle];
};
