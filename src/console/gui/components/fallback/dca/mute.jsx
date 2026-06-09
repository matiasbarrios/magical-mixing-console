// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { useBusMuteSetMany, useDcaMute } from '@magical-mixing/mixers-react';
import { FallbackContextRoot } from '../context';


// Internal
const useFallbackMute = (dcaId) => {
    const { dcaOptions, setDcaOptions } = useContext(FallbackContextRoot);

    const busesIds = useMemo(() => {
        const r = [];
        dcaOptions.find(o => o.id === dcaId)?.buses?.forEach((id) => {
            r.push(id);
        });
        return r;
    }, [dcaId, dcaOptions]);

    const { set: muteBuses } = useBusMuteSetMany(busesIds);

    const value = useMemo(() => dcaOptions.find(o => o.id === dcaId)?.mute, [dcaId, dcaOptions]);

    const set = useCallback((mute) => {
        const r = dcaOptions.find(o => o.id === dcaId);
        if (!r) return;
        r.mute = mute;
        setDcaOptions([...dcaOptions]);
        if (r.buses) muteBuses(mute);
    }, [dcaId, dcaOptions, setDcaOptions, muteBuses]);

    const toggle = useCallback(() => {
        set(!value);
    }, [set, value]);

    return {
        has: true, value, set, toggle,
    };
};


const FallbackMute = ({ dcaId, children }) => {
    const { has, value, toggle } = useFallbackMute(dcaId);
    return children({ has, value, toggle });
};


const DeviceMute = ({ dcaId, children }) => {
    const { has, value, toggle } = useDcaMute(dcaId);
    return children({ has, value, toggle });
};


// Exported
export const FallbackDcaMute = ({ dcaId, children }) => {
    const { dcaOptions } = useContext(FallbackContextRoot);
    if (!dcaOptions
        .find(o => o.id === dcaId)) return <DeviceMute dcaId={dcaId}>{children}</DeviceMute>;
    return <FallbackMute dcaId={dcaId}>{children}</FallbackMute>;
};

