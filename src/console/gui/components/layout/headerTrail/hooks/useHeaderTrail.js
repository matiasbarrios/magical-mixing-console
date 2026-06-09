// Requirements
import { useEffect, useMemo } from 'react';
import { useHeaderTrail } from '../header';


// Exported
export const useEntityHeaderTrail = ({
    instance,
    entity,
    actions,
    previous,
    next,
}) => {
    const { setHeaderTrail } = useHeaderTrail();

    useEffect(() => {
        setHeaderTrail({
            ...(entity != null && { entity }),
            ...(instance != null && { instance }),
            ...(actions != null && { actions }),
            ...(previous != null && { previous }),
            ...(next != null && { next }),
        });
        return () => setHeaderTrail({});
    }, [instance, entity, actions, previous, next, setHeaderTrail]);
};


export const useListHeaderTrail = (name) => {
    const entity = useMemo(() => ({ name }), [name]);
    useEntityHeaderTrail({ entity });
};
