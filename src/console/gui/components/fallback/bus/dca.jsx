// Requirements
import {
    useBusDca, useBusDcaOn, useBusDcaUnassignAllOf,
    useBusDcaUnassignAllOfAll, useBusMute, useDcaHas,
} from '@magical-mixing/mixers-react';
import { useCallback, useContext, useMemo } from 'react';
import { FallbackContextRoot } from '../context';


// Internal
const useFallbackDcaOn = (busId, dcaId) => {
    const { dcaOptions, setDcaOptions } = useContext(FallbackContextRoot);

    const value = useMemo(() => {
        const dca = dcaOptions.find(o => o.id === dcaId);
        if (!dca) return undefined;
        return dca.buses?.some(id => id === busId);
    }, [busId, dcaId, dcaOptions]);

    const set = useCallback((v) => {
        const r = dcaOptions.find(o => o.id === dcaId);
        if (!r) return;
        if (!r.buses) r.buses = [];
        if (r.buses.some(id => id === busId) && !v) {
            r.buses = r.buses.filter(id => id !== busId);
        } else if (!r.buses.some(id => id === busId) && v) {
            r.buses.push(busId);
        }
        setDcaOptions([...dcaOptions]);
    }, [busId, dcaId, dcaOptions, setDcaOptions]);

    const toggle = useCallback(() => {
        set(!value);
    }, [set, value]);

    return {
        has: true, value, set, toggle,
    };
};


const useFallbackDcaUnassignAllOf = (dcaId) => {
    const { dcaOptions, setDcaOptions } = useContext(FallbackContextRoot);

    const unassignAllOf = useCallback(() => {
        const r = dcaOptions.find(o => o.id === dcaId);
        if (!r) return;
        r.buses = [];
        setDcaOptions([...dcaOptions]);
    }, [dcaId, dcaOptions, setDcaOptions]);

    return { unassignAllOf };
};


const FallbackBusDcaOnFinal = ({ busId, dcaId, children }) => {
    const {
        has, value, set, toggle,
    } = useFallbackDcaOn(busId, dcaId);
    return children({
        has, value, set, toggle,
    });
};


const FallbackBusDcaUnassignAllOfFinal = ({ dcaId, children }) => {
    const { unassignAllOf } = useFallbackDcaUnassignAllOf(dcaId);
    return children({ unassignAllOf });
};


const DeviceBusDcaOn = ({ busId, dcaId, children }) => {
    const {
        has, value, set, toggle,
    } = useBusDcaOn(busId, dcaId);
    return children({
        has, value, set, toggle,
    });
};


const DeviceBusDcaUnassignAllOf = ({ dcaId, children }) => {
    const { unassignAllOf } = useBusDcaUnassignAllOf(dcaId);
    return children({ unassignAllOf });
};


// Exported
export const useFallbackBusDca = (busId) => {
    const { has: hasDca } = useDcaHas();
    const { has: hasBusDca } = useBusDca(busId);
    const { has: hasBusMute } = useBusMute(busId);
    // If device does not have dca, it will be available if it has mute
    if (!hasDca) return { has: hasBusMute };
    // If it does, it has to be enabled for the bus
    return { has: hasBusDca };
};


export const useFallbackBusDcaUnassignAllOfAll = () => {
    const { dcaOptions, setDcaOptions } = useContext(FallbackContextRoot);

    const { unassignAll: unassignAllDevice } = useBusDcaUnassignAllOfAll();

    const unassignAll = useCallback(async () => {
        await unassignAllDevice();
        dcaOptions.forEach((r) => {
            r.buses = [];
        });
        setDcaOptions([...dcaOptions]);
    }, [unassignAllDevice, dcaOptions, setDcaOptions]);

    return { unassignAll };
};


export const FallbackBusDcaOn = ({ busId, dcaId, children }) => {
    const { dcaOptions } = useContext(FallbackContextRoot);
    if (!dcaOptions.find(o => o.id === dcaId)) {
        return <DeviceBusDcaOn busId={busId} dcaId={dcaId}>{children}</DeviceBusDcaOn>;
    }
    return <FallbackBusDcaOnFinal busId={busId} dcaId={dcaId}>{children}</FallbackBusDcaOnFinal>;
};


export const FallbackBusDcaUnassignAllOf = ({ dcaId, children }) => {
    const { dcaOptions } = useContext(FallbackContextRoot);
    if (!dcaOptions.find(o => o.id === dcaId)) {
        return <DeviceBusDcaUnassignAllOf dcaId={dcaId}>{children}</DeviceBusDcaUnassignAllOf>;
    }
    return (
        <FallbackBusDcaUnassignAllOfFinal dcaId={dcaId}>
            {children}
        </FallbackBusDcaUnassignAllOfFinal>
    );
};
