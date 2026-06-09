// Requirements
import {
    useBusMg, useBusMgOn, useBusMgUnassignAllOf, useBusMute, useMgHas,
    useBusMgUnassignAllOfAll,
} from '@magical-mixing/mixers-react';
import { useCallback, useContext, useMemo } from 'react';
import { FallbackContextRoot } from '../context';


// Internal
const useFallbackMgOn = (busId, mgId) => {
    const { mgOptions, setMgOptions } = useContext(FallbackContextRoot);

    const value = useMemo(() => {
        const mg = mgOptions.find(o => o.id === mgId);
        if (!mg) return undefined;
        return mg.buses?.some(id => id === busId);
    }, [busId, mgId, mgOptions]);

    const set = useCallback((v) => {
        const r = mgOptions.find(o => o.id === mgId);
        if (!r) return;
        if (!r.buses) r.buses = [];
        if (r.buses.some(id => id === busId) && !v) {
            r.buses = r.buses.filter(id => id !== busId);
        } else if (!r.buses.some(id => id === busId) && v) {
            r.buses.push(busId);
        }
        setMgOptions([...mgOptions]);
    }, [busId, mgId, mgOptions, setMgOptions]);

    const toggle = useCallback(() => {
        set(!value);
    }, [set, value]);

    return {
        has: true, value, set, toggle,
    };
};


const useFallbackMgUnassignAllOf = (mgId) => {
    const { mgOptions, setMgOptions } = useContext(FallbackContextRoot);

    const unassignAllOf = useCallback(() => {
        const r = mgOptions.find(o => o.id === mgId);
        if (!r) return;
        r.buses = [];
        setMgOptions([...mgOptions]);
    }, [mgId, mgOptions, setMgOptions]);

    return { unassignAllOf };
};


const FallbackBusMgOnFinal = ({ busId, mgId, children }) => {
    const {
        has, value, set, toggle,
    } = useFallbackMgOn(busId, mgId);
    return children({
        has, value, set, toggle,
    });
};


const FallbackBusMgUnassignAllOfFinal = ({ mgId, children }) => {
    const { unassignAllOf } = useFallbackMgUnassignAllOf(mgId);
    return children({ unassignAllOf });
};


const DeviceBusMgOn = ({ busId, mgId, children }) => {
    const {
        has, value, set, toggle,
    } = useBusMgOn(busId, mgId);
    return children({
        has, value, set, toggle,
    });
};


const DeviceBusMgUnassignAllOf = ({ mgId, children }) => {
    const { unassignAllOf } = useBusMgUnassignAllOf(mgId);
    return children({ unassignAllOf });
};


// Exported
export const useFallbackBusMg = (busId) => {
    const { has: hasMg } = useMgHas();
    const { has: hasBusMg } = useBusMg(busId);
    const { has: hasBusMute } = useBusMute(busId);
    // If device does not have mg, it will be available if it has mute
    if (!hasMg) return { has: hasBusMute };
    // If it does, it has to be enabled for the bus
    return { has: hasBusMg };
};


export const useFallbackBusMgUnassignAllOfAll = () => {
    const { mgOptions, setMgOptions } = useContext(FallbackContextRoot);

    const { unassignAll: unassignAllDevice } = useBusMgUnassignAllOfAll();

    const unassignAll = useCallback(async () => {
        await unassignAllDevice();
        mgOptions.forEach((r) => {
            r.buses = [];
        });
        setMgOptions([...mgOptions]);
    }, [unassignAllDevice, mgOptions, setMgOptions]);

    return { unassignAll };
};


export const FallbackBusMgOn = ({ busId, mgId, children }) => {
    const { mgOptions } = useContext(FallbackContextRoot);
    if (!mgOptions.find(o => o.id === mgId)) {
        return <DeviceBusMgOn busId={busId} mgId={mgId}>{children}</DeviceBusMgOn>;
    }
    return <FallbackBusMgOnFinal busId={busId} mgId={mgId}>{children}</FallbackBusMgOnFinal>;
};


export const FallbackBusMgUnassignAllOf = ({ mgId, children }) => {
    const { mgOptions } = useContext(FallbackContextRoot);
    if (!mgOptions.find(o => o.id === mgId)) {
        return <DeviceBusMgUnassignAllOf mgId={mgId}>{children}</DeviceBusMgUnassignAllOf>;
    }
    return (
        <FallbackBusMgUnassignAllOfFinal mgId={mgId}>
            {children}
        </FallbackBusMgUnassignAllOfFinal>
    );
};
