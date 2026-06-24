// Requirements
import { useLayoutEffect, useMemo } from 'react';
import { useHeaderTrail } from '../header';


// Internal
const entityTrailKeys = ['entity', 'instance', 'actions', 'previous', 'next'];

const clearEntityTrail = (prev) => {
    const next = { ...prev };
    entityTrailKeys.forEach((key) => {
        delete next[key];
    });
    return next;
};


// Exported
export const useEntityHeaderTrail = ({
    instance,
    entity,
    actions,
    previous,
    next,
}) => {
    const { setHeaderTrail } = useHeaderTrail();

    useLayoutEffect(() => {
        setHeaderTrail(prev => ({
            ...prev,
            ...(entity != null && { entity }),
            ...(instance != null && { instance }),
            ...(actions != null && { actions }),
            ...(previous != null && { previous }),
            ...(next != null && { next }),
        }));
        return () => setHeaderTrail(clearEntityTrail);
    }, [instance, entity, actions, previous, next, setHeaderTrail]);
};


export const useListHeaderTrail = (name) => {
    const entity = useMemo(() => ({ name }), [name]);
    useEntityHeaderTrail({ entity });
};
