// Requirements
import { useContext, useMemo } from 'react';
import { DeviceContext } from '..';


// Exported
export const useBusFromOptions = (busId) => {
    const { features: { bus } } = useContext(DeviceContext);

    const options = useMemo(() => {
        const res = bus.options
            .filter(o => bus.to.options(o.id).filter(t => t.id === busId).length);
        res.sort((a, b) => a.id - b.id);
        return res;
    }, [bus.options, bus.to, busId]);

    return { options };
};
