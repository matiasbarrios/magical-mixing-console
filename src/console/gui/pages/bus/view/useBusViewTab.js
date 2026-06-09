// Requirements
import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { useDeviceSettings } from '../../../components/global/settings';


// Constants
const BUS_VIEW_TAB_KEY = 'bus-view-tab';
const TAB_PARAM = 'tab';


// Internal
const buildBusPath = (busId, tabId) => {
    const path = `/bus/${busId}`;
    if (!tabId) return path;
    return `${path}?${TAB_PARAM}=${encodeURIComponent(tabId)}`;
};


const shouldRememberBusTab = tabId => !!tabId && tabId !== 'from';


const resolveBusTab = (preferred, tabs, lastTab, defaultTab) => {
    const ids = tabs.map(o => o.id);
    if (preferred && ids.includes(preferred)) return preferred;
    if (lastTab && ids.includes(lastTab)) return lastTab;
    if (ids.includes(defaultTab)) return defaultTab;
    return ids[0];
};


const useBusLastTab = () => {
    const [lastTab, setLastTab] = useDeviceSettings(BUS_VIEW_TAB_KEY, null);

    const getLast = useCallback(() => lastTab, [lastTab]);

    const remember = useCallback((tabId) => {
        if (!shouldRememberBusTab(tabId)) return;
        if (lastTab === tabId) return;
        setLastTab(tabId);
    }, [lastTab, setLastTab]);

    return { getLast, remember };
};


const useBusViewTab = ({ busId, tabs, defaultTab }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { getLast, remember } = useBusLastTab();

    const urlTab = searchParams.get(TAB_PARAM);
    const stateTab = location.state?.tab;

    const tabActive = useMemo(() => {
        const preferred = urlTab || stateTab;
        if (preferred && tabs.some(o => o.id === preferred)) return preferred;
        // Keep explicit ?tab= while feature hooks populate the tab list (avoids racing shortcuts).
        if (urlTab) return urlTab;
        return resolveBusTab(preferred, tabs, getLast(), defaultTab);
    }, [urlTab, stateTab, tabs, getLast, defaultTab]);

    useEffect(() => {
        if (!busId || !tabs.length) return;

        if (urlTab) {
            if (tabs.some(o => o.id === urlTab)) {
                remember(urlTab);
                if (stateTab) {
                    navigate({ pathname: `/bus/${busId}`, search: searchParams.toString() },
                        { replace: true, state: {} });
                }
            }
            return;
        }

        const resolved = resolveBusTab(stateTab, tabs, getLast(), defaultTab);
        const next = new URLSearchParams(searchParams);
        next.set(TAB_PARAM, resolved);
        navigate({ pathname: `/bus/${busId}`, search: next.toString() },
            { replace: !stateTab, state: {} });
    }, [
        busId, urlTab, stateTab, tabs, defaultTab, getLast, remember, navigate, searchParams,
    ]);

    const onTabChange = useCallback((tabId) => {
        if (!tabs.some(o => o.id === tabId)) return;
        if (searchParams.get(TAB_PARAM) === tabId) return;
        remember(tabId);
        const next = new URLSearchParams(searchParams);
        next.set(TAB_PARAM, tabId);
        navigate({ pathname: `/bus/${busId}`, search: next.toString() });
    }, [busId, tabs, remember, navigate, searchParams]);

    return { tabActive, onTabChange };
};


// Exported
export {
    buildBusPath,
    resolveBusTab,
    shouldRememberBusTab,
    useBusViewTab,
};
