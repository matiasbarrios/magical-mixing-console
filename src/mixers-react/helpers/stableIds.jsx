// Requirements
import { useRef } from 'react';
import { toArray } from './feature';


export const sameIds = (a, b) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};


// Exported
export const useStableIds = (ids) => {
    const normalized = toArray(ids);
    const ref = useRef(normalized);
    if (!sameIds(ref.current, normalized)) {
        ref.current = normalized;
    }
    return ref.current;
};
