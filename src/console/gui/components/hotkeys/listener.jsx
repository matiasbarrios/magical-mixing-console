// Requirements
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { findActionForEvent } from '../../helpers/hotkeys/match';
import { resetFocusForHotkeys, shouldIgnoreHotkeyEvent } from '../../helpers/hotkeys/guards';
import {
    activateBusViewTabForEvent,
    isBusViewTabAction,
} from '../../helpers/hotkeys/busViewTabs';
import { buildFocusRoamHandlers } from '../../helpers/hotkeys/focusRoam';
import { cycleTabBar, tabsNextActionId, tabsPrevActionId } from '../../helpers/hotkeys/tabCycle';
import { useNavigateHome } from '../layout/header/useNavigateHome';
import { useHotkeys } from './context';


// Constants
const BUS_VIEW_PATH = /^\/bus\/\d+/;

const ACTION_HANDLERS = {
    'navigate.home': ({ navigateHome }) => navigateHome(),
    ...buildFocusRoamHandlers(),
    [tabsNextActionId]: () => cycleTabBar(1),
    [tabsPrevActionId]: () => cycleTabBar(-1),
};


// Exported
export default () => {
    const { bindings } = useHotkeys();
    const navigateHome = useNavigateHome();
    const { pathname, key: locationKey } = useLocation();

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            resetFocusForHotkeys();
        });
        return () => cancelAnimationFrame(frame);
    }, [locationKey]);

    useEffect(() => {
        const handlers = { navigateHome };
        const isBusView = BUS_VIEW_PATH.test(pathname);

        const handleKeyDown = (event) => {
            if (shouldIgnoreHotkeyEvent(event)) return;

            if (isBusView && activateBusViewTabForEvent(event, bindings)) {
                event.preventDefault();
                return;
            }

            const actionId = findActionForEvent(event, bindings, id => !isBusViewTabAction(id));
            if (!actionId) return;

            const run = ACTION_HANDLERS[actionId];
            if (!run) return;

            const handled = run(handlers);
            if (handled === false) return;

            event.preventDefault();
        };

        document.addEventListener('keydown', handleKeyDown, true);
        return () => document.removeEventListener('keydown', handleKeyDown, true);
    }, [bindings, navigateHome, pathname]);

    return null;
};
