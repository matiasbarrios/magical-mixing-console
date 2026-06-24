// Requirements
import { useLayoutEffect } from 'react';
import { useHeaderTrail } from '../header';


// Internal
const clearCenter = (prev) => {
    if (!prev.center) return prev;
    const { center, ...rest } = prev;
    return rest;
};


// Exported
export const useHeaderTrailCenter = (center, enabled = true) => {
    const { setHeaderTrail } = useHeaderTrail();

    useLayoutEffect(() => {
        if (!enabled || !center) {
            setHeaderTrail(clearCenter);
            return undefined;
        }

        setHeaderTrail(prev => ({ ...prev, center }));
        return () => setHeaderTrail(clearCenter);
    }, [center, enabled, setHeaderTrail]);
};
