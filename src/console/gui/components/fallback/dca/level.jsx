// Requirements
import { useCallback, useContext, useMemo } from 'react';
import {
    useBusLevelSetIncrementMany, useDcaLevel, useDcaLevelPost, useDcaLevelPre,
    useDcaLevelResetAll,
} from '@magical-mixing/mixers-react';
import { FallbackContextRoot } from '../context';


// Constants
const DB_MINIMUM = -90;

const DB_MAXIMUM = 10;


// Internal
const useFallbackLevel = (dcaId) => {
    const { dcaOptions, setDcaOptions } = useContext(FallbackContextRoot);

    const busesIds = useMemo(() => {
        const r = [];
        dcaOptions.find(o => o.id === dcaId)?.buses?.forEach((id) => {
            r.push(id);
        });
        return r;
    }, [dcaId, dcaOptions]);

    const { set: levelBuses } = useBusLevelSetIncrementMany(busesIds);

    const value = useMemo(() => dcaOptions.find(o => o.id === dcaId)?.level, [dcaId, dcaOptions]);

    const set = useCallback((newLevel) => {
        const r = dcaOptions.find(o => o.id === dcaId);
        if (!r) return;
        const oldLevel = r.level;
        r.level = newLevel;
        setDcaOptions([...dcaOptions]);
        if (r.buses) levelBuses(newLevel - oldLevel);
    }, [dcaId, dcaOptions, setDcaOptions, levelBuses]);

    return {
        has: true, value, set, minimum: DB_MINIMUM, maximum: DB_MAXIMUM,
    };
};


const FallbackLevel = ({ dcaId, children }) => {
    const {
        has, value, set, minimum, maximum,
    } = useFallbackLevel(dcaId);
    return children({
        has, value, set, minimum, maximum,
    });
};


const DeviceLevel = ({ dcaId, children }) => {
    const {
        has, value, set, minimum, maximum,
    } = useDcaLevel(dcaId);
    return children({
        has, value, set, minimum, maximum,
    });
};


const FallbackLevelPre = ({ children }) => children({ has: false });


const DeviceLevelPre = ({ dcaId, children }) => {
    const { has, value } = useDcaLevelPre(dcaId);
    return children({ has, value });
};


const FallbackLevelPost = ({ children }) => children({ has: false });


const DeviceLevelPost = ({ dcaId, children }) => {
    const { has, value } = useDcaLevelPost(dcaId);
    return children({ has, value });
};


// Exported
export const useFallbackDcaLevels = () => {
    const { dcaOptions, setDcaOptions } = useContext(FallbackContextRoot);
    const { resetAll: dcaLevelResetAll } = useDcaLevelResetAll();

    const levelsReset = useCallback(async () => {
        await dcaLevelResetAll();
        dcaOptions.forEach((o) => { o.level = DB_MINIMUM; });
        setDcaOptions([...dcaOptions]);
    }, [dcaOptions, setDcaOptions, dcaLevelResetAll]);

    return { levelsReset };
};


export const FallbackDcaLevel = ({ dcaId, children }) => {
    const { dcaOptions } = useContext(FallbackContextRoot);
    if (!dcaOptions
        .find(o => o.id === dcaId)) return <DeviceLevel dcaId={dcaId}>{children}</DeviceLevel>;
    return <FallbackLevel dcaId={dcaId}>{children}</FallbackLevel>;
};


export const FallbackDcaLevelPre = ({ dcaId, children }) => {
    const { dcaOptions } = useContext(FallbackContextRoot);
    if (!dcaOptions.find(o => o.id === dcaId)) {
        return <DeviceLevelPre dcaId={dcaId}>{children}</DeviceLevelPre>;
    }
    return <FallbackLevelPre dcaId={dcaId}>{children}</FallbackLevelPre>;
};


export const FallbackDcaMeterLevelPreHas = ({ dcaId, children }) => {
    const { dcaOptions } = useContext(FallbackContextRoot);
    if (!dcaOptions.find(o => o.id === dcaId)) {
        return <DeviceLevelPre dcaId={dcaId}>{children}</DeviceLevelPre>;
    }
    return children({ has: false });
};


export const FallbackDcaLevelPost = ({ dcaId, children }) => {
    const { dcaOptions } = useContext(FallbackContextRoot);
    if (!dcaOptions.find(o => o.id === dcaId)) {
        return <DeviceLevelPost dcaId={dcaId}>{children}</DeviceLevelPost>;
    }
    return <FallbackLevelPost dcaId={dcaId}>{children}</FallbackLevelPost>;
};


export const FallbackDcaMeterLevelPostHas = ({ dcaId, children }) => {
    const { dcaOptions } = useContext(FallbackContextRoot);
    if (!dcaOptions.find(o => o.id === dcaId)) {
        return <DeviceLevelPost dcaId={dcaId}>{children}</DeviceLevelPost>;
    }
    return children({ has: false });
};
