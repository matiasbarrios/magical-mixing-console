// Requirements
import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { useDevice } from '@magical-mixing/mixers-react';
import { readSetting, useDeviceSettings } from '../../../components/global/settings';


// Constants
const BUS_VIEW_TAB_KEY = 'bus-view-tab';
const TAB_PARAM = 'tab';


// Internal
const buildBusPath = (busId, tabId) => {
    const path = `/bus/${busId}`;
    if (!tabId) return path;
    return `${path}?${TAB_PARAM}=${encodeURIComponent(tabId)}`;
};


const normalizeBusTabMemory = (value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return value;
};


const busTabForType = (memory, busType) => {
    if (!busType) return null;
    const tabId = normalizeBusTabMemory(memory)[busType];
    return typeof tabId === 'string' && tabId ? tabId : null;
};


// null means the stored map does not change.
const rememberBusTab = (memory, busType, tabId) => {
    if (!busType || !tabId) return null;
    const map = normalizeBusTabMemory(memory);
    if (map[busType] === tabId) return null;
    return { ...map, [busType]: tabId };
};


const resolveBusTab = (preferred, tabs, lastTab, defaultTab) => {
    const ids = tabs.map(o => o.id);
    if (preferred && ids.includes(preferred)) return preferred;
    if (lastTab && ids.includes(lastTab)) return lastTab;
    if (ids.includes(defaultTab)) return defaultTab;
    return ids[0];
};


// Explicit ?tab= wins when this bus has it. An unknown ?tab= is kept only while
// the tab list is still empty, so a shortcut does not lose to a default mid-load.
// A legacy string in memory is ignored. undefined memory means settings are not read yet.
const resolveBusViewTab = ({
    urlTab, stateTab, tabs, memory, busType, defaultTab,
}) => {
    const ids = tabs.map(o => o.id);
    const urlTabValid = !!urlTab && ids.includes(urlTab);
    const preferred = urlTabValid ? urlTab : stateTab;
    if (preferred && ids.includes(preferred)) return preferred;
    if (urlTab && !tabs.length) return urlTab;
    if (memory === undefined) return urlTab || undefined;
    return resolveBusTab(preferred, tabs, busTabForType(memory, busType), defaultTab);
};


const SETTINGS_UNLOADED = {};


// Settings are loaded before the bus page mounts. Read them on the first render so
// the saved tab is known before the settings hook's effect copies them into state.
const readBusTabMemory = (deviceId) => {
    const devices = readSetting('devices', SETTINGS_UNLOADED);
    if (devices === SETTINGS_UNLOADED) return undefined;
    if (!devices || !deviceId) return null;
    const value = devices[deviceId]?.[BUS_VIEW_TAB_KEY];
    return value === undefined ? null : value;
};


const useBusLastTab = () => {
    const { deviceId } = useDevice();
    const [stored, setStored] = useDeviceSettings(BUS_VIEW_TAB_KEY, null, true);
    const memory = stored === undefined ? readBusTabMemory(deviceId) : stored;

    const remember = useCallback((busType, tabId) => {
        const next = rememberBusTab(memory, busType, tabId);
        if (!next) return;
        setStored(next);
    }, [memory, setStored]);

    return { memory, remember };
};


const useBusViewTab = ({
    busId, busType, tabs, defaultTab,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { memory, remember } = useBusLastTab();

    const urlTab = searchParams.get(TAB_PARAM);
    const stateTab = location.state?.tab;

    const tabActive = useMemo(() => resolveBusViewTab({
        urlTab, stateTab, tabs, memory, busType, defaultTab,
    }), [urlTab, stateTab, tabs, memory, busType, defaultTab]);

    useEffect(() => {
        if (!busId || !busType || !tabs.length || memory === undefined) return;

        const urlTabValid = !!urlTab && tabs.some(o => o.id === urlTab);
        if (urlTabValid) {
            remember(busType, urlTab);
            if (stateTab) {
                navigate({ pathname: `/bus/${busId}`, search: searchParams.toString() },
                    { replace: true, state: {} });
            }
            return;
        }

        const resolved = resolveBusViewTab({
            urlTab: null, stateTab, tabs, memory, busType, defaultTab,
        });
        const next = new URLSearchParams(searchParams);
        next.set(TAB_PARAM, resolved);
        navigate({ pathname: `/bus/${busId}`, search: next.toString() },
            { replace: !!urlTab || !stateTab, state: {} });
    }, [
        busId, busType, urlTab, stateTab, tabs, defaultTab, memory, remember,
        navigate, searchParams,
    ]);

    const onTabChange = useCallback((tabId) => {
        if (!tabs.some(o => o.id === tabId)) return;
        if (searchParams.get(TAB_PARAM) === tabId) return;
        remember(busType, tabId);
        const next = new URLSearchParams(searchParams);
        next.set(TAB_PARAM, tabId);
        navigate({ pathname: `/bus/${busId}`, search: next.toString() });
    }, [busId, busType, tabs, remember, navigate, searchParams]);

    return { tabActive, onTabChange };
};


// Exported
export {
    buildBusPath,
    busTabForType,
    rememberBusTab,
    resolveBusTab,
    resolveBusViewTab,
    useBusViewTab,
};
