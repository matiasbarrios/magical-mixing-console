// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { useBusToOnMonitorSetMany, useDcaSolo } from '@magical-mixing/mixers-react';
import { FallbackContext } from '../context';


// Internal
const useFallbackSolo = (dcaId) => {
    const { dcaOptions, setDcaOptions } = useContext(FallbackContext);

    const busesIds = useMemo(() => {
        const r = [];
        dcaOptions.find(o => o.id === dcaId)?.buses?.forEach((id) => {
            r.push(id);
        });
        return r;
    }, [dcaId, dcaOptions]);

    const { set: soloBuses } = useBusToOnMonitorSetMany(busesIds);

    const value = useMemo(() => dcaOptions.find(o => o.id === dcaId)?.solo, [dcaId, dcaOptions]);

    const set = useCallback((solo) => {
        const r = dcaOptions.find(o => o.id === dcaId);
        if (!r) return;
        r.solo = solo;
        setDcaOptions([...dcaOptions]);
        if (r.buses) soloBuses(solo);
    }, [dcaId, dcaOptions, setDcaOptions, soloBuses]);

    const toggle = useCallback(() => {
        set(!value);
    }, [set, value]);

    return {
        has: true, value, set, toggle,
    };
};


const FallbackSolo = ({ dcaId, children }) => {
    const {
        has, value, set, toggle,
    } = useFallbackSolo(dcaId);
    return children({
        has, value, set, toggle,
    });
};


const DeviceSolo = ({ dcaId, children }) => {
    const {
        has, value, set, toggle,
    } = useDcaSolo(dcaId);
    return children({
        has, value, set, toggle,
    });
};


// Exported
export const FallbackDcaSolo = ({ dcaId, children }) => {
    const { dcaOptions } = useContext(FallbackContext);
    if (!dcaOptions
        .find(o => o.id === dcaId)) return <DeviceSolo dcaId={dcaId}>{children}</DeviceSolo>;
    return <FallbackSolo dcaId={dcaId}>{children}</FallbackSolo>;
};

