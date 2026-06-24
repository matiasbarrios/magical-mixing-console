// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { useBusMuteSetMany, useMgMute } from '@magical-mixing/mixers-react';
import { FallbackContext } from '../context';


// Internal
const useFallbackMute = (mgId) => {
    const { mgOptions, setMgOptions } = useContext(FallbackContext);

    const busesIds = useMemo(() => {
        const r = [];
        mgOptions.find(o => o.id === mgId)?.buses?.forEach((id) => {
            r.push(id);
        });
        return r;
    }, [mgId, mgOptions]);

    const { set: muteBuses } = useBusMuteSetMany(busesIds);

    const value = useMemo(() => mgOptions.find(o => o.id === mgId)?.mute, [mgId, mgOptions]);

    const set = useCallback((mute) => {
        const r = mgOptions.find(o => o.id === mgId);
        if (!r) return;
        r.mute = mute;
        setMgOptions([...mgOptions]);
        if (r.buses) muteBuses(mute);
    }, [mgId, mgOptions, setMgOptions, muteBuses]);

    const toggle = useCallback(() => {
        set(!value);
    }, [set, value]);

    return {
        has: true, value, set, toggle,
    };
};


const FallbackMute = ({ mgId, children }) => {
    const { has, value, toggle } = useFallbackMute(mgId);
    return children({ has, value, toggle });
};


const DeviceMute = ({ mgId, children }) => {
    const { has, value, toggle } = useMgMute(mgId);
    return children({ has, value, toggle });
};


// Exported
export const FallbackMgMute = ({ mgId, children }) => {
    const { mgOptions } = useContext(FallbackContext);
    if (!mgOptions.find(o => o.id === mgId)) return <DeviceMute mgId={mgId}>{children}</DeviceMute>;
    return <FallbackMute mgId={mgId}>{children}</FallbackMute>;
};

